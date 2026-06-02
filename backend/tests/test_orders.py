from decimal import Decimal

from app.db.models.product import Product


def create_customer(client, email: str = "order.customer@example.com") -> int:
    response = client.post(
        "/api/v1/customers",
        json={
            "full_name": "Order Customer",
            "email": email,
            "phone_number": "+1231231234",
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


def create_product(
    client,
    *,
    name: str,
    sku: str,
    price: str,
    quantity_in_stock: int,
) -> int:
    response = client.post(
        "/api/v1/products",
        json={
            "name": name,
            "sku": sku,
            "price": price,
            "quantity_in_stock": quantity_in_stock,
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


def test_create_order_success_total_and_stock_deduction(client, db_session):
    customer_id = create_customer(client)
    keyboard_id = create_product(
        client,
        name="Keyboard",
        sku="ORD-KB-001",
        price="49.99",
        quantity_in_stock=10,
    )
    mouse_id = create_product(
        client,
        name="Mouse",
        sku="ORD-MS-001",
        price="19.50",
        quantity_in_stock=8,
    )

    response = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer_id,
            "items": [
                {"product_id": keyboard_id, "quantity": 2},
                {"product_id": mouse_id, "quantity": 3},
            ],
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["customer_id"] == customer_id
    assert len(payload["order_items"]) == 2
    assert Decimal(str(payload["total_amount"])) == Decimal("158.48")

    keyboard = db_session.get(Product, keyboard_id)
    mouse = db_session.get(Product, mouse_id)
    assert keyboard.quantity_in_stock == 8
    assert mouse.quantity_in_stock == 5


def test_list_get_delete_order_success(client, db_session):
    customer_id = create_customer(client, email="list.get.delete@example.com")
    product_id = create_product(
        client,
        name="Headset",
        sku="ORD-HS-001",
        price="89.00",
        quantity_in_stock=4,
    )

    created = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer_id,
            "items": [{"product_id": product_id, "quantity": 2}],
        },
    )
    order_id = created.json()["id"]

    list_response = client.get("/api/v1/orders")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    get_response = client.get(f"/api/v1/orders/{order_id}")
    assert get_response.status_code == 200
    assert get_response.json()["id"] == order_id

    delete_response = client.delete(f"/api/v1/orders/{order_id}")
    assert delete_response.status_code == 204

    get_missing_response = client.get(f"/api/v1/orders/{order_id}")
    assert get_missing_response.status_code == 404

    restored_product = db_session.get(Product, product_id)
    assert restored_product.quantity_in_stock == 4


def test_create_order_validation_error(client):
    response = client.post(
        "/api/v1/orders",
        json={
            "customer_id": 0,
            "items": [],
        },
    )

    assert response.status_code == 422
    payload = response.json()
    assert payload["detail"] == "Validation error."


def test_create_order_insufficient_inventory(client, db_session):
    customer_id = create_customer(client, email="inventory@example.com")
    product_id = create_product(
        client,
        name="Laptop Stand",
        sku="ORD-LS-001",
        price="29.99",
        quantity_in_stock=2,
    )

    response = client.post(
        "/api/v1/orders",
        json={
            "customer_id": customer_id,
            "items": [{"product_id": product_id, "quantity": 3}],
        },
    )

    assert response.status_code == 409
    assert response.json() == {"detail": f"Insufficient inventory for product {product_id}."}

    product = db_session.get(Product, product_id)
    assert product.quantity_in_stock == 2

    list_response = client.get("/api/v1/orders")
    assert list_response.status_code == 200
    assert list_response.json() == []