# Telecom Support AI

Telecom Support AI is a full-stack, AI-assisted telecom support and knowledge management system developed as an MSSE Capstone project.

The application follows a realistic telecom support workflow:

Customer → Service Desk → Site Engineer

Customers can search for solutions using the Enu AI Telecom Assistant and create support tickets when an issue cannot be resolved. Service Desk agents can review and troubleshoot customer incidents, search the knowledge base, and escalate unresolved technical problems to Site Engineers.

## Project Objective

The goal of this project is to improve telecom customer support by combining:

- AI-assisted knowledge retrieval
- Telecom troubleshooting information
- Customer ticket management
- Service Desk operations
- Technical escalation
- Site Engineer support
- Role-based portals
- Knowledge management
- Reporting and analytics

## Main Workflow

Customer → Enu AI Assistant → Service Desk → Site Engineer → Resolved

## User Roles

### Customer
- Ask Enu telecom support questions
- Search common telecom issues
- View recommended solutions
- Create support tickets when troubleshooting does not solve the issue

### Service Desk Agent
- View incoming customer tickets
- Search and filter tickets
- Review ticket details
- Search the telecom knowledge base
- Troubleshoot customer issues
- Resolve supported incidents
- Escalate unresolved incidents to Site Engineers

### Site Engineer
- View escalated technical incidents
- Review incident details
- Start technical investigation
- Perform network diagnostics
- Resolve escalated incidents

### Administrator
- Manage telecom knowledge articles
- Add, update, and delete knowledge records
- Upload support documentation
- View system statistics

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Axios
- React Router
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- SQLite

### AI / Knowledge Retrieval
- Retrieval-Augmented Generation (RAG)
- ChromaDB
- Ollama
- Telecom Knowledge Base

## Main Features

- AI-assisted telecom support
- Telecom knowledge search
- Knowledge Base CRUD operations
- Customer Portal
- Service Desk Portal
- Site Engineer Portal
- Administrator Portal
- Role-based login
- Support ticket creation
- Ticket queue
- Ticket status tracking
- Ticket escalation
- Network diagnostics
- Chat history
- Dashboard statistics
- Reports and analytics
- RAG-powered search

## Backend API

- GET /
- GET /health
- POST /login
- GET /search
- GET /knowledge
- GET /knowledge/{id}
- POST /knowledge
- PUT /knowledge/{id}
- DELETE /knowledge/{id}
- POST /documents/upload
- GET /tickets
- POST /tickets
- PATCH /tickets/{ticket_id}
- GET /chat-history
- DELETE /chat-history
- GET /dashboard/stats

FastAPI API documentation:

http://127.0.0.1:8000/docs

## Running the Project Locally

### Backend
cd backend
uvicorn main:app --reload

### Frontend

Open another terminal:
cd frontend
npm install
npm run dev

Frontend usually runs at:

http://localhost:5173

## Agile Development

### Sprint 1 — Foundation and Setup
- Project structure
- React frontend setup
- FastAPI backend setup
- Database setup
- Initial authentication
- Initial portal interfaces

### Sprint 2 — Knowledge Management
- Telecom Knowledge Base
- Knowledge CRUD functionality
- Document ingestion
- Knowledge search
- Vector database integration

### Sprint 3 — AI and Retrieval
- Enu AI Assistant
- RAG integration
- Telecom question answering
- Chat history
- Confidence and source information

### Sprint 4 — Ticketing, Escalation and Final Integration
- Customer ticket creation
- Service Desk ticket management
- Site Engineer escalation
- Engineering workflow
- Reports
- Testing
- Deployment preparation

## Testing

Testing includes or will include:

- API endpoint testing
- Knowledge search testing
- Authentication testing
- Ticket creation testing
- Ticket status update testing
- Ticket escalation testing
- Database persistence testing
- Customer Portal testing
- Service Desk Portal testing
- Site Engineer Portal testing
- User acceptance testing

## Deployment

Live Application: Coming soon

## Author

Selam Tachbel

Master of Science in Software Engineering  
Quantic School of Business and Technology

## Project Status

🚧 Active Development

Core customer support, knowledge management, Service Desk, ticketing, and engineering functionality have been implemented. Remaining work focuses on end-to-end workflow validation, automated testing, CI/CD, deployment, documentation, and the final Capstone demonstration.