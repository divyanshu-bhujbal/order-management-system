from decimal import Decimal


def test_create_product_success(client):
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Keyboard",
            "sku": "KB-001",
            "price": "49.99",
            "quantity_in_stock": 10,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["id"] > 0
    assert payload["name"] == "Keyboard"
    assert payload["sku"] == "KB-001"
    assert Decimal(str(payload["price"])) == Decimal("49.99")
    assert payload["quantity_in_stock"] == 10


def test_list_get_update_delete_product_success(client):
    created = client.post(
        "/api/v1/products",
        json={
            "name": "Mouse",
            "sku": "MO-001",
            "price": "19.50",
            "quantity_in_stock": 7,
        },
    )
    product_id = created.json()["id"]

    list_response = client.get("/api/v1/products")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    get_response = client.get(f"/api/v1/products/{product_id}")
    assert get_response.status_code == 200
    assert get_response.json()["sku"] == "MO-001"

    update_response = client.put(
        f"/api/v1/products/{product_id}",
        json={
            "name": "Wireless Mouse",
            "quantity_in_stock": 9,
        },
    )
    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Wireless Mouse"
    assert update_response.json()["quantity_in_stock"] == 9

    delete_response = client.delete(f"/api/v1/products/{product_id}")
    assert delete_response.status_code == 204

    get_missing_response = client.get(f"/api/v1/products/{product_id}")
    assert get_missing_response.status_code == 404


def test_create_product_validation_error(client):
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Invalid Product",
            "sku": "INV-001",
            "price": "9.99",
            "quantity_in_stock": -1,
        },
    )

    assert response.status_code == 422
    payload = response.json()
    assert payload["detail"] == "Validation error."


def test_create_product_duplicate_sku(client):
    first_response = client.post(
        "/api/v1/products",
        json={
            "name": "Monitor",
            "sku": "MON-001",
            "price": "199.99",
            "quantity_in_stock": 5,
        },
    )
    assert first_response.status_code == 201

    duplicate_response = client.post(
        "/api/v1/products",
        json={
            "name": "Second Monitor",
            "sku": "MON-001",
            "price": "209.99",
            "quantity_in_stock": 3,
        },
    )

    assert duplicate_response.status_code == 409
    assert duplicate_response.json() == {"detail": "Product SKU already exists."}