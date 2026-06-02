from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.db.models.customer import Customer
from app.schemas.customer import CustomerCreate


class CustomerService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_customer(self, payload: CustomerCreate) -> Customer:
        customer = Customer(**payload.model_dump())
        self.db.add(customer)
        return self._commit_with_duplicate_handling(
            customer,
            duplicate_message="Customer email already exists.",
        )

    def list_customers(self) -> list[Customer]:
        return self.db.query(Customer).order_by(Customer.id.asc()).all()

    def get_customer(self, customer_id: int) -> Customer:
        customer = self.db.get(Customer, customer_id)
        if customer is None:
            raise NotFoundError("Customer not found.")
        return customer

    def delete_customer(self, customer_id: int) -> None:
        customer = self.get_customer(customer_id)
        self.db.delete(customer)
        self.db.commit()

    def _commit_with_duplicate_handling(
        self,
        customer: Customer,
        duplicate_message: str,
    ) -> Customer:
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError(duplicate_message) from exc
        self.db.refresh(customer)
        return customer