from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.db.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_product(self, payload: ProductCreate) -> Product:
        product = Product(**payload.model_dump())
        self.db.add(product)
        return self._commit_with_duplicate_handling(product, duplicate_message="Product SKU already exists.")

    def list_products(self) -> list[Product]:
        return self.db.query(Product).order_by(Product.id.asc()).all()

    def get_product(self, product_id: int) -> Product:
        product = self.db.get(Product, product_id)
        if product is None:
            raise NotFoundError("Product not found.")
        return product

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(product, field, value)
        return self._commit_with_duplicate_handling(product, duplicate_message="Product SKU already exists.")

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        self.db.delete(product)
        self.db.commit()

    def _commit_with_duplicate_handling(self, product: Product, duplicate_message: str) -> Product:
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError(duplicate_message) from exc
        self.db.refresh(product)
        return product
