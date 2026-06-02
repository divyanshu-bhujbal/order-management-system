from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config

from app.core.config import get_settings

BASE_DIR = Path(__file__).resolve().parents[2]


def run_database_migrations() -> None:
    settings = get_settings()

    if not settings.run_migrations_on_startup:
        return

    alembic_config = Config(str(BASE_DIR / "alembic.ini"))
    alembic_config.set_main_option("sqlalchemy.url", settings.database_url)
    command.upgrade(alembic_config, "head")