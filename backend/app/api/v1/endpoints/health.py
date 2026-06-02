from fastapi import APIRouter, Depends

from app.core.config import Settings
from app.api.dependencies import get_app_settings

router = APIRouter(tags=["health"])


@router.get("/health", summary="Health check")
def health_check(settings: Settings = Depends(get_app_settings)) -> dict[str, str]:
    return {
        "status": "ok",
        "environment": settings.app_env,
    }
