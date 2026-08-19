from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_feedback_stats():
    response = client.get("/feedback/stats")
    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "helpful" in data
    assert "not_helpful" in data
    assert "helpful_percentage" in data
def test_ticket_escalation_and_resolution():
    # 1. Customer creates a ticket
    create_response = client.post(
        "/tickets",
        json={
            "customer_name": "Automated Test Customer",
            "issue": "Internet connection requires site engineer support",
            "category": "Internet",
            "priority": "High",
            "phone": "0911000000",
        },
    )

    assert create_response.status_code in (200, 201)

    created_data = create_response.json()

    # Support either direct ticket response or {"ticket": {...}}
    ticket = created_data.get("ticket", created_data)
    ticket_id = ticket["id"]

    # 2. Service Desk escalates the ticket
    escalate_response = client.patch(
        f"/tickets/{ticket_id}",
        json={
            "status": "Escalated",
            "assigned_to": "Site Engineer",
            "escalation_reason": "Issue could not be resolved remotely",
            "category": "Internet",
            "priority": "High",
        },
    )

    assert escalate_response.status_code == 200

    # 3. Site Engineer resolves the ticket
    resolve_response = client.patch(
        f"/tickets/{ticket_id}",
        json={
            "status": "Resolved",
            "assigned_to": "Site Engineer",
            "escalation_reason": "Issue resolved after site investigation",
            "category": "Internet",
            "priority": "High",
        },
    )

    assert resolve_response.status_code == 200

    resolved_data = resolve_response.json()
    resolved_ticket = resolved_data.get("ticket", resolved_data)

    assert resolved_ticket["status"].lower() == "resolved"