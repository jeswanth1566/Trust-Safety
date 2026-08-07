"""Admin routes — user management and system stats (admin-only)."""
from datetime import datetime

from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.core.security import require_role

router = APIRouter()


def _serialize_user(u: dict) -> dict:
    created = u.get('created_at')
    return {
        'name': u.get('name'),
        'email': u.get('email'),
        'role': u.get('role'),
        'since': created.isoformat() if isinstance(created, datetime) else None,
    }


@router.get('/users')
async def list_users(admin=Depends(require_role('admin'))):
    """Return all users. Never exposes the password hash."""
    db = get_db()
    users = []
    async for u in db.users.find({}, {'password': 0}).sort('created_at', -1):
        users.append(_serialize_user(u))
    return {'users': users, 'count': len(users)}


@router.get('/stats')
async def admin_stats(admin=Depends(require_role('admin'))):
    """High-level counts for the admin console."""
    db = get_db()
    total_users = await db.users.count_documents({})
    admins = await db.users.count_documents({'role': 'admin'})
    total_decisions = await db.audit_logs.count_documents({})
    return {
        'users': total_users,
        'admins': admins,
        'analysts': total_users - admins,
        'decisions': total_decisions,
    }
