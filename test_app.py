import httpx
import asyncio
from fastapi.testclient import TestClient
from main import app
from config import settings

# Since we don't have MongoDB definitely running on the system, 
# for testing purposes we mock the MongoDB connection so tests pass 
# without needing an actual DB.
from utils import db
import pytest

@pytest.fixture(autouse=True)
def mock_db(monkeypatch):
    class MockCollection:
        async def insert_one(self, data):
            class MockResult:
                inserted_id = "test_id_123"
            return MockResult()
            
    class MockDb:
        def __getitem__(self, val):
            return MockCollection()
            
    monkeypatch.setattr(db, "get_db", lambda: MockDb())

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_analyze_loan():
    payload = {
        "user_id": "test_user_001",
        "income": 120000.0,
        "credit_score": 750,
        "dti": 0.15,
        "employment_length": 5
    }
    
    response = client.post("/analyze-loan", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "risk_score" in data
    assert "decision" in data
    assert "explanation" in data
    assert "important_features" in data
    
    print("Test passed! Agent response:")
    print(data)

if __name__ == "__main__":
    test_health()
    # Need to patch DB connection logic directly if we run it without pytest mocking
    class MockCollection:
        async def insert_one(self, data):
            class MockResult:
                inserted_id = "test_id_123"
            return MockResult()
    class MockDb:
        def __getitem__(self, val):
            return MockCollection()
    
    db.get_db = lambda: MockDb()
    test_analyze_loan()
