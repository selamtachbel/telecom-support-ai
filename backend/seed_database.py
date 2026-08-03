from database import SessionLocal
from models import User

db = SessionLocal()

users = [
    User(
        username="servicedesk",
        password="service123",
        role="Service Desk",
    ),
    User(
        username="engineer",
        password="engineer123",
        role="Network Engineer",
    ),
    User(
        username="admin",
        password="admin123",
        role="Administrator",
    ),
]

for user in users:
    existing = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing is None:
        db.add(user)

db.commit()
db.close()

print("Users added successfully.")