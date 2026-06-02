from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import ConflictError, InsufficientInventoryError, NotFoundError
from app.db.models.customer import Customer
from app.db.models.order import Order
from app.db.models.order_item import OrderItem
from app.db.models.product import Product
from app.schemas.order import OrderCreate


class OrderService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_order(self, payload: OrderCreate) -> Order:
        order = Order(customer_id=payload.customer_id, total_amount=Decimal("0.00"))

        with self.db.begin():
            customer = self.db.get(Customer, payload.customer_id)
            if customer is None:
                raise NotFoundError("Customer not found.")

            product_ids = [item.product_id for item in payload.items]
            products = self.db.execute(
                select(Product)
                .where(Product.id.in_(product_ids))
                .order_by(Product.id.asc())
                .with_for_update()
            ).scalars().all()

            products_by_id = {product.id: product for product in products}
            missing_product_ids = sorted(set(product_ids) - set(products_by_id))
            if missing_product_ids:
                missing_ids = ", ".join(str(product_id) for product_id in missing_product_ids)
                raise NotFoundError(f"Product not found for id(s): {missing_ids}.")

            total_amount = Decimal("0.00")
            self.db.add(order)
            self.db.flush()

            for item in payload.items:
                product = products_by_id[item.product_id]
                if product.quantity_in_stock < item.quantity:
                    raise InsufficientInventoryError(
                        f"Insufficient inventory for product {product.id}."
                    )

                product.quantity_in_stock -= item.quantity
                price_at_purchase = product.price
                total_amount += price_at_purchase * item.quantity

                self.db.add(
                    OrderItem(
                        order_id=order.id,
                        product_id=product.id,
                        quantity=item.quantity,
                        price_at_purchase=price_at_purchase,
                    )
                )

            order.total_amount = total_amount

        return self.get_order(order.id)

    def list_orders(self) -> list[Order]:
        return list(
            self.db.execute(
                select(Order)
                .options(selectinload(Order.order_items))
                .order_by(Order.id.asc())
            ).scalars().all()
        )

    def get_order(self, order_id: int) -> Order:
        order = self.db.execute(
            select(Order)
            .options(selectinload(Order.order_items))
            .where(Order.id == order_id)
        ).scalar_one_or_none()
        if order is None:
            raise NotFoundError("Order not found.")
        return order

    def delete_order(self, order_id: int) -> None:
        with self.db.begin():
            order = self.db.execute(
                select(Order)
                .options(selectinload(Order.order_items))
                .where(Order.id == order_id)
            ).scalar_one_or_none()
            if order is None:
                raise NotFoundError("Order not found.")

            product_ids = [item.product_id for item in order.order_items]
            if product_ids:
                products = self.db.execute(
                    select(Product)
                    .where(Product.id.in_(product_ids))
                    .order_by(Product.id.asc())
                    .with_for_update()
                ).scalars().all()
                products_by_id = {product.id: product for product in products}

                for item in order.order_items:
                    product = products_by_id.get(item.product_id)
                    if product is None:
                        raise ConflictError(
                            f"Cannot restore inventory for missing product {item.product_id}."
                        )
                    product.quantity_in_stock += item.quantity

            self.db.delete(order)