# Telecom Support Knowledge Assistant

## MSSE Capstone Project

The **Telecom Support Knowledge Assistant** is an AI-powered telecom support platform developed as an individual Master of Software Engineering capstone project.

The system is designed to support telecom customers, Service Desk agents, network engineers, and administrators through a unified support workflow.

The application combines a telecom knowledge base, AI-assisted question answering, ticket management, escalation workflows, network diagnostics, analytics, and administrative tools.

---

## Live Application

### Frontend
https://telecom-support-ai-frontend.onrender.com

### Backend API
https://telecom-support-ai-api.onrender.com

### API Documentation
https://telecom-support-ai-api.onrender.com/docs

---

## Project Objectives

The project aims to improve telecom customer and technical support by:

- Providing customers with fast answers to common telecom questions
- Using a knowledge-based AI assistant to support troubleshooting
- Allowing Service Desk agents to create and manage support tickets
- Supporting escalation of complex incidents to network engineers
- Providing engineers with diagnostic and resolution tools
- Giving administrators visibility into users, knowledge, telemetry, AI configuration, and system activity
- Maintaining support information in a structured knowledge base

---

## AI Assistant

The telecom AI assistant is named **Enu**.

Enu uses a Retrieval-Augmented Generation (RAG) approach to retrieve relevant telecom knowledge before generating an answer.

Customer responses can include:

- Answer
- Category
- Confidence
- Knowledge source
- Matched question
- Knowledge status
- Suggested next action
- Helpful / Not Helpful feedback

---

## User Portals

### Customer Portal

The Customer Portal provides self-service telecom support.

Features include:

- AI chatbot with Enu
- Internet troubleshooting
- SIM support
- Billing information
- Package information
- Balance and telecom service guidance
- Customer support tickets
- Helpful / Not Helpful feedback
- Telecom service shortcuts

---

### Service Desk Portal

The Service Desk Portal is designed for support agents.

Features include:

- Support dashboard
- Ticket creation
- Active ticket queue
- Ticket search
- Ticket details
- Priority and status management
- Knowledge Base access
- AI-assisted support
- Ticket escalation
- Service Desk reports

---

### Engineer Portal

The Engineer Portal supports advanced technical troubleshooting.

Features include:

- Engineering operations dashboard
- Escalated ticket queue
- In-progress ticket management
- Knowledge Base access
- Network diagnostics
- Probable-cause analysis
- Recommended technical actions
- Ticket resolution
- Engineering reports

---

### Admin Portal

The Admin Portal provides system administration and monitoring.

Features include:

- System overview
- User management
- Knowledge/document management
- Telemetry and analytics
- AI model settings
- Document upload
- Feedback statistics
- System logs and audit history

---

## Ticket Workflow

The application supports the following ticket lifecycle:

Customer / Service Desk

↓

Open Ticket

↓

Service Desk Investigation

↓

Escalated

↓

Engineer Review

↓

In Progress

↓

Diagnostics and Troubleshooting

↓

Resolved

Ticket information is stored in the backend database and can be retrieved again after the application is refreshed or the user logs back in.

---

## Network Diagnostics

Engineers can run diagnostics for support tickets.

Diagnostic results may include:

- Network status
- Signal strength
- SIM registration status
- Fiber/network status
- Probable cause
- Recommended action
- Escalation requirement

---

## Knowledge Base

The Knowledge Base stores approved telecom support information used by both employees and the AI assistant.

Administrators can:

- Add knowledge
- Edit knowledge
- Delete knowledge
- Upload support documents

Service Desk agents and engineers can search the knowledge base while troubleshooting incidents.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- Axios
- React Icons

### Backend

- Python
- FastAPI
- SQLAlchemy
- REST API

### Database

- SQLite

### AI / RAG

- Retrieval-Augmented Generation
- Telecom Knowledge Base
- Groq-hosted language model integration

### Deployment

- Render
- GitHub

---

## System Architecture

```text
                   Telecom Support Platform
                            |
             +--------------+--------------+
             |                             |
        React Frontend                FastAPI Backend
             |                             |
   +---------+---------+           +-------+--------+
   |         |         |           |                |
Customer  Service    Engineer    REST API        AI / RAG
Portal     Desk       Portal        |                |
   |         |         |        SQLAlchemy     Knowledge Base
   +---------+---------+            |
             |                    SQLite
             |
         Admin Portal
```

---

## Important API Endpoints

Examples of backend endpoints include:

```text
GET    /health
GET    /search
GET    /tickets
POST   /tickets
PATCH  /tickets/{ticket_id}

GET    /knowledge

POST   /diagnostics

GET    /dashboard/stats
GET    /analytics/telemetry

GET    /settings/ai
POST   /settings/ai

GET    /audit/logs
```

Full API documentation is available through the deployed FastAPI Swagger interface.

---

## Testing

The system was tested across the complete telecom support workflow, including:

- Customer AI knowledge queries
- Ticket creation and persistence
- Service Desk ticket management
- Ticket escalation to engineers
- Engineer ticket retrieval
- Network diagnostics
- Ticket resolution
- Knowledge Base operations
- Admin analytics and telemetry
- AI configuration
- Document upload
- Audit logging

---

## Deployment

Both the frontend and backend are deployed to Render.

The frontend communicates with the deployed FastAPI backend using a centralized API configuration:

```javascript
API_BASE_URL
```

This allows the application components to communicate with the deployed cloud API instead of relying on localhost addresses.

---

## Future Improvements

Future enhancements may include:

- PostgreSQL production database
- Advanced role-based authentication
- Amharic language support
- Integration with real telecom network APIs
- SMS and email notifications
- Expanded AI knowledge sources
- Advanced AI evaluation
- Predictive incident classification
- Expanded analytics dashboards

---

## Capstone

This project was developed as an individual **Master of Software Engineering (MSSE) Capstone Project**.

It demonstrates the integration of:

- Software engineering
- Full-stack web development
- REST API design
- Database management
- Artificial intelligence
- Retrieval-Augmented Generation
- Cloud deployment
- Testing
- User-centered system design

---

## Author

**Selam Tachbel Bekele**

Master of Software Engineering (MSSE) Capstone Project  
Quantic School of Business and Technology