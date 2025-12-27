# PostgreSQL Setup Guide for GearGuard Backend

## Prerequisites

- PostgreSQL 12+ installed and running
- Python 3.8+ installed
- Virtual environment activated

## Installation Steps

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. PostgreSQL Configuration

#### On Windows:
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, remember the password for the `postgres` user
3. Ensure PostgreSQL service is running (check in Services app)

#### Create Database:
```bash
# Connect to PostgreSQL using psql
psql -U postgres

# Then run these SQL commands:
CREATE DATABASE gearguard_db;
CREATE USER gearguard_user WITH PASSWORD 'secure_password';
ALTER ROLE gearguard_user SET client_encoding TO 'utf8';
ALTER ROLE gearguard_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE gearguard_user SET default_transaction_deferrable TO on;
ALTER ROLE gearguard_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE gearguard_db TO gearguard_user;
\q
```

### 3. Environment Configuration

Update `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://gearguard_user:secure_password@localhost:5432/gearguard_db
APP_NAME=GearGuard
APP_VERSION=1.0.0
DEBUG=True
SECRET_KEY=your-super-secret-key-change-this-in-production
API_V1_STR=/api/v1
DB_ECHO=False  # Set to True to log SQL queries
```

### 4. Run the Application

```bash
# From the backend directory
uvicorn app.main:app --reload
```

The API will be available at: http://localhost:8000

### 5. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Database Management

### Create Tables
Tables are automatically created on application startup via `init_db()` function.

### Using Alembic for Migrations (Optional)

Initialize Alembic:
```bash
alembic init alembic
```

Create a migration:
```bash
alembic revision --autogenerate -m "Initial migration"
```

Apply migrations:
```bash
alembic upgrade head
```

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py      # Settings and environment variables
│   │   ├── database.py    # SQLAlchemy setup and session management
│   │   └── security.py    # Password hashing and JWT tokens
│   ├── models/            # SQLAlchemy ORM models
│   ├── schemas/           # Pydantic schemas for validation
│   ├── services/          # Business logic
│   ├── api/
│   │   └── v1/            # API routes
│   └── main.py            # FastAPI app initialization
├── .env                   # Environment variables
└── requirements.txt       # Python dependencies
```

## Common Issues & Solutions

### "psycopg2 import error"
```bash
pip install psycopg2-binary
```

### "Connection refused"
- Verify PostgreSQL is running: `pg_isready -h localhost`
- Check DATABASE_URL in .env is correct

### "authentication failed for user"
- Verify username and password in DATABASE_URL
- Ensure user has proper privileges

## Next Steps

1. Create SQLAlchemy models in `app/models/`
2. Create Pydantic schemas in `app/schemas/`
3. Create API endpoints in `app/api/v1/`
4. Create business logic in `app/services/`

## Example: Creating a Simple Equipment Model

Create `app/models/equipment.py`:
```python
from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base

class Equipment(Base):
    __tablename__ = "equipments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
```
