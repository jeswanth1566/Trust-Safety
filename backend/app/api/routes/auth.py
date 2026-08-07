"""Authentication routes: register, login, forgot-password, current user.

Backed by MongoDB. Passwords are hashed with bcrypt. Registration is locked
to the 'analyst' role server-side to prevent client-driven privilege escalation.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description='Minimum 8 characters')
    name: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: dict


def _public_user(user: dict) -> dict:
    return {
        'email': user['email'],
        'name': user['name'],
        'role': user['role'],
        'logged_in_at': datetime.now(timezone.utc).isoformat(),
    }


@router.post('/login', response_model=TokenResponse)
async def login(payload: LoginRequest):
    db = get_db()
    user = await db.users.find_one({'email': payload.email.lower()})
    if not user or not verify_password(payload.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials'
        )
    return {
        'access_token': create_access_token(user['email'], user['role']),
        'token_type': 'bearer',
        'user': _public_user(user),
    }


@router.post('/register', response_model=TokenResponse, status_code=201)
async def register(payload: RegisterRequest):
    db = get_db()
    email = payload.email.lower()
    if await db.users.find_one({'email': email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='User already exists'
        )

    # Role is fixed server-side -- new self-service accounts are always analysts.
    user = {
        'email': email,
        'password': hash_password(payload.password),
        'name': payload.name,
        'role': 'analyst',
        'created_at': datetime.now(timezone.utc),
    }
    await db.users.insert_one(user)

    return {
        'access_token': create_access_token(user['email'], user['role']),
        'token_type': 'bearer',
        'user': _public_user(user),
    }


@router.post('/forgot-password')
async def forgot_password(email: EmailStr):
    # Always return success to avoid leaking which emails are registered.
    return {
        'status': 'success',
        'message': f'If an account exists for {email}, a reset link has been sent.',
        'delivery': 'demo-mode',
    }


@router.get('/me')
async def me(current=Depends(get_current_user)):
    db = get_db()
    user = await db.users.find_one({'email': current['sub']})
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return {'email': user['email'], 'name': user['name'], 'role': user['role']}
