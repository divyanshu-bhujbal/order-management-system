def test_create_customer_success(client):
    response = client.post(
        "/api/v1/customers",
        json={
            "full_name": "Alice Doe",
            "email": "alice@example.com",
            "phone_number": "+1234567890",
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["id"] > 0
    assert payload["full_name"] == "Alice Doe"
    assert payload["email"] == "alice@example.com"


def test_list_get_delete_customer_success(client):
    created = client.post(
        "/api/v1/customers",
        json={
            "full_name": "Bob Smith",
            "email": "bob@example.com",
            "phone_number": "+1987654321",
        },
    )
    customer_id = created.json()["id"]

    list_response = client.get("/api/v1/customers")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    get_response = client.get(f"/api/v1/customers/{customer_id}")
    assert get_response.status_code == 200
    assert get_response.json()["email"] == "bob@example.com"

    delete_response = client.delete(f"/api/v1/customers/{customer_id}")
    assert delete_response.status_code == 204

    get_missing_response = client.get(f"/api/v1/customers/{customer_id}")
    assert get_missing_response.status_code == 404


def test_create_customer_validation_error(client):
    response = client.post(
        "/api/v1/customers",
        json={
            "full_name": "Invalid User",
            "email": "not-an-email",
            "phone_number": "",
        },
    )

    assert response.status_code == 422
    payload = response.json()
    assert payload["detail"] == "Validation error."


def test_create_customer_duplicate_email(client):
    first_response = client.post(
        "/api/v1/customers",
        json={
            "full_name": "Carol Jones",
            "email": "carol@example.com",
            "phone_number": "+1111111111",
        },
    )
    assert first_response.status_code == 201

    duplicate_response = client.post(
        "/api/v1/customers",
        json={
            "full_name": "Carol Clone",
            "email": "carol@example.com",
            "phone_number": "+2222222222",
        },
    )

    assert duplicate_response.status_code == 409
    assert duplicate_response.json() == {"detail": "Customer email already exists."}