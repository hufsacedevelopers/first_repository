from fastapi import APIRouter

from app.schemas.support import Support
from app.services.data_service import get_supports_data

router = APIRouter(prefix="/supports", tags=["supports"])


@router.get("", response_model=list[Support])
def list_supports() -> list[Support]:
    return [Support(**support) for support in get_supports_data()]
