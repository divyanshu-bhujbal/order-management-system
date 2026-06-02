"""add product stock index

Revision ID: 20260602_0002
Revises: 20260602_0001
Create Date: 2026-06-02 00:10:00

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260602_0002"
down_revision: Union[str, None] = "20260602_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_products_quantity_in_stock",
        "products",
        ["quantity_in_stock"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_products_quantity_in_stock", table_name="products")