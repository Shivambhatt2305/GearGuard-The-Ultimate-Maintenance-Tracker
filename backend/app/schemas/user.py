from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CredentialBase(BaseModel):
    email: EmailStr

class CredentialCreate(CredentialBase):
    hash_pass: str

class CredentialResponse(CredentialBase):
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    user_role: Optional[str] = "Employee"
    department: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

