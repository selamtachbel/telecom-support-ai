# Sprint Documentation
## Telecom Support Knowledge Assistant — MSSE Capstone

**Project:** Telecom Support Knowledge Assistant  
**Development approach:** Individual Agile/Scrum-inspired Capstone development  
**Status date:** 17 August 2026

> This document records the four sprint groups defined in the Capstone proposal and tracks what has actually been implemented, what remains under validation, and what is still pending. It should be updated as work progresses.

## Sprint 1 — Foundation and Setup

**Sprint goal:** Establish the project structure, frontend, backend, database, authentication foundation, and initial interfaces.

### Planned work
- Project setup and repository creation
- React/Vite frontend
- FastAPI backend
- SQLite database initialization
- User registration/login foundation
- Authentication and authorization
- Basic user interface

### Work completed
- React/Vite frontend created
- FastAPI backend created
- SQLite database configured through SQLAlchemy
- Git repository initialized and pushed to GitHub
- Landing page and role-specific portals created
- Login endpoint and role field implemented
- Customer, Service Desk, Engineer/Site Engineer, Knowledge Base, and Administrator interfaces created
- Database tables verified for `users`, `knowledge_base`, `chat_history`, and `tickets`

### Remaining / validation
- Harden role-based route protection
- Review whether user self-registration is required or whether seeded/admin-created users are sufficient
- Add automated authentication tests

**Sprint status:** Mostly complete

---

## Sprint 2 — Knowledge Management

**Sprint goal:** Build the telecom knowledge-management foundation used by customers, agents, and engineers.

### Planned work
- Document upload
- PDF processing
- Document categorization
- Knowledge base management
- Vector database integration
- Embedding generation

### Work completed
- Knowledge Base CRUD API implemented
- Administrator can add knowledge questions, answers, and categories
- Customer search successfully retrieves knowledge added from the Admin page
- Knowledge search fallback to SQLite is working
- ChromaDB/RAG integration files are present
- Document upload endpoint is present in the FastAPI backend
- Knowledge categorization is supported

### Remaining / validation
- Implement/validate true PDF text extraction rather than simple byte decoding
- Validate document-to-ChromaDB ingestion end-to-end
- Verify embedding generation with a representative telecom document set
- Add automated CRUD and document-ingestion tests

**Sprint status:** Mostly complete; PDF/RAG ingestion validation pending

---

## Sprint 3 — AI and Retrieval

**Sprint goal:** Deliver the Enu question-answering experience and connect retrieval, answer generation, confidence, and history.

### Planned work
- Question-and-answer interface
- RAG retrieval
- Response generation
- Source citations
- Confidence scoring
- Chat history

### Work completed
- Enu AI Telecom Assistant interface created
- `/search` API implemented
- RAG-first search with SQLite fallback implemented
- Customer Portal returns stored telecom support answers
- No-match behavior verified
- Confidence and source information displayed in the UI
- Chat history is stored through the backend
- Common support examples such as PUK, internet, billing, SIM, and packages are supported through the knowledge base

### Remaining / validation
- Validate RAG responses with Ollama/ChromaDB active
- Improve document-level/page-level citation display
- Run a formal telecom question evaluation set
- Measure answer accuracy, retrieval relevance, and response latency

**Sprint status:** Functional prototype complete; RAG/citation evaluation pending

---

## Sprint 4 — Support Features, Integration, Testing and Deployment

**Sprint goal:** Complete the operational support workflow and prepare the system for production-style demonstration.

### Planned work
- Troubleshooting recommendations
- Escalation guidance
- Feedback collection
- Analytics dashboard
- Performance monitoring
- Deployment
- Testing and evaluation

### Work completed
- Service Desk ticket queue created
- Service Desk loads tickets from FastAPI/SQLite
- Ticket detail view and knowledge-solution action implemented
- Escalation interface implemented
- Engineer/Site Engineer dashboard created
- Engineer ticket actions and diagnostics UI created
- Administrator dashboard created
- Reports/dashboard interfaces created
- Helpful / Not Helpful feedback controls exist in the customer interface
- GitHub repository created
- README added
- Proposal stored in the `docs` folder

### In progress
- Persist Service Desk → Site Engineer escalation details correctly
- Complete Site Engineer status workflow (`Escalated` → `In Progress` → `Resolved`)
- Ensure changes survive refresh and are visible across portals
- Make analytics fully database-driven rather than partly static
- Persist user feedback

### Pending
- Automated unit/API tests
- Integration and end-to-end test suite
- Performance evaluation against proposal targets
- GitHub Actions CI/CD
- Cloud deployment (for example Render)
- Final design/testing evidence
- Final 15–20 minute demonstration

**Sprint status:** In progress

---

## End-to-End Workflow Being Validated

```text
Customer
   ↓
Ask Enu
   ↓
Issue not solved
   ↓
Create Support Ticket
   ↓
Service Desk receives ticket
   ↓
Service Desk troubleshoots using Knowledge Base
   ├── Solved → Resolved
   └── Not solved → Escalate to Site Engineer
                         ↓
                 Site Engineer investigates
                         ↓
                      Resolved
```

## Definition of Done for Final Capstone

A feature is considered complete when:

1. The user-facing behavior works in the appropriate portal.
2. Required data is persisted in SQLite or the appropriate knowledge store.
3. The feature still works after browser refresh/restart.
4. The main success and error paths are tested.
5. The implementation is documented in GitHub.
6. The related user story/task is marked complete on the agile task board.

## Next Sprint Actions

1. Finish ticket escalation persistence and Site Engineer resolution flow.
2. Validate document upload/RAG ingestion.
3. Add feedback persistence and dynamic analytics.
4. Add automated tests and GitHub Actions.
5. Deploy the web application.
6. Complete final testing and demonstration preparation.
