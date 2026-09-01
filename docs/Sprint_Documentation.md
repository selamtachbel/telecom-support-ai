# Sprint Documentation

## Telecom Support Knowledge Assistant - MSSE Capstone

**Developer:** Selam Tachbel Bekele  
**Method:** Individual Agile/Scrum-inspired iterative delivery  
**Status date:** 1 September 2026 
**Current phase:**  Final submission preparation

## Working method

The project was delivered in four feature-focused iterations. User stories and backlog items were prioritized by their value to the end-to-end support workflow. Because this is an individual Capstone, Selam performed product-owner, developer, tester, and release responsibilities while using GitHub for source control, task tracking, and CI evidence.

The board workflow is **Backlog -> To Do -> In Progress -> Done**. A committed item is Done only when its user-facing behavior exists, relevant data persists, important success/error paths are tested, and documentation is updated. Ideas deliberately deferred beyond the Capstone are placed in a separate Future Enhancements group and are not counted as unfinished committed scope.

## Sprint 1 - Foundation and role-oriented interface

**Goal:** Establish the full-stack structure, persistence foundation, navigation, login foundation, and main user portals.

### Delivered

- React/Vite frontend and FastAPI backend repositories.
- SQLAlchemy/SQLite connection and application models.
- Landing, Customer, Service Desk, Engineer, Login, Knowledge Base, and Admin pages.
- Prototype staff login with role routing.
- Centralized frontend API configuration.
- Git/GitHub source control and Render deployment preparation.

### Evidence

- `frontend/src/main.jsx`
- `frontend/src/pages/`
- `backend/database.py`, `backend/models.py`, `backend/main.py`
- `POST /login`, `GET /health`

**Outcome:** Completed for Capstone prototype scope. Production authorization and password security are documented future hardening.

## Sprint 2 - Knowledge and RAG foundation

**Goal:** Provide approved knowledge management, document ingestion, retrieval, sources, and controlled answer behavior.

### Delivered

- Knowledge CRUD API and administrator interface.
- Approved SQLite knowledge retrieval.
- PDF/text upload and extraction path.
- Chunking with source/category/page metadata.
- FastEmbed and Chroma vector retrieval.
- Groq generation with an optional local Ollama path.
- Deterministic no-match behavior and chat-history persistence.

### Evidence

- `backend/rag_engine.py`
- `backend/rag_sources/`
- `frontend/src/pages/KnowledgeBase.jsx`
- `/search`, `/knowledge`, and `/documents/upload` endpoints

**Outcome:** Implemented for the Capstone prototype scope.

## Sprint 3 - Operational support workflow

**Goal:** Connect Enu self-service to persistent Service Desk and engineering work.

### Delivered

- Customer feedback and ticket creation.
- Persistent Service Desk queue, search, creation, resolution, and escalation actions.
- Engineer escalated/in-progress views.
- Diagnostic probable-cause and recommended-action responses.
- Engineer status updates and resolution.
- Cross-portal ticket data through shared backend endpoints.

### Evidence

- `CustomerPortal.jsx`, `ServiceDeskPortal.jsx`, `EngineerPortal.jsx`
- `/tickets`, `/tickets/{ticket_id}`, `/diagnostics`
- Backend automated escalation/resolution test

**Outcome:** Implemented and verified for the Capstone prototype scope. Ticket escalation and resolution persistence are covered by backend automated tests and local API verification.
## Sprint 4 - Administration, quality, and deployment

**Goal:** Add operational evidence, automated checks, documentation, and public access.

### Delivered

- User-management endpoints and UI.
- Feedback statistics, dashboard counts, telemetry, AI settings, and audit history.
- Deployed frontend, backend, health, and Swagger links.
- Backend Pytest, frontend Vitest, and Playwright test assets.
- GitHub Actions workflow for backend and frontend validation.
- README sections covering architecture, API endpoints, testing, security, deployment, and system scope, supported by sprint and backlog documentation.

### Verification status on 1 September 2026

- Backend Pytest suite: 4 tests passed locally.
- Frontend component tests: 2/2 passed locally.
- Frontend production build: passed locally.
- GitHub Actions CI run #40: passed successfully on the main branch.
- CI validates backend API tests, frontend component tests, production build, and Playwright end-to-end tests.
- Remaining ESLint findings are documented as non-blocking static-quality cleanup.

Outcome: Functionally delivered and validated for Capstone submission. Automated backend, frontend, build, and end-to-end validation are passing in CI.

## Definition of Done

A committed Capstone story is Done when:

1. The relevant portal/API behavior is implemented.
2. Persistent information survives refresh where persistence is required.
3. The main success path and an important failure path are checked.
4. The implementation is documented and traceable to source files/endpoints.
5. The related GitHub Project item is in Done.
6. No secret or production customer data is committed.

## Current submission-hardening tasks

| Task | Status | Completion evidence |
|---|---|---|
| Correct backend dependency file | Done | UTF-8 `backend/requirements.txt` |
| Add reproducible npm test scripts | Done | `frontend/package.json` |
| Extend CI to backend and production build | Done | `.github/workflows/ci.yml` |
| Confirm backend tests in CI | Done | GitHub Actions CI #40 |
| Confirm Playwright tests in CI | Done | GitHub Actions CI #40 |
| Verify frontend production build | Done | Local build and CI #40 |
| Fix Knowledge Base cloud API configuration | Done | Centralized `API_BASE_URL` |
| Verify ticket escalation persistence | Done | Backend tests and API verification |
| Update repository documentation | Done | README and `docs/` documentation |
| Resolve remaining ESLint findings | Deferred cleanup | Non-blocking static-quality improvement |
| Confirm public Project board status | Final check | Verify committed items are in Done |
| Confirm deployed Render links | Final check | Frontend, health endpoint, and Swagger |
## Retrospective

### What worked

- Iterative role-by-role development produced a complete support journey rather than an isolated chatbot.
- FastAPI and SQLAlchemy enabled rapid API/persistence development.
- A deterministic knowledge path reduced reliance on generated answers.
- Render made the full stack publicly demonstrable.

### What required correction

- Documentation lagged behind implementation and incorrectly showed completed work as pending.
- The original CI workflow covered only frontend tests.
- The dependency file encoding made clean backend setup unreliable.
- Static quality checks were not yet clean.

### Improvement applied

The final hardening phase converted documentation and CI into executable evidence rather than descriptive claims. Core backend, frontend, build, and end-to-end checks are passing, while remaining non-blocking cleanup items are documented transparently.

