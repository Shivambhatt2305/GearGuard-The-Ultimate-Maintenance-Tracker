from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models.base import Base
from app.models.user import User
from app.api.v1.users import router as users_router

app = FastAPI(title="GearGuard API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"status": "API running", "version": "1.0.0"}
