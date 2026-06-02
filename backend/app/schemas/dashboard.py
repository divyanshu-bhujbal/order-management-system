from pydantic import BaseModel, ConfigDict


class LowStockProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    sku: str
    quantity_in_stock: int


class DashboardRead(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: list[LowStockProductRead]