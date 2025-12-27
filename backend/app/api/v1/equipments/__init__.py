from fastapi import APIRouter

router = APIRouter(prefix="/equipments", tags=["equipments"])

# Equipment routes will go here
# Example:
# @router.get("/")
# def list_equipments(db: Session = Depends(get_db)):
#     pass

__all__ = ["router"]
