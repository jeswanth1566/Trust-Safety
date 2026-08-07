"""Application configuration loaded from environment variables."""
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
# Load .env from the backend dir; fall back to any .env found up the tree.
_env_path = BASE_DIR / '.env'
if _env_path.exists():
    load_dotenv(_env_path)
else:
    load_dotenv()  # search from CWD upward

SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-me')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
MONGODB_DB = os.getenv('MONGODB_DB', 'trustsafety')

CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')

# Optional seed admin (created on startup if it does not already exist)
SEED_ADMIN_EMAIL = os.getenv('SEED_ADMIN_EMAIL', 'admin@trustsafe.ai')
SEED_ADMIN_PASSWORD = os.getenv('SEED_ADMIN_PASSWORD', 'Admin@123')
SEED_ADMIN_NAME = os.getenv('SEED_ADMIN_NAME', 'Maya Chen')
