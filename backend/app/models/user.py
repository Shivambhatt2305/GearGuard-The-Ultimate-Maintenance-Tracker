from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.models.base import Base

class Credential(Base):
    __tablename__ = "credentials"

    email = Column(String(100), unique=True, primary_key=True, index=True)
    hash_pass = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    user_role = Column(String(50), nullable=False, default="Employee")
    department = Column(String(100))
    avatar_url = Column(String(255))
    email = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
