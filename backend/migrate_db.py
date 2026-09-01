from sqlalchemy import inspect, text
from database import Base, engine
import models


# Create tables if they do not already exist
Base.metadata.create_all(bind=engine)


with engine.begin() as connection:
    inspector = inspect(connection)

    # -------------------------
    # Knowledge Base migration
    # -------------------------
    knowledge_columns = {
        column["name"]
        for column in inspector.get_columns("knowledge_base")
    }

    if "created_at" not in knowledge_columns:
        connection.execute(
            text(
                "ALTER TABLE knowledge_base "
                "ADD COLUMN created_at DATETIME"
            )
        )
        print("Added created_at column.")

    if "updated_at" not in knowledge_columns:
        connection.execute(
            text(
                "ALTER TABLE knowledge_base "
                "ADD COLUMN updated_at DATETIME"
            )
        )
        print("Added updated_at column.")

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

    # -------------------------
    # Ticket migration
    # -------------------------
    ticket_columns = {
        column["name"]
        for column in inspector.get_columns("tickets")
    }

    if "assigned_engineer" not in ticket_columns:
        connection.execute(
            text(
                "ALTER TABLE tickets "
                "ADD COLUMN assigned_engineer VARCHAR(100) DEFAULT ''"
            )
        )
        print("Added assigned_engineer column.")

    if "escalation_reason" not in ticket_columns:
        connection.execute(
            text(
                "ALTER TABLE tickets "
                "ADD COLUMN escalation_reason TEXT DEFAULT ''"
            )
        )
        print("Added escalation_reason column.")


print("Database migration completed successfully.")