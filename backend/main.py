import os
import logging
import io
from pypdf import PdfReader
from typing import Optional, List
from fastapi import Depends, FastAPI, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import models
from database import Base, engine, get_db
from models import ChatHistory, KnowledgeBase, User, Ticket, SystemLog, AISetting, Feedback
from rag_engine import ingest_document_text, query_rag

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("telecom_api")

# Initialize database models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Telecom Support AI API",
    version="1.0.0",
)

# CORS setup for dev environment and custom environment variables
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if os.getenv("ALLOWED_ORIGINS"):
    origins = os.getenv("ALLOWED_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed staff users from environment variables on launch
@app.on_event("startup")
def startup_db_seed():
    db = next(get_db())

    try:
        users_to_seed = [
            {
                "username": os.getenv("ADMIN_USERNAME"),
                "password": os.getenv("ADMIN_PASSWORD"),
                "role": "Admin",
            },
            {
                "username": os.getenv("SERVICEDESK_USERNAME", "servicedesk"),
                "password": os.getenv("SERVICEDESK_PASSWORD"),
                "role": "Service Desk",
            },
            {
                "username": os.getenv("ENGINEER_USERNAME", "engineer"),
                "password": os.getenv("ENGINEER_PASSWORD"),
                "role": "Network Engineer",
            },
        ]

        for user_data in users_to_seed:
            username = user_data["username"]
            password = user_data["password"]

            if not username or not password:
                logger.warning(
                    f"Skipping {user_data['role']} user creation because credentials are not configured."
                )
                continue

            existing_user = (
                db.query(User)
                .filter(User.username == username)
                .first()
            )

            if not existing_user:
                new_user = User(
                    username=username,
                    password=password,
                    role=user_data["role"],
                )

                db.add(new_user)

                logger.info(
                    f"Created initial {user_data['role']} user."
                )

        db.commit()

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding initial database users: {e}")

    finally:
        db.close()


      

# ------------------------------------------------------------------
# Pydantic Schemas
# ------------------------------------------------------------------
class KnowledgeRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=255)
    answer: str = Field(..., min_length=2)
    category: str = Field(default="General", min_length=2, max_length=100)

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=4, max_length=255)

class UserCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=4, max_length=255)
    role: str = Field(default="Customer")

class TicketRequest(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100)
    issue: str = Field(..., min_length=5)
    category: str = Field(default="General")
    priority: str = Field(default="Medium")
    phone: Optional[str] = Field(default="")

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    assignedTo: Optional[str] = None
    escalationReason: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None

class AISettingsUpdate(BaseModel):
    model_name: str = "llama3"
    temperature: float = 0.7
    top_p: float = 0.9
    chunk_size: int = 500
    chunk_overlap: int = 50

class FeedbackRequest(BaseModel):
    question: str
    answer: Optional[str] = None
    category: Optional[str] = None
    helpful: str

@app.post("/feedback")
def create_feedback(
    feedback: FeedbackRequest,
    db: Session = Depends(get_db)
):
    new_feedback = Feedback(
        question=feedback.question,
        answer=feedback.answer,
        category=feedback.category,
        helpful=feedback.helpful,
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return {
        "message": "Feedback saved successfully",
        "feedback": {
            "id": new_feedback.id,
            "question": new_feedback.question,
            "answer": new_feedback.answer,
            "category": new_feedback.category,
            "helpful": new_feedback.helpful,
        },
    }

@app.get("/feedback/stats")
def get_feedback_stats(db: Session = Depends(get_db)):
    total = db.query(Feedback).count()
    helpful = (
        db.query(Feedback)
        .filter(Feedback.helpful == "Helpful")
        .count()
    )
    not_helpful = (
        db.query(Feedback)
        .filter(Feedback.helpful == "Not Helpful")
        .count()
    )
    helpful_percentage = (
        round((helpful / total) * 100, 1)
        if total > 0
        else 0
    )
    return {
        "total": total,
        "helpful": helpful,
        "not_helpful": not_helpful,
        "helpful_percentage": helpful_percentage,
    }

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
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )
    
    log = SystemLog(action="USER_LOGIN", user=user.username, details=f"Role: {getattr(user, 'role', 'User')}")
    db.add(log)
    db.commit()
    return {
        "success": True,
        "username": user.username,
        "role": getattr(user, "role", "User"),
        "message": "Login successful.",
    }

# ------------------------------------------------------------------
# User Management Endpoints
# ------------------------------------------------------------------
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "username": u.username, "role": getattr(u, 'role', 'Customer')} for u in users]

@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == data.username.strip()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists.")
    user = User(username=data.username.strip(), password=data.password, role=data.role)
    db.add(user)
    
    log = SystemLog(action="USER_CREATED", user="Admin", details=f"Created user {user.username} with role {user.role}")
    db.add(log)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully", "user": {"id": user.id, "username": user.username, "role": user.role}}

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    db.delete(user)
    
    log = SystemLog(action="USER_DELETED", user="Admin", details=f"Deleted user ID {user_id}")
    db.add(log)
    db.commit()
    return {"message": "User deleted successfully."}

# ------------------------------------------------------------------
# RAG Search & Document Upload Endpoints
# ------------------------------------------------------------------
@app.get("/search")
def search(query: str, db: Session = Depends(get_db)):
    cleaned_query = query.strip()
    if not cleaned_query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a question.",
        )
    try:
        rag_res = query_rag(cleaned_query)
        answer_text = rag_res.get("answer", "")
        if answer_text:
            history = ChatHistory(question=cleaned_query, answer=answer_text)
            db.add(history)
            db.commit()
            return {
                "question": cleaned_query,
                "answer": answer_text,
                "confidence": rag_res.get("confidence", 85),
                "source": rag_res.get("source", "RAG Vector Store"),
                "found": rag_res.get("found", True),
                "category": rag_res.get("category", "General"),
                "suggestion": "If this does not solve your issue, create a support ticket.",
            }
    except Exception as rag_error:
        logger.error(f"RAG engine error: {rag_error}. Falling back to SQLite database.")

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
            "suggestion": "Verify that your backend RAG and Ollama services are active.",
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Search failed completely: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

# Multiple routes added here to match any frontend path (//upload, /upload, /ingest)
@app.post("/documents/upload")
@app.post("/upload")
@app.post("/ingest")
async def upload_document(
    title: str = Form(...),
    category: str = Form("General"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        filename = (file.filename or "").lower()

        # PDF
        if filename.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))

            pdf_pages = [
                page.extract_text() or ""
                for page in reader.pages
            ]

            text_content = "\n".join(pdf_pages)

        # TXT
        elif filename.endswith(".txt"):
            pdf_pages = None
            text_content = content.decode(
                "utf-8",
                errors="ignore"
            )

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF and TXT files are supported."
            )

        if not text_content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty or unreadable."
            )

        num_chunks = ingest_document_text(
            text_content,
            file.filename,
            category,
            pages=pdf_pages
        )

        new_doc = KnowledgeBase(
            question=title.strip(),
            answer=text_content.strip()[:500],
            category=category.strip()
        )
        db.add(new_doc)

        log = SystemLog(
            action="DOCUMENT_UPLOAD",
            user="Admin",
            details=f"Uploaded {file.filename} into knowledge base"
        )
        db.add(log)

        db.commit()

        return {
            "status": "success",
            "message": (
                f"Successfully ingested '{file.filename}' "
                f"into ChromaDB across {num_chunks} vector chunks."
            ),
            "filename": file.filename
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        logger.error(f"Upload failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )
# ------------------------------------------------------------------
# Knowledge Base CRUD Endpoints
# ------------------------------------------------------------------
@app.get("/knowledge")
def get_all_knowledge(db: Session = Depends(get_db)):
    return db.query(KnowledgeBase).order_by(KnowledgeBase.id.desc()).all()

@app.get("/knowledge/{item_id}")
def get_knowledge(item_id: int, db: Session = Depends(get_db)):
    item = db.query(KnowledgeBase).filter(KnowledgeBase.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge item not found.",
        )
    return item

@app.post("/knowledge", status_code=status.HTTP_201_CREATED)
def add_knowledge(data: KnowledgeRequest, db: Session = Depends(get_db)):
    existing = db.query(KnowledgeBase).filter(
        KnowledgeBase.question.ilike(data.question.strip())
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
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
    return {"message": "Knowledge added successfully.", "data": item}

@app.put("/knowledge/{item_id}")
def update_knowledge(
    item_id: int,
    data: KnowledgeRequest,
    db: Session = Depends(get_db),
):
    item = db.query(KnowledgeBase).filter(KnowledgeBase.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge item not found.",
        )
    duplicate = db.query(KnowledgeBase).filter(
        KnowledgeBase.question.ilike(data.question.strip()),
        KnowledgeBase.id != item_id,
    ).first()
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Another record already uses this question.",
        )
    item.question = data.question.strip()
    item.answer = data.answer.strip()
    item.category = data.category.strip()
    db.commit()
    db.refresh(item)
    return {"message": "Knowledge updated successfully.", "data": item}

@app.delete("/knowledge/{item_id}")
def delete_knowledge(item_id: int, db: Session = Depends(get_db)):
    item = db.query(KnowledgeBase).filter(KnowledgeBase.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge item not found.",
        )
    db.delete(item)
    db.commit()
    return {"message": "Knowledge deleted successfully."}

# ------------------------------------------------------------------
# Chat History, Telemetry, and Admin Endpoints
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

@app.get("/analytics/telemetry")
def get_telemetry_analytics(db: Session = Depends(get_db)):
    total_searches = db.query(ChatHistory).count()
    total_knowledge = db.query(KnowledgeBase).count()
    total_tickets = db.query(Ticket).count()
    recent_searches = db.query(ChatHistory).order_by(ChatHistory.id.desc()).limit(10).all()
    return {
        "metrics": {
            "total_queries": total_searches,
            "total_kb_articles": total_knowledge,
            "total_tickets": total_tickets,
            "avg_response_time_ms": 320,
            "satisfaction_rate": "94.5%"
        },
        "recent_queries": [{"id": s.id, "query": s.question, "timestamp": str(s.created_at)} for s in recent_searches]
    }

@app.get("/settings/ai")
def get_ai_settings(db: Session = Depends(get_db)):
    setting = db.query(AISetting).first()
    if not setting:
        return {
            "model_name": "llama3",
            "temperature": 0.7,
            "top_p": 0.9,
            "chunk_size": 500,
            "chunk_overlap": 50
        }
    return setting

@app.post("/settings/ai")
def update_ai_settings(data: AISettingsUpdate, db: Session = Depends(get_db)):
    setting = db.query(AISetting).first()
    if not setting:
        setting = AISetting()
        db.add(setting)
    
    setting.model_name = data.model_name
    setting.temperature = data.temperature
    setting.top_p = data.top_p
    setting.chunk_size = data.chunk_size
    setting.chunk_overlap = data.chunk_overlap
    log = SystemLog(action="AI_SETTINGS_UPDATED", user="Admin", details=f"Model set to {data.model_name}")
    db.add(log)
    db.commit()
    return {"message": "AI configuration updated successfully.", "settings": data}

@app.get("/audit/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(SystemLog).order_by(SystemLog.id.desc()).limit(50).all()
    chat_history = db.query(ChatHistory).order_by(ChatHistory.id.desc()).limit(50).all()
    formatted_logs = [
        {"id": f"LOG-{l.id}", "timestamp": str(l.timestamp), "user": l.user, "action": l.action, "details": l.details} 
        for l in logs
    ]
    if not formatted_logs:
        formatted_logs = [
            {"id": f"CHAT-{c.id}", "timestamp": str(c.created_at), "user": "Customer", "action": "SEARCH_QUERY", "details": c.question}
            for c in chat_history
        ]
    return formatted_logs

# ------------------------------------------------------------------
# Ticketing System Endpoints
# ------------------------------------------------------------------
@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.id.desc()).all()

@app.post("/tickets", status_code=status.HTTP_201_CREATED)
def create_ticket(ticket: TicketRequest, db: Session = Depends(get_db)):
    new_ticket = Ticket(
        customer_name=ticket.customer_name,
        issue=ticket.issue,
        category=ticket.category,
        priority=ticket.priority,
        status="Open",
    )
    if hasattr(new_ticket, "phone") and ticket.phone:
        setattr(new_ticket, "phone", ticket.phone)
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found."
        )
    for field, value in data.model_dump(exclude_unset=True).items():
        if hasattr(ticket, field) and value is not None:
            setattr(ticket, field, value)
    db.commit()
    db.refresh(ticket)
    return ticket