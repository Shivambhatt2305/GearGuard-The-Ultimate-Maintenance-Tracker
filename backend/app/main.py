from fastapi import FastAPI
from app.core.database import engine
from app.models.base import Base
from app.models.user import User 

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "API running"}
