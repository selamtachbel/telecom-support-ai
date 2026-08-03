import os
from typing import Optional, List
from fastapi import Depends, FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import models
from database import Base, engine, get_db
from models import ChatHistory, KnowledgeBase, User, Ticket

# Import RAG integration functions
from rag_engine import ingest_document_text, query_rag

# Initialize SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Telecom Support AI API",
    version="1.0.0",
)

# CORS configuration for Frontend portals
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Pydantic Schemas
# ------------------------------------------------------------------
class KnowledgeRequest(BaseModel):
    question: str = Field(min_length=2, max_length=255)
    answer: str = Field(min_length=2)
    category: str = Field(default="General", min_length=2, max_length=100)

class LoginRequest(BaseModel):
    username: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=4, max_length=255)

class TicketRequest(BaseModel):
    customer_name: str
    issue: str
    category: str = "General"
    priority: str = "Medium"
    phone: Optional[str] = ""

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    assignedTo: Optional[str] = None
    escalationReason: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None

# ------------------------------------------------------------------
# Health & Auth Endpoints
# ------------------------------------------------------------------
@app.get("/")
def home():
    return {
        "message": "Welcome to Telecom Support AI API",
        "status": "running",
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username.strip()).first()
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

# ------------------------------------------------------------------
# RAG Search & Document Upload Endpoints
# ------------------------------------------------------------------
@app.get("/search")
def search(query: str, db: Session = Depends(get_db)):
    """
    RAG-powered search endpoint with fallback to SQLite KnowledgeBase.
    """
    cleaned_query = query.strip()
    if not cleaned_query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a question.",
        )
    
    # 1. Try RAG Engine (ChromaDB + Ollama)
    try:
        rag_res = query_rag(cleaned_query)
        
        history = ChatHistory(
            question=cleaned_query,
            answer=rag_res.get("answer", "")
        )
        db.add(history)
        db.commit()
        
        return {
            "question": cleaned_query,
            "answer": rag_res.get("answer", "No answer found."),
            "confidence": rag_res.get("confidence", 85),
            "source": rag_res.get("source", "RAG Vector Store"),
            "found": rag_res.get("found", True),
            "category": rag_res.get("category", "General"),
            "suggestion": "If this does not solve your issue, create a support ticket."
        }
    except Exception as rag_error:
        print(f"RAG engine failed: {rag_error}. Falling back to SQLite database...")

    # 2. Fallback to direct SQLite search if RAG fails
    try:
        kb_item = db.query(KnowledgeBase).filter(
            KnowledgeBase.question.ilike(f"%{cleaned_query}%") | 
            KnowledgeBase.answer.ilike(f"%{cleaned_query}%")
        ).first()

        if kb_item:
            answer_text = kb_item.answer
            category_text = kb_item.category
            found_status = True
            confidence = 90
        else:
            answer_text = "Sorry, I couldn't find an answer in our database."
            category_text = "General"
            found_status = False
            confidence = 0

        # Log history
        history = ChatHistory(question=cleaned_query, answer=answer_text)
        db.add(history)
        db.commit()

        return {
            "question": cleaned_query,
            "answer": answer_text,
            "confidence": confidence,
            "source": "Telecom Database",
            "found": found_status,
            "category": category_text,
            "suggestion": "Verify that your backend RAG and Ollama services are active."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
@app.post("/documents/upload")
async def upload_document(title: str = Form(...),
    category: str = Form("General"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload telecom documents (txt/pdf text) to chunk and store as vector embeddings in ChromaDB.
    """
    try:
        content = await file.read()
        text_content = content.decode("utf-8", errors="ignore")
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        # Ingest into vector store
        num_chunks = ingest_document_text(text_content, file.filename, category)
        
        # Store reference in SQLite
        new_doc = KnowledgeBase(
            question=title.strip(),
            answer=text_content.strip()[:500],  # store text preview
            category=category.strip()
        )
        db.add(new_doc)
        db.commit()
        
        return {
            "status": "success",
            "message": f"Successfully ingested '{file.filename}' into ChromaDB across {num_chunks} vector chunks.",
            "filename": file.filename
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ------------------------------------------------------------------
# Knowledge Base CRUD Endpoints (Admin & Service Desk)
# ------------------------------------------------------------------
@app.get("/knowledge")
def get_all_knowledge(db: Session = Depends(get_db)):
    return db.query(KnowledgeBase).order_by(KnowledgeBase.id.desc()).all()

@app.get("/knowledge/{item_id}")
def get_knowledge(item_id: int, db: Session = Depends(get_db)):
    item = db.query(KnowledgeBase).filter(KnowledgeBase.id == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge item not found.",
        )
    return item

@app.post("/knowledge", status_code=201)
def add_knowledge(data: KnowledgeRequest, db: Session = Depends(get_db)):
    existing = db.query(KnowledgeBase).filter(
        KnowledgeBase.question.ilike(data.question.strip())
    ).first()
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

@app.put("/knowledge/{item_id}")
def update_knowledge(
    item_id: int,
    data: KnowledgeRequest,
    db: Session = Depends(get_db),
):
    item = db.query(KnowledgeBase).filter(KnowledgeBase.id == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge item not found.",
        )
    
    duplicate = db.query(KnowledgeBase).filter(
        KnowledgeBase.question.ilike(data.question.strip()),
        KnowledgeBase.id != item_id,
    ).first()
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

@app.delete("/knowledge/{item_id}")
def delete_knowledge(item_id: int, db: Session = Depends(get_db)):
    item = db.query(KnowledgeBase).filter(KnowledgeBase.id == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge item not found.",
        )
    db.delete(item)
    db.commit()
    return {"message": "Knowledge deleted successfully."}

# ------------------------------------------------------------------
# Chat History & Dashboard Statistics
# ------------------------------------------------------------------
@app.get("/chat-history")
def get_chat_history(db: Session = Depends(get_db)):
    return db.query(ChatHistory).order_by(ChatHistory.id.desc()).all()

@app.delete("/chat-history")
def clear_chat_history(db: Session = Depends(get_db)):
    deleted_count = db.query(ChatHistory).delete()
    db.commit()
    return {
        "message": "Chat history cleared successfully.",
        "deleted_records": deleted_count,
    }

@app.get("/dashboard/stats")
def dashboard_statistics(db: Session = Depends(get_db)):
    total_knowledge = db.query(KnowledgeBase).count()
    total_searches = db.query(ChatHistory).count()
    total_tickets = db.query(Ticket).count()
    categories = db.query(KnowledgeBase.category).distinct().all()
    return {
        "total_knowledge": total_knowledge,
        "total_searches": total_searches,
        "total_tickets": total_tickets,
        "total_categories": len(categories),
    }

# ------------------------------------------------------------------
# Ticketing System Endpoints (Service Desk & Engineer)
# ------------------------------------------------------------------
@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.id.desc()).all()

@app.post("/tickets")
def create_ticket(ticket: TicketRequest, db: Session = Depends(get_db)):
    new_ticket = Ticket(
        customer_name=ticket.customer_name,
        issue=ticket.issue,
        category=ticket.category,
        priority=ticket.priority,
        status="Open",
    )
    # Check if phone exists on Ticket model
    if hasattr(new_ticket, 'phone') and ticket.phone:
        setattr(new_ticket, 'phone', ticket.phone)

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

@app.patch("/tickets/{ticket_id}")
def update_ticket(
    ticket_id: int, 
    data: TicketUpdate, 
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    
    # Update fields dynamically
    if data.status and hasattr(ticket, 'status'):
        ticket.status = data.status
    if data.assignedTo and hasattr(ticket, 'assignedTo'):
        ticket.assignedTo = data.assignedTo
    if data.escalationReason and hasattr(ticket, 'escalationReason'):
        ticket.escalationReason = data.escalationReason
    if data.category and hasattr(ticket, 'category'):
        ticket.category = data.category
    if data.priority and hasattr(ticket, 'priority'):
        ticket.priority = data.priority
        
    db.commit()
    db.refresh(ticket)
    return ticket