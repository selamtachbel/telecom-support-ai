from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

import models
from database import Base, engine, get_db
from models import ChatHistory, KnowledgeBase, User, Ticket


# Create SQLite tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Telecom Support AI API",
    version="1.0.0",
)


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model used when adding or updating knowledge
class KnowledgeRequest(BaseModel):
    question: str = Field(min_length=2, max_length=255)
    answer: str = Field(min_length=2)
    category: str = Field(default="General", min_length=2, max_length=100)


class LoginRequest(BaseModel):
    username: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=4, max_length=255)
class TicketRequest(BaseModel):
    employee: str
    issue: str
    category: str
    priority: str


@app.get("/")
def home():
    return {
        "message": "Welcome to Telecom Support AI API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
@app.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.username == data.username.strip())
        .first()
    )

    if user is None or user.password != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password.",
        )

    return {
        "success": True,
        "username": user.username,
        "role": user.role,
        "message": "Login successful.",
    }

@app.get("/search")
def search(query: str, db: Session = Depends(get_db)):
    cleaned_query = query.lower().strip()

    if not cleaned_query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a question.",
        )

    records = db.query(KnowledgeBase).all()

    best_match = None
    highest_score = 0

    query_words = set(cleaned_query.split())

    for record in records:
        saved_question = record.question.lower()

        score = 0

        if cleaned_query == saved_question:
            score += 100

        if cleaned_query in saved_question:
            score += 50

        saved_words = set(saved_question.split())

        score += len(query_words.intersection(saved_words)) * 10

        if score > highest_score:
            highest_score = score
            best_match = record

    if best_match and highest_score >= 10:

        history = ChatHistory(
            question=query,
            answer=best_match.answer,
        )

        db.add(history)
        db.commit()

        return {
            "question": best_match.question,
            "answer": best_match.answer,
            "category": best_match.category,
            "source": "SQLite database",
            "found": True,
        }

    fallback = (
        "Sorry, I couldn't find an answer. "
        "Please contact Ethio Telecom through hotline 994."
    )

    history = ChatHistory(
        question=query,
        answer=fallback,
    )

    db.add(history)
    db.commit()

    return {
        "question": query,
        "answer": fallback,
        "category": "General",
        "source": "SQLite database",
        "found": False,
    }

# Get all knowledge-base records
@app.get("/knowledge")
def get_all_knowledge(db: Session = Depends(get_db)):
    records = (
        db.query(KnowledgeBase)
        .order_by(KnowledgeBase.id.desc())
        .all()
    )

    return records


# Get one knowledge-base record
@app.get("/knowledge/{item_id}")
def get_knowledge(item_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(KnowledgeBase)
        .filter(KnowledgeBase.id == item_id)
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge item not found.",
        )

    return item


# Add a new knowledge-base record
@app.post("/knowledge", status_code=201)
def add_knowledge(
    data: KnowledgeRequest,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.question.ilike(data.question.strip())
        )
        .first()
    )

    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail="This question already exists.",
        )

    item = KnowledgeBase(
        question=data.question.strip(),
        answer=data.answer.strip(),
        category=data.category.strip(),
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "message": "Knowledge added successfully.",
        "data": item,
    }


# Update an existing knowledge-base record
@app.put("/knowledge/{item_id}")
def update_knowledge(
    item_id: int,
    data: KnowledgeRequest,
    db: Session = Depends(get_db),
):
    item = (
        db.query(KnowledgeBase)
        .filter(KnowledgeBase.id == item_id)
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge item not found.",
        )

    duplicate = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.question.ilike(data.question.strip()),
            KnowledgeBase.id != item_id,
        )
        .first()
    )

    if duplicate is not None:
        raise HTTPException(
            status_code=409,
            detail="Another record already uses this question.",
        )

    item.question = data.question.strip()
    item.answer = data.answer.strip()
    item.category = data.category.strip()

    db.commit()
    db.refresh(item)

    return {
        "message": "Knowledge updated successfully.",
        "data": item,
    }


# Delete a knowledge-base record
@app.delete("/knowledge/{item_id}")
def delete_knowledge(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(KnowledgeBase)
        .filter(KnowledgeBase.id == item_id)
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge item not found.",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Knowledge deleted successfully."
    }


# View saved chat history
@app.get("/chat-history")
def get_chat_history(db: Session = Depends(get_db)):
    history = (
        db.query(ChatHistory)
        .order_by(ChatHistory.id.desc())
        .all()
    )

    return history


# Delete all chat history
@app.delete("/chat-history")
def clear_chat_history(db: Session = Depends(get_db)):
    deleted_count = db.query(ChatHistory).delete()
    db.commit()

    return {
        "message": "Chat history cleared successfully.",
        "deleted_records": deleted_count,
    }


# Dashboard statistics
@app.get("/dashboard/stats")
def dashboard_statistics(db: Session = Depends(get_db)):
    total_knowledge = db.query(KnowledgeBase).count()
    total_searches = db.query(ChatHistory).count()

    categories = (
        db.query(KnowledgeBase.category)
        .distinct()
        .all()
    )

    return {
        "total_knowledge": total_knowledge,
        "total_searches": total_searches,
        "total_categories": len(categories),
    }
@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()
@app.post("/tickets")
def create_ticket(
    ticket: TicketRequest,
    db: Session = Depends(get_db),
):
    new_ticket = Ticket(
    employee=ticket.employee,
    phone=ticket.phone,
    issue=ticket.issue,
    category=ticket.category,
    priority=ticket.priority,
    status="Open",
)

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket