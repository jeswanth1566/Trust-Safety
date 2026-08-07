"""MongoDB connection management using Motor (async driver).

Falls back gracefully: if MongoDB is unreachable, the app still starts and
routes that need the DB return a clear 503 instead of crashing on boot.
"""
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import MONGODB_URI, MONGODB_DB

_client: AsyncIOMotorClient | None = None
_db = None


async def connect_to_mongo() -> None:
    """Open the MongoDB connection and verify it with a ping."""
    global _client, _db
    _client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    # Trigger a real connection check so misconfiguration surfaces early.
    await _client.admin.command('ping')
    _db = _client[MONGODB_DB]

    # Helpful indexes (idempotent).
    await _db.users.create_index('email', unique=True)
    await _db.audit_logs.create_index('created_at')


async def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        _client.close()


def get_db():
    """Return the active database handle, or raise if not connected."""
    if _db is None:
        raise RuntimeError('Database is not connected')
    return _db


def is_connected() -> bool:
    return _db is not None
