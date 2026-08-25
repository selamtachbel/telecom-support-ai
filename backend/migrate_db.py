from sqlalchemy import inspect, text
from database import Base, engine
import models


# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

with engine.begin() as connection:
    inspector = inspect(connection)

    columns = {
        column["name"]
        for column in inspector.get_columns("knowledge_base")
    }

    if "created_at" not in columns:
        connection.execute(
            text(
                "ALTER TABLE knowledge_base "
                "ADD COLUMN created_at DATETIME"
            )
        )
        print("Added created_at column.")

    if "updated_at" not in columns:
        connection.execute(
            text(
                "ALTER TABLE knowledge_base "
                "ADD COLUMN updated_at DATETIME"
            )
        )
        print("Added updated_at column.")

    # Give any existing records timestamps
    connection.execute(
        text(
            "UPDATE knowledge_base "
            "SET created_at = CURRENT_TIMESTAMP "
            "WHERE created_at IS NULL"
        )
    )

    connection.execute(
        text(
            "UPDATE knowledge_base "
            "SET updated_at = CURRENT_TIMESTAMP "
            "WHERE updated_at IS NULL"
        )
    )

print("Database migration completed successfully.")