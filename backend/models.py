from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text, Float
from database import Base

class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(255), unique=True, nullable=False, index=True)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, default="General")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )
    username = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )
    password = Column(
        String(255),
        nullable=False,
    )
    role = Column(
        String(50),
        nullable=False,
        default="Customer",
    )

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    issue = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    priority = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Open")
    assigned_engineer = Column(String(100), default="")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    action = Column(String(100), nullable=False)
    user = Column(String(100), default="System")
    details = Column(Text, nullable=True)

class AISetting(Base):
    __tablename__ = "ai_settings"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), default="llama3")
    temperature = Column(Float, default=0.7)
    top_p = Column(Float, default=0.9)
    chunk_size = Column(Integer, default=500)
    chunk_overlap = Column(Integer, default=50)
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    helpful = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)