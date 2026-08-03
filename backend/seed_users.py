from database import SessionLocal
from models import User

db = SessionLocal()

users = [
    {
        "username": "servicedesk",
        "password": "service123",
        "role": "service_desk",
    },
    {
        "username": "engineer",
        "password": "engineer123",
        "role": "engineer",
    },
    {
        "username": "admin",
        "password": "admin123",
        "role": "admin",
    },
]

added = 0

for user in users:

    exists = (
        db.query(User)
        .filter(User.username == user["username"])
        .first()
    )

    if not exists:
        db.add(User(**user))
        added += 1

db.commit()

print(f"Inserted {added} users.")

db.close()