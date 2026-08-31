# User Stories and Product Backlog

## Telecom Support Knowledge Assistant - MSSE Capstone

**Status date:** 31 August 2026  
**Scope model:** committed Capstone scope plus separately identified future enhancements

## Status definitions

- **Done:** implemented in the submitted code and traceable to an interface/API.
- **Validation:** implemented but final repeatable CI/UAT evidence is still being completed.
- **To Do:** required submission-hardening work, not a new product feature.
- **Future:** intentionally outside the committed Capstone prototype scope.

The online GitHub Project board should use the same scope and status. Do not leave committed work marked Partial or Pending when the implementation is complete. Do not mark a feature Done unless it can be demonstrated.

## Committed user stories

| ID | Role | User story | Status | Primary evidence |
|---|---|---|---|---|
| US-01 | Customer | Ask natural-language questions about telecom support. | Done | Customer portal, `GET /search` |
| US-02 | Customer | Receive simple troubleshooting guidance for internet, SIM, billing, and packages. | Done | Curated knowledge and Enu UI |
| US-03 | Customer | See category, confidence, source, and next action. | Done | Search response and answer card |
| US-04 | Customer | Rate an answer Helpful or Not Helpful. | Done | `POST /feedback`, feedback UI |
| US-05 | Customer | Create a support ticket when self-service is insufficient. | Done | Customer ticket modal, `POST /tickets` |
| US-06 | Service Desk | View a persistent support-ticket queue and details. | Done | Service Desk portal, `GET /tickets` |
| US-07 | Service Desk | Search approved knowledge during troubleshooting. | Done | Knowledge load/search UI |
| US-08 | Service Desk | Create and resolve tickets. | Done | Ticket create/update actions |
| US-09 | Service Desk | Escalate unresolved incidents to an engineer. | Done | Escalation form, `PATCH /tickets/{id}` |
| US-10 | Service Desk | Review operational summaries/reports. | Done | Portal dashboard/report views |
| US-11 | Engineer | View escalated and in-progress incidents. | Done | Engineer portal filters |
| US-12 | Engineer | Run diagnostics and receive probable cause/recommended action. | Done | `POST /diagnostics`, diagnostics UI |
| US-13 | Engineer | Move tickets through In Progress to Resolved. | Done | Engineer update actions |
| US-14 | Engineer | Access knowledge while investigating. | Done | Engineer knowledge view |
| US-15 | Administrator | Create, update, list, and delete approved knowledge. | Done | Knowledge CRUD API/UI |
| US-16 | Administrator | Upload a text/PDF document for RAG ingestion. | Validation | Upload API/UI; final RAG evidence gate |
| US-17 | Administrator | Manage prototype users and roles. | Done | User endpoints/Admin UI |
| US-18 | Administrator | Review feedback statistics. | Done | `/feedback/stats`, Admin UI |
| US-19 | Administrator | Review dashboard counts and telemetry. | Done | Dashboard/telemetry endpoints |
| US-20 | Administrator | Review audit history. | Done | `/audit/logs`, Admin UI |
| US-21 | Administrator | View/update demonstration AI settings. | Done | Settings endpoints/Admin UI |
| US-22 | System | Persist knowledge, history, feedback, users, tickets, and settings. | Validation | SQLAlchemy models; final persistence UAT |
| US-23 | System | Fall back safely when an adequate grounded answer is unavailable. | Done | `/search` fallback/no-match logic |
| US-24 | System | Expose health and interactive API documentation. | Done | `/health`, `/docs` |
| US-25 | Developer | Validate the application through automated API, component, browser, and build checks. | Validation | Pytest, Vitest, Playwright, CI |
| US-26 | Grader | Access deployed software, repository documentation, task evidence, and test evidence. | Validation | README links, GitHub Project, CI |

## Product backlog

| ID | Deliverable | Priority | Status | Evidence/exit condition |
|---|---|---|---|---|
| PB-01 | Full-stack repository and role portals | Must | Done | Frontend/backend source present |
| PB-02 | Approved knowledge management | Must | Done | CRUD API and UI |
| PB-03 | Enu question/answer and fallback | Must | Done | Customer workflow |
| PB-04 | RAG ingestion and retrieval | Must | Validation | Repeatable PDF query with source/page |
| PB-05 | Persistent ticket workflow | Must | Validation | Cross-portal refresh UAT |
| PB-06 | Service Desk escalation | Must | Done | API and UI implementation |
| PB-07 | Engineering diagnostics/resolution | Must | Done | API and UI implementation |
| PB-08 | Feedback and operational analytics | Should | Done | Feedback/stats/telemetry endpoints |
| PB-09 | Admin management and audit views | Should | Done | Admin UI/endpoints |
| PB-10 | Public frontend/backend deployment | Must | Validation | Links open in signed-out browser |
| PB-11 | Automated tests and CI | Must | Validation | All GitHub Actions jobs green |
| PB-12 | Architecture/design documentation | Must | Done locally | README, architecture, design doc |
| PB-13 | Detailed testing evidence | Must | Validation | CI plus completed UAT matrix |
| PB-14 | Agile board synchronized with scope | Must | To Do | All committed items Done/Validation |
| PB-15 | Secret-safe configuration template | Must | Done locally | `.env.example`, `.gitignore` |
| PB-16 | Clean static-analysis gate | Should | To Do | `npm run lint` returns zero |

## Future enhancement backlog

The following ideas are not presented as incomplete committed Capstone requirements:

| ID | Future enhancement | Reason deferred |
|---|---|---|
| F-01 | Customer registration and production authentication | Requires hashing, tokens, authorization, recovery, and privacy design |
| F-02 | Amharic/local-language answers | Requires curated multilingual knowledge and evaluation |
| F-03 | Real telecom network/API integration | Requires provider authorization, secure connectivity, and real operational data |
| F-04 | SMS/email notifications | Requires external communication services and consent controls |
| F-05 | PostgreSQL and managed vector storage | Appropriate for production scale, beyond prototype hosting scope |
| F-06 | Predictive incident classification | Requires labeled historical incident data and ML evaluation |
| F-07 | Exportable management reports | Useful enhancement after core operational workflow |
| F-08 | Advanced monitoring and alerting | Requires production observability infrastructure |

## Traceability matrix

| Capstone evidence area | Stories/backlog | Repository evidence |
|---|---|---|
| Developed system and repository | US-01 to US-24, PB-01 to PB-09 | `frontend/`, `backend/` |
| Deployment | US-24/26, PB-10 | README project links |
| Agile methodology and task board | US-26, PB-14 | This file, sprint document, GitHub Project |
| Design and architecture | PB-12 | `README.md`, `ARCHITECTURE.md`, design/testing document |
| Testing | US-25, PB-11/13/16 | `backend/tests`, `frontend/src/test`, `frontend/e2e`, CI, `TESTING.md` |
| CI/CD tools | US-25, PB-11 | `.github/workflows/ci.yml` |
| Above-and-beyond initiative | US-03 to US-23 | RAG, four roles, tickets, diagnostics, analytics, audit, deployment |

## Board synchronization checklist

Before submission:

1. Create or update a GitHub Project item for every PB-01 to PB-16 item.
2. Move PB-01 to PB-09, PB-12, and PB-15 to Done only after pushing these local updates.
3. Keep PB-04, PB-05, PB-10, PB-11, and PB-13 in Validation until evidence is attached.
4. Keep PB-14 and PB-16 in To Do until completed.
5. Put F-01 to F-08 in a clearly labeled Future Enhancements group, not the active sprint.
6. Add the exact public board URL to the README.
7. Confirm the board is visible while signed out.

If the advisor approved a different committed scope, update both this file and the board so they match that approval exactly.
