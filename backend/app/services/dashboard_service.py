from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.db.models.customer import Customer
from app.db.models.order import Order
from app.db.models.product import Product
from app.schemas.dashboard import DashboardRead, LowStockProductRead


class DashboardService:
    def __init__(self, db: Session, settings: Settings) -> None:
        self.db = db
        self.settings = settings

    def get_dashboard(self) -> DashboardRead:
        summary_row = self.db.execute(
            select(
                select(func.count(Product.id)).scalar_subquery().label("total_products"),
                select(func.count(Customer.id)).scalar_subquery().label("total_customers"),
                select(func.count(Order.id)).scalar_subquery().label("total_orders"),
            )
        ).one()

        low_stock_products = self.db.execute(
            select(Product)
            .where(Product.quantity_in_stock <= self.settings.low_stock_threshold)
            .order_by(Product.quantity_in_stock.asc(), Product.id.asc())
        ).scalars().all()

        return DashboardRead(
            total_products=summary_row.total_products,
            total_customers=summary_row.total_customers,
            total_orders=summary_row.total_orders,
            low_stock_products=[
                LowStockProductRead.model_validate(product)
                for product in low_stock_products
            ],
        )