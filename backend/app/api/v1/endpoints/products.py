from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> ProductRead:
    product = ProductService(db).create_product(payload)
    return ProductRead.model_validate(product)


@router.get("", response_model=list[ProductRead], status_code=status.HTTP_200_OK)
def list_products(db: Session = Depends(get_db)) -> list[ProductRead]:
    products = ProductService(db).list_products()
    return [ProductRead.model_validate(product) for product in products]


@router.get("/{product_id}", response_model=ProductRead, status_code=status.HTTP_200_OK)
def get_product(product_id: int, db: Session = Depends(get_db)) -> ProductRead:
    product = ProductService(db).get_product(product_id)
    return ProductRead.model_validate(product)


@router.put("/{product_id}", response_model=ProductRead, status_code=status.HTTP_200_OK)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
) -> ProductRead:
    product = ProductService(db).update_product(product_id, payload)
    return ProductRead.model_validate(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)) -> Response:
    ProductService(db).delete_product(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
