from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.customer import CustomerCreate, CustomerRead
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)) -> CustomerRead:
    customer = CustomerService(db).create_customer(payload)
    return CustomerRead.model_validate(customer)


@router.get("", response_model=list[CustomerRead], status_code=status.HTTP_200_OK)
def list_customers(db: Session = Depends(get_db)) -> list[CustomerRead]:
    customers = CustomerService(db).list_customers()
    return [CustomerRead.model_validate(customer) for customer in customers]


@router.get("/{customer_id}", response_model=CustomerRead, status_code=status.HTTP_200_OK)
def get_customer(customer_id: int, db: Session = Depends(get_db)) -> CustomerRead:
    customer = CustomerService(db).get_customer(customer_id)
    return CustomerRead.model_validate(customer)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)) -> Response:
    CustomerService(db).delete_customer(customer_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)