"""Trust & Safety Platform API — application entry point."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import (
    CORS_ORIGINS,
    SEED_ADMIN_EMAIL,
    SEED_ADMIN_NAME,
    SEED_ADMIN_PASSWORD,
)
from app.core.database import (
    close_mongo_connection,
    connect_to_mongo,
    get_db,
    is_connected,
)
from app.core.security import hash_password
from app.api.routes import admin, agents, audit, auth

logger = logging.getLogger('uvicorn.error')


async def _seed_admin():
    """Create the seed admin account if it does not exist."""
    db = get_db()
    if await db.users.find_one({'email': SEED_ADMIN_EMAIL.lower()}):
        return
    await db.users.insert_one({
        'email': SEED_ADMIN_EMAIL.lower(),
        'password': hash_password(SEED_ADMIN_PASSWORD),
        'name': SEED_ADMIN_NAME,
        'role': 'admin',
    })
    logger.info('Seeded admin account: %s', SEED_ADMIN_EMAIL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_mongo()
        await _seed_admin()
        logger.info('MongoDB connected.')
    except Exception as exc:  # noqa: BLE001 - keep app bootable for local dev
        logger.warning('MongoDB unavailable at startup: %s', exc)
    yield
    await close_mongo_connection()


app = FastAPI(title='Trust & Safety Platform API', version='1.0.0', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix='/api/auth', tags=['auth'])
app.include_router(agents.router, prefix='/api/agents', tags=['agents'])
app.include_router(audit.router, prefix='/api/audit', tags=['audit'])
app.include_router(admin.router, prefix='/api/admin', tags=['admin'])


@app.get('/api/health')
def health_check():
    return {
        'status': 'ok',
        'service': 'trust-safety-api',
        'database': 'connected' if is_connected() else 'disconnected',
    }
