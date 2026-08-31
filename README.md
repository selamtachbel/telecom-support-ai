# Telecom Support Knowledge Assistant

## MSSE Capstone Project

The **Telecom Support Knowledge Assistant** is an AI-powered telecom support platform developed as an individual Master of Software Engineering Capstone project.

The system supports telecom customers, Service Desk agents, network engineers, and administrators through a unified support workflow.

The application combines an approved telecom knowledge base, AI-assisted question answering, ticket management, escalation workflows, network diagnostics, analytics, and administrative tools.

---

## Live Application

### Frontend

https://telecom-support-ai-frontend.onrender.com

### Backend API

https://telecom-support-ai-api.onrender.com

### API Documentation

https://telecom-support-ai-api.onrender.com/docs

### Project Evidence

* [GitHub Actions CI/CD](https://github.com/selamtachbel/telecom-support-ai/actions)
* [GitHub Project Board](https://github.com/selamtachbel/projects/1)
* [Design and Testing Document](docs/Design_and_Testing_Document.docx)
* [Sprint Documentation](docs/Sprint_Documentation.md)
* [User Stories and Product Backlog](docs/User_Stories_and_Backlog.md)

---

## Project Objectives

The project aims to improve telecom customer and technical support by:

* Providing customers with fast answers to common telecom questions
* Using an approved knowledge base and AI assistant to support troubleshooting
* Allowing customers to create support tickets when self-service is insufficient
* Allowing Service Desk agents to create and manage support tickets
* Supporting escalation of complex incidents to network engineers
* Providing engineers with diagnostic and resolution tools
* Giving administrators visibility into users, knowledge, telemetry, AI configuration, and system activity
* Maintaining support information in a structured and searchable knowledge base

---

## AI Assistant

The telecom AI assistant is named **Enu**.

Enu first searches the approved telecom knowledge base for a reliable matching answer. If no sufficiently relevant approved answer is found, the system uses Retrieval-Augmented Generation (RAG) to retrieve supporting document content and generate a grounded response.

Customer responses can include:

* Answer
* Category
* Confidence
* Knowledge source
* Matched question
* Knowledge status
* Suggested next action
* Helpful or Not Helpful feedback

If Enu cannot provide an adequate solution, the customer can create a support ticket for human assistance.

---

## User Portals

### Customer Portal

The Customer Portal provides self-service telecom support.

Features include:

* AI chatbot with Enu
* Internet troubleshooting
* SIM support
* Billing information
* Package information
* Balance and telecom service guidance
* Customer support ticket creation
* Helpful or Not Helpful feedback
* Telecom service shortcuts

### Service Desk Portal

The Service Desk Portal is designed for support agents.

Features include:

* Support dashboard
* Ticket creation
* Active ticket queue
* Ticket search
* Ticket details
* Priority and status management
* Knowledge Base access
* AI-assisted support
* Ticket resolution
* Ticket escalation
* Service Desk reports

### Engineer Portal

The Engineer Portal supports advanced technical troubleshooting.

Features include:

* Engineering operations dashboard
* Escalated ticket queue
* In-progress ticket management
* Knowledge Base access
* Network diagnostics
* Probable-cause analysis
* Recommended technical actions
* Ticket resolution
* Engineering reports

### Admin Portal

The Admin Portal provides system administration and monitoring.

Features include:

* System overview
* User management
* Knowledge and document management
* Telemetry and analytics
* AI model settings
* Document upload
* Feedback statistics
* System logs and audit history

---

## Ticket Workflow

The application supports the following ticket lifecycle:

```text
Customer asks Enu
        ↓
Issue is not resolved
        ↓
Customer or Service Desk creates a ticket
        ↓
Service Desk investigates
        ↓
     ┌───────────────┐
     │               │
  Resolved        Escalated
                     ↓
              Engineer review
                     ↓
                In Progress
                     ↓
          Diagnostics and troubleshooting
                     ↓
                  Resolved
```

Ticket information is stored in the backend database. Ticket status remains available after the application is refreshed and can be viewed across the Service Desk and Engineer portals.

---

## Network Diagnostics

Engineers can run simulated diagnostics for support tickets.

Diagnostic results may include:

* Network status
* Signal strength
* SIM registration status
* Fiber or network status
* Probable cause
* Recommended action
* Escalation requirement

The diagnostic feature demonstrates the intended engineering workflow. It is not connected to a live telecom network.

---

## Knowledge Base

The Knowledge Base stores approved telecom support information used by customers, Service Desk agents, engineers, and Enu.

Administrators can:

* Add knowledge
* Edit knowledge
* Delete knowledge
* Upload support documents
* Organize knowledge by category

Service Desk agents and engineers can search the Knowledge Base while troubleshooting incidents.

Uploaded text and PDF documents can be processed for RAG retrieval. Source and page information can be returned when it is available.

---

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* Axios
* React Router
* React Icons

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* REST API

### Database

* SQLite

### AI and RAG

* Retrieval-Augmented Generation
* Approved telecom knowledge base
* ChromaDB vector storage
* FastEmbed embeddings
* Groq-hosted language model integration
* Optional local Ollama integration

### Testing

* Pytest
* FastAPI TestClient
* Vitest
* React Testing Library
* Playwright

### Deployment and Engineering Tools

* Render
* Git
* GitHub
* GitHub Projects
* GitHub Actions

---

## System Architecture

```text
                    Telecom Support Platform
                               │
              ┌────────────────┴────────────────┐
              │                                 │
      React/Vite Frontend                 FastAPI Backend
              │                                 │
   ┌──────────┼──────────┐          ┌───────────┼───────────┐
   │          │          │          │           │           │
Customer   Service    Engineer   REST API   SQLAlchemy   AI/RAG
Portal      Desk       Portal        │           │           │
   │          │          │           │         SQLite     ChromaDB
   └──────────┼──────────┘           │                       │
              │                      │                 Groq or Ollama
         Admin Portal                │
              └──────────────────────┘
```

The application follows a layered client-server architecture:

* The React/Vite frontend provides role-specific user interfaces
* The FastAPI backend validates requests and manages application workflows
* SQLAlchemy connects the application to the SQLite database
* The Knowledge Base provides approved and predictable answers
* The RAG layer retrieves relevant document content
* Groq or Ollama generates answers from retrieved context
* Render hosts the deployed frontend and backend

---

## Important API Endpoints

Examples of backend endpoints include:

```text
GET     /
GET     /health
POST    /login

GET     /search
POST    /feedback
GET     /feedback/stats

GET     /tickets
POST    /tickets
PATCH   /tickets/{ticket_id}

GET     /knowledge
GET     /knowledge/{item_id}
POST    /knowledge
PUT     /knowledge/{item_id}
DELETE  /knowledge/{item_id}

POST    /documents/upload
POST    /diagnostics

GET     /dashboard/stats
GET     /analytics/telemetry

GET     /settings/ai
POST    /settings/ai

GET     /users
POST    /users
DELETE  /users/{user_id}

GET     /audit/logs
```

Full API documentation is available through the deployed FastAPI Swagger interface:

https://telecom-support-ai-api.onrender.com/docs

---

## Testing

The project uses multiple levels of testing to validate individual components, API behavior, system integration, and complete user workflows.

### Automated Testing

The repository includes:

* Backend API tests using Pytest and FastAPI TestClient
* Frontend component tests using Vitest and React Testing Library
* End-to-end browser tests using Playwright
* Automated GitHub Actions checks for pushes and pull requests
* Frontend production-build verification

Automated test coverage includes:

* API health and startup
* Customer interaction with Enu
* Feedback statistics
* Customer ticket creation
* Service Desk ticket escalation
* Engineer ticket resolution
* Customer Portal loading
* Frontend production build

### User Acceptance and Integration Testing

The complete telecom support workflow was manually tested across:

* Customer AI knowledge queries
* Known and unknown question handling
* Feedback submission
* Customer ticket creation and persistence
* Service Desk ticket management
* Ticket escalation to engineers
* Engineer ticket retrieval
* Network diagnostics
* Ticket resolution
* Knowledge Base operations
* Document upload and RAG retrieval
* Admin analytics and telemetry
* AI configuration
* System logs and audit history

Detailed testing methods, test cases, expected results, and evidence are provided in the [Design and Testing Document](docs/Design_and_Testing_Document.docx).

### Running Backend Tests

```bash
cd backend
pytest -q
```

### Running Frontend Component Tests

```bash
cd frontend
npx vitest run
```

### Running End-to-End Tests

```bash
cd frontend
npx playwright test
```

### Creating a Production Build

```bash
cd frontend
npm run build
```

---

## Deployment

Both the frontend and backend are deployed to Render.

The frontend communicates with the deployed FastAPI backend using a centralized API configuration:

```javascript
API_BASE_URL
```

The API address can be configured using:

```env
VITE_API_URL=http://127.0.0.1:8000
```

This allows the same frontend components to communicate with either a local FastAPI server or the deployed cloud API without changing every application page.

Deployment credentials, API keys, and allowed origins are configured through environment variables.

---

## Software Engineering Methodology

The project used an individual Agile and Scrum-inspired development approach.

The work was organized into four main iterations:

1. Project foundation, database, routing, and user portals
2. Knowledge management, document processing, and RAG integration
3. Customer, Service Desk, and Engineer support workflows
4. Administration, testing, CI/CD, deployment, and documentation

User stories and backlog items were tracked through GitHub project-management tools.

A feature is considered complete when:

* The required user-facing behavior works
* Required information is stored in the database
* Persistent information remains available after refresh
* Important success and failure paths are tested
* The implementation is documented
* The related task is updated on the Agile task board

---

## Security and Privacy

The repository uses environment variables and `.gitignore` rules to prevent API keys, passwords, local databases, and other sensitive configuration from being committed.

Important security considerations include:

* Only simulated or test information should be used
* Real telecom customer data must not be stored
* API keys and deployment credentials must be configured through environment variables
* Production CORS should allow only approved frontend addresses
* Uploaded documents should be trusted test documents
* The current authentication system is a Capstone prototype and requires additional hardening before production use

---

## Current Scope and Limitations

This application is an educational Capstone prototype.

Current limitations include:

* SQLite is used for prototype persistence rather than a production database
* Network diagnostics are simulated and are not connected to live telecom infrastructure
* Authentication requires password hashing, secure tokens, and backend role authorization before production use
* AI response quality depends on the accuracy and completeness of the approved knowledge sources
* Render free-tier services may experience cold-start delays
* The system is not designed to store sensitive or real customer information

These limitations do not prevent the application from demonstrating the intended Capstone workflows.

---

## Future Improvements

Future enhancements may include:

* PostgreSQL production database
* Secure password hashing and token-based authentication
* Advanced backend role-based authorization
* Amharic language support
* Integration with real telecom network APIs
* SMS and email notifications
* Expanded AI knowledge sources
* Advanced AI evaluation
* Predictive incident classification
* Expanded analytics dashboards
* Exportable management reports
* Production monitoring and alerting

---

## Above-and-Beyond Capstone Features

The project goes beyond a basic chatbot or CRUD application by combining:

* Retrieval-Augmented Generation
* Approved knowledge-base fallback
* Source and page information
* Four role-specific user experiences
* Persistent ticket escalation and resolution
* Service Desk and Engineer collaboration
* Simulated network diagnostics
* Knowledge and document management
* Feedback statistics
* Analytics and telemetry
* AI configuration
* Audit history
* Automated testing
* GitHub Actions CI/CD
* Public frontend and backend deployment

---

## Capstone

This project was developed as an individual **Master of Software Engineering Capstone Project**.

It demonstrates the integration of:

* Software engineering
* Full-stack web development
* REST API design
* Database management
* Artificial intelligence
* Retrieval-Augmented Generation
* Cloud deployment
* Automated testing
* Agile development
* CI/CD
* User-centered system design

---

## Author

**Selam Tachbel Bekele**

Master of Software Engineering Capstone Project
Quantic School of Business and Technology
