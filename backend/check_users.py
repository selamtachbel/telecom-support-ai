from database import SessionLocal
from models import User

db = SessionLocal()

users = db.query(User).all()

print("Users in database:")
print("-" * 40)

for user in users:
    print(
        f"Username: {user.username}, "
        f"Password: {user.password}, "
        f"Role: {user.role}"
    )

db.close()