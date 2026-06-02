from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_app_settings, get_db
from app.core.config import Settings
from app.schemas.dashboard import DashboardRead
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardRead, status_code=status.HTTP_200_OK)
def get_dashboard(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_app_settings),
) -> DashboardRead:
    return DashboardService(db, settings).get_dashboard()