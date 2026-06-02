import os
import sys
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("APP_NAME", "Order Management System API")
os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault("APP_DEBUG", "false")
os.environ.setdefault("API_V1_PREFIX", "/api/v1")
os.environ.setdefault("HOST", "0.0.0.0")
os.environ.setdefault("PORT", "8000")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///./test_app_import.db")
os.environ.setdefault("DB_ECHO", "false")
os.environ.setdefault("DB_POOL_SIZE", "10")
os.environ.setdefault("DB_MAX_OVERFLOW", "20")
os.environ.setdefault("DB_POOL_TIMEOUT", "30")
os.environ.setdefault("DB_POOL_RECYCLE", "1800")
os.environ.setdefault("LOW_STOCK_THRESHOLD", "10")

from app.api.dependencies import get_app_settings, get_db  # noqa: E402
from app.core.config import Settings  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.models import Customer, Order, OrderItem, Product  # noqa: F401, E402
from app.main import create_app  # noqa: E402

engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    class_=Session,
    expire_on_commit=False,
)


@pytest.fixture(autouse=True)
def reset_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def settings() -> Settings:
    return Settings()


@pytest.fixture
def client(db_session: Session, settings: Settings) -> Generator[TestClient, None, None]:
    app = create_app()

    def override_get_db() -> Generator[Session, None, None]:
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    def override_get_app_settings() -> Settings:
        return settings

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_app_settings] = override_get_app_settings

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def product_payload() -> dict[str, object]:
    return {
        "name": "Wireless Mouse",
        "sku": "WM-100",
        "price": "25.50",
        "quantity_in_stock": 10,
    }


@pytest.fixture
def customer_payload() -> dict[str, str]:
    return {
        "full_name": "Ada Lovelace",
        "email": "ada@example.com",
        "phone_number": "+1234567890",
    }


@pytest.fixture
def created_product(client: TestClient, product_payload: dict[str, object]) -> dict[str, object]:
    response = client.post("/api/v1/products", json=product_payload)
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def created_customer(client: TestClient, customer_payload: dict[str, str]) -> dict[str, object]:
    response = client.post("/api/v1/customers", json=customer_payload)
    assert response.status_code == 201
    return response.json()