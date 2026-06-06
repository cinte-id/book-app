import pytest
import json
from app import app, books

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Test basic book collection fetch
def test_get_books(client):
    response = client.get('/api/books')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list) or isinstance(data, dict)

# Test unauthorized gating error (HTTP 401)
def test_unauthorized_mutation_gate(client):
    response = client.post('/api/books', json={
        "title": "Unauthorized Book",
        "author": "Secret Writer",
        "pages": 120,
        "genre": "Fiction"
    })
    assert response.status_code == 401

# Test successful login session and dummy token generation
def test_auth_login(client):
    response = client.post('/api/auth/login', json={
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "token" in data
    assert data["username"] == "testuser"