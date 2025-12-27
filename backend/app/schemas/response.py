from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    """Standard API response format for all endpoints"""
    status: str  # "success" or "error"
    code: int  # HTTP status code
    message: str  # Response message
    data: Optional[T] = None  # Response data (null for errors)
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "code": 200,
                "message": "Operation successful",
                "data": {}
            }
        }


def success_response(data: Any = None, message: str = "Operation successful", code: int = 200) -> dict:
    """Create a success response"""
    return {
        "status": "success",
        "code": code,
        "message": message,
        "data": data
    }


def error_response(message: str = "An error occurred", code: int = 400, data: Any = None) -> dict:
    """Create an error response"""
    return {
        "status": "error",
        "code": code,
        "message": message,
        "data": data
    }
