from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> OrderRead:
    order = OrderService(db).create_order(payload)
    return OrderRead.model_validate(order)


@router.get("", response_model=list[OrderRead], status_code=status.HTTP_200_OK)
def list_orders(db: Session = Depends(get_db)) -> list[OrderRead]:
    orders = OrderService(db).list_orders()
    return [OrderRead.model_validate(order) for order in orders]


@router.get("/{order_id}", response_model=OrderRead, status_code=status.HTTP_200_OK)
def get_order(order_id: int, db: Session = Depends(get_db)) -> OrderRead:
    order = OrderService(db).get_order(order_id)
    return OrderRead.model_validate(order)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)) -> Response:
    OrderService(db).delete_order(order_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)