"""Security utilities: password hashing, JWT creation/decoding, auth deps."""
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY

security = HTTPBearer()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


# ----- Password hashing -----
def hash_password(raw: str) -> str:
    return pwd_context.hash(raw)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ----- JWT -----
def create_access_token(subject: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {'sub': subject, 'role': role, 'exp': expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired token',
        ) from exc


# ----- FastAPI dependencies -----
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict[str, Any]:
    """Decode the bearer token and return the JWT claims."""
    return decode_access_token(credentials.credentials)


def require_role(*roles: str):
    """Dependency factory: allow only users whose role is in `roles`."""

    def checker(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        if user.get('role') not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='Insufficient permissions',
            )
        return user

    return checker
