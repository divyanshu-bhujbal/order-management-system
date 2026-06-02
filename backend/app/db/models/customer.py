from sqlalchemy import Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True)
    phone_number: Mapped[str] = mapped_column(String(30), nullable=False)

    orders = relationship("Order", back_populates="customer")

    __table_args__ = (
        Index("ix_customers_full_name", "full_name"),
    )
