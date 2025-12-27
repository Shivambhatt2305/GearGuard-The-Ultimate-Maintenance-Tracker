from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.response import success_response, error_response

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/signup")
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Sign up a new user
    Returns: {status, code, message, data: {access_token, token_type, user}}
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            return error_response(
                message="Email already registered",
                code=status.HTTP_400_BAD_REQUEST
            )
        
        # Hash password and create user
        hashed_password = hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create access token
        access_token = create_access_token(data={"sub": str(new_user.id)})
        
        return success_response(
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse.from_orm(new_user).model_dump()
            },
            message="User registered successfully",
            code=status.HTTP_201_CREATED
        )
    except IntegrityError:
        db.rollback()
        return error_response(
            message="Email already exists",
            code=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        db.rollback()
        return error_response(
            message=f"Signup failed: {str(e)}",
            code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login user with email and password
    Returns: {status, code, message, data: {access_token, token_type, user}}
    """
    try:
        # Find user by email
        user = db.query(User).filter(User.email == user_data.email).first()
        
        if not user:
            return error_response(
                message="Invalid email or password",
                code=status.HTTP_401_UNAUTHORIZED
            )
        
        # Verify password
        if not verify_password(user_data.password, user.hashed_password):
            return error_response(
                message="Invalid email or password",
                code=status.HTTP_401_UNAUTHORIZED
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return success_response(
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse.from_orm(user).model_dump()
            },
            message="Login successful",
            code=status.HTTP_200_OK
        )
    except Exception as e:
        return error_response(
            message=f"Login failed: {str(e)}",
            code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get("/me")
def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """
    Get current user info (requires token in Authorization header)
    Returns: {status, code, message, data: {user details}}
    """
    try:
        if not token:
            return error_response(
                message="Not authenticated",
                code=status.HTTP_401_UNAUTHORIZED
            )
        
        from jose import jwt
        from app.core.config import settings
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            
            if not user_id:
                return error_response(
                    message="Invalid token",
                    code=status.HTTP_401_UNAUTHORIZED
                )
        except jwt.ExpiredSignatureError:
            return error_response(
                message="Token has expired",
                code=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.JWTError:
            return error_response(
                message="Invalid token",
                code=status.HTTP_401_UNAUTHORIZED
            )
        
        user = db.query(User).filter(User.id == int(user_id)).first()
        
        if not user:
            return error_response(
                message="User not found",
                code=status.HTTP_404_NOT_FOUND
            )
        
        return success_response(
            data=UserResponse.from_orm(user).model_dump(),
            message="User retrieved successfully",
            code=status.HTTP_200_OK
        )
    except Exception as e:
        return error_response(
            message=f"Failed to get user: {str(e)}",
            code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
