# TrustSafe AI — Trust & Safety Platform

An AI-powered Trust & Safety platform for e-commerce marketplaces. It scores order
fraud risk, detects counterfeit listings, and moderates reviews — with a premium
dark-themed SaaS dashboard, JWT auth, and full audit logging.

- **Frontend:** React 19 + Vite, Tailwind CSS 4, Framer Motion, Recharts, Sonner, Axios
- **Backend:** FastAPI (Python), Motor (async MongoDB), Pydantic v2, PyJWT, Passlib/bcrypt
- **Database:** MongoDB Atlas (or local MongoDB)

---

## Architecture

```
trust-safety/
├── src/                      # React frontend
│   ├── App.jsx               # Router + protected routes
│   ├── lib/api.js            # Shared axios instance (baseURL + JWT interceptor)
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/                # Landing, auth, dashboard, agents, audit, analytics, admin
│   └── data/                 # Static seed data (model metrics, seller health)
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py           # App entry, CORS, DB lifecycle, admin seeding
│       ├── core/
│       │   ├── config.py     # Env-driven settings
│       │   ├── database.py   # Async MongoDB connection + indexes
│       │   └── security.py   # bcrypt hashing, JWT, role guards
│       └── api/routes/
│           ├── auth.py       # register / login / forgot-password / me
│           ├── agents.py     # risk / counterfeit / review (JWT-guarded, persisted)
│           ├── audit.py      # logs / analytics / dashboard
│           └── admin.py      # users / stats (admin-only)
└── README.md
```

**Data flow:** the React app calls the FastAPI backend through a shared axios instance
that attaches the JWT automatically. Every AI decision is written to the `audit_logs`
MongoDB collection, which powers the Audit Logs, Analytics, and Dashboard views.

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **MongoDB** — a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
  (recommended) or a local `mongod` instance

---

## Setup & Run

### 1. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
copy .env.example .env            # cp on macOS/Linux
```

Edit `backend/.env`:

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Long random string for signing JWTs |
| `ALGORITHM` | JWT algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (default `60`) |
| `MONGODB_URI` | Atlas `mongodb+srv://…` string, or `mongodb://localhost:27017` |
| `MONGODB_DB` | Database name (default `trustsafety`) |
| `CORS_ORIGINS` | Comma-separated allowed origins (default `http://localhost:5173`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PWD` / `SEED_ADMIN_NAME` | Seed admin created on startup |

> **MongoDB Atlas:** create a DB user, allow your IP under Network Access, then paste
> the connection string into `MONGODB_URI`. URL-encode special characters in the password.

Run it:

```powershell
uvicorn app.main:app --reload --port 8000
```

- Health check: <http://localhost:8000/api/health> → `"database": "connected"`
- Interactive API docs (Swagger): <http://localhost:8000/docs>

On first startup the seed admin is created automatically.

### 2. Frontend

```powershell
cd ..            # project root
npm install
npm run dev
```

Open <http://localhost:5173>. To point at a non-default backend, create a `.env` at the
project root with `VITE_API_URL=http://your-backend:8000`.

**Default admin login:** `admin@trustsafe.ai` / `Admin@123` (change via the seed vars).

---

## Authentication & Roles

- Passwords are hashed with **bcrypt**; only hashes are stored.
- Login/register return a **JWT** (`sub`, `role`, `exp`), stored in `localStorage` and
  attached to every request via an axios interceptor.
- Self-service registration is **locked to the `analyst` role** server-side. Admins are
  provisioned via the seed variables (or promoted directly in the database).
- Protected frontend routes are guarded by `ProtectedRoute`; the admin console additionally
  requires the `admin` role (enforced server-side, gracefully handled in the UI).

---

## API Reference

Base URL: `http://localhost:8000`. All `/api/agents/*`, `/api/audit/*`, and `/api/admin/*`
routes require an `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/login` | — | `{ email, pwd }` | Returns `{ access_token, token_type, user }` |
| POST | `/register` | — | `{ email, pwd, name }` | Creates an analyst; returns a token |
| POST | `/forgot-password` | — | `?email=` | Demo stub (always success) |
| GET | `/me` | ✅ | — | Current user profile |

### Agents — `/api/agents`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/risk-score` | Order fraud risk → score, confidence, decision (Approve/Review/Block), explanation |
| POST | `/counterfeit-detection` | Listing authenticity → counterfeit probability, decision, explanation |
| POST | `/review-moderation` | Review analysis → fake-review probability, credibility, sentiment |
| GET | `/health` | Agent liveness |

Each POST persists a record to `audit_logs`.

**Example — risk score**

```bash
curl -X POST http://localhost:8000/api/agents/risk-score \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"order_id":"ORD-1","customer_id":"C-1","amount":428.5,"shipping_country":"US",
       "device_velocity":2.4,"chargeback_history":3,"previous_orders":5,"mismatched_billing":true}'
```

```json
{ "risk_score": 79, "confidence": 98, "decision": "Block", "explanation": "…", "signals": { … } }
```

### Audit & Analytics — `/api/audit`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/logs?q=&limit=` | Recent decisions, searchable by agent/actor/reason |
| GET | `/analytics` | `{ total, by_decision, trend }` aggregations |
| GET | `/dashboard` | `{ kpis, trend, alerts }` for the dashboard |

### Admin — `/api/admin` (admin role required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | All users (password hash never exposed) |
| GET | `/stats` | User/admin/analyst counts + total decisions |

---

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Marketing landing page |
| `/login`, `/register`, `/forgot-password` | Public | Authentication |
| `/dashboard` | Auth | KPIs, live trend chart, recent alerts |
| `/risk-scoring`, `/counterfeit-detection`, `/review-moderation` | Auth | AI agent consoles |
| `/audit-logs` | Auth | Decision timeline with search + CSV export |
| `/analytics` | Auth | Decision volume trend + outcome breakdown |
| `/admin` | Admin | User management + system stats |

---

## Notes & Next Steps

- The three "AI agents" use transparent weighted heuristics with structured JSON output —
  swap in real ML models behind the same endpoints without touching the frontend.
- Counterfeit image upload is currently a UI placeholder (metadata scoring only).
- Suggested hardening for production: refresh tokens, rate limiting, request logging,
  and per-request audit of the acting user via server-side identity rather than JWT `sub` alone.
