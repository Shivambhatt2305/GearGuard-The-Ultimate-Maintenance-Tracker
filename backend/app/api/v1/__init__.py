from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["v1"])

# Import and include equipment routes when ready
# from app.api.v1.equipments import router as equipment_router
# router.include_router(equipment_router)

__all__ = ["router"]
