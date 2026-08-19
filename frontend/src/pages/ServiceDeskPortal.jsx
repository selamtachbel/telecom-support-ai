import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ServiceDeskPortal.css";

function ServiceDeskPortal() {
  const navigate = useNavigate();

  /* ===============================
      USER
  =============================== */
  const savedUser = JSON.parse(localStorage.getItem("enuUser") || "{}");
  const agentName = savedUser.username || "Service Desk Agent";

  /* ===============================
      STATES
  =============================== */
  const [tickets, setTickets] = useState([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchText, setSearchText] = useState("");
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [notification, setNotification] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalation, setEscalation] = useState({
    team: "",
    reason: "",
  });

  const services = [
    {
      title: "Internet Troubleshooting",
      description: "Resolve broadband, Wi-Fi and mobile internet problems.",
      icon: "🌐",
      section: "internet",
    },
    {
      title: "Billing Support",
      description: "Help customers with billing and payments.",
      icon: "💳",
      section: "knowledge",
    },
    {
      title: "SIM Services",
      description: "Support SIM replacement and activation.",
      icon: "📱",
      section: "knowledge",
    },
    {
      title: "Service Requests",
      description: "Manage customer support tickets.",
      icon: "🎫",
      section: "tickets",
    },
    {
      title: "Escalation",
      description: "Escalate incidents to engineers.",
      icon: "🚨",
      section: "escalations",
    },
    {
      title: "Knowledge Base",
      description: "Search telecom solutions.",
      icon: "📚",
      section: "knowledge",
    },
  ];

  const [newTicket, setNewTicket] = useState({
    customer: "",
    issue: "",
    category: "Internet",
    priority: "Medium",
  });

  /* ===============================
      LOAD DATA
  =============================== */
  useEffect(() => {
    loadTickets();
    loadKnowledge();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/tickets");
      const formattedTickets = response.data.map((ticket) => ({
        ...ticket,
        customer: ticket.customer_name || ticket.customer,
        time: ticket.created_at
          ? new Date(ticket.created_at).toLocaleString()
          : ticket.time,
      }));
      setTickets(formattedTickets);
    } catch (error) {
      console.error("Failed to load tickets", error);
    }
  };

  const loadKnowledge = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/knowledge");
      setKnowledgeArticles(response.data);
    } catch (error) {
      console.error("Failed to load knowledge", error);
    }
  };

  /* ===============================
      NOTIFICATIONS
  =============================== */
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  /* ===============================
      LOGOUT
  =============================== */
  const handleLogout = () => {
    localStorage.removeItem("enuUser");
    navigate("/");
  };

  /* =====================================
      DASHBOARD STATISTICS
  ===================================== */
  const stats = [
    {
      label: "Open Tickets",
      value: tickets.filter((ticket) => ticket.status === "Open").length,
      change: "Current Queue",
      icon: "🎫",
    },
    {
      label: "Resolved Today",
      value: tickets.filter((ticket) => ticket.status === "Resolved").length,
      change: "Completed",
      icon: "✅",
    },
    {
      label: "Escalated",value: tickets.filter((ticket) => ticket.status === "Escalated").length,
      change: "Engineer Review",
      icon: "🚨",
    },
    {
      label: "Total Tickets",
      value: tickets.length,
      change: "All Requests",
      icon: "📈",
    },
  ];

  /* =====================================
      TICKET SEARCH
  ===================================== */
  const filteredTickets = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return tickets;
    return tickets.filter((ticket) => {
      return (
        ticket.id?.toString().toLowerCase().includes(query) ||
        ticket.customer?.toLowerCase().includes(query) ||
        ticket.issue?.toLowerCase().includes(query) ||
        ticket.category?.toLowerCase().includes(query) ||
        ticket.priority?.toLowerCase().includes(query) ||
        ticket.status?.toLowerCase().includes(query)
      );
    });
  }, [tickets, searchText]);

  /* =====================================
      KNOWLEDGE BASE SEARCH
  ===================================== */
  const filteredKnowledge = useMemo(() => {
    const query = knowledgeSearch.trim().toLowerCase();
    if (!query) return knowledgeArticles;
    return knowledgeArticles.filter((article) => {
      const question = article.question?.toLowerCase() || "";
      const answer = article.answer?.toLowerCase() || "";
      const category = article.category?.toLowerCase() || "";
      return (
        question.includes(query) ||
        answer.includes(query) ||
        category.includes(query)
      );
    });
  }, [knowledgeSearch, knowledgeArticles]);

  /* =====================================
      ESCALATED TICKETS
  ===================================== */
  const escalatedTickets = tickets.filter(
    (ticket) => ticket.status === "Escalated"
  );

  /* =====================================
      FIND KNOWLEDGE SOLUTION
  ===================================== */
  const handleFindSolution = () => {
    if (!selectedTicket) {
      showNotification("Please select a ticket first.");
      return;
    }
    setKnowledgeSearch(selectedTicket.issue || selectedTicket.category);
    setActiveSection("knowledge");
    showNotification("Searching Knowledge Base...");
  };

  /* =====================================
      ESCALATE TICKET
  ===================================== */
  const handleEscalateTicket = () => {
    if (!selectedTicket) {
      showNotification("Please select a ticket first.");
      return;
    }
    setEscalation({
      team: "",
      reason: "",
    });
    setShowEscalationModal(true);
  };

  /* =====================================
      CONFIRM ESCALATION (PERSISTED TO BACKEND)
  ===================================== */
  const confirmEscalation = async () => {
    if (!escalation.team) {
      showNotification("Please select an engineer.");
      return;
    }
    if (!escalation.reason.trim()) {
      showNotification("Please enter the reason.");
      return;
    }

    const payload = {
      status: "Escalated",
      assignedTo: escalation.team,
      escalationReason: escalation.reason,
      escalatedAt: new Date().toISOString(),
    };

    try {
      // Send update to Backend database so it persists on page refresh
      await axios.patch(
        `http://127.0.0.1:8000/tickets/${selectedTicket.id}`,
        payload
      );

      // Update state locally
      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === selectedTicket.id) {
          return {
            ...ticket,
            ...payload,
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        ...payload,
      });

      setShowEscalationModal(false);
      showNotification("Ticket escalated successfully.");
    } catch (error) {
      console.error("Escalation failed", error);
      // Fallback update locally if backend patch isn't implemented on backend yet
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicket.id ? { ...ticket, ...payload } : ticket
        )
      );
      setShowEscalationModal(false);
      showNotification("Escalated locally (failed to save on backend).");
    }
  };

  /* =====================================
      OPEN MODULE
  ===================================== */
  const handleOpenModule = (service) => {
    setActiveSection(service.section);
    if (service.title === "Knowledge Base") {
      setKnowledgeSearch("");
    }
    if (service.title === "Billing Support") {
      setKnowledgeSearch("billing");
    }
    if (service.title === "SIM Services") {
      setKnowledgeSearch("sim");
    }
  };
  /* ===============================
   RESOLVE TICKET
=============================== */
const handleResolveTicket = async () => {
  if (!selectedTicket) {
    showNotification("Please select a ticket first.");
    return;
  }

  try {
    await axios.patch(
      `http://127.0.0.1:8000/tickets/${selectedTicket.id}`,
      {
        status: "Resolved",
      }
    );

    await loadTickets();

    setSelectedTicket({
      ...selectedTicket,
      status: "Resolved",
    });

    showNotification("Ticket resolved successfully.");
  } catch (error) {
    console.error("Failed to resolve ticket:", error);
    showNotification("Unable to resolve ticket.");
  }
};

  /* =====================================
      CREATE NEW TICKET
  ===================================== */
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.customer.trim() || !newTicket.issue.trim()) {
      showNotification("Please complete all fields.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/tickets", {
        customer_name: newTicket.customer,
        issue: newTicket.issue,
        category: newTicket.category,
        priority: newTicket.priority,
      });
      await loadTickets();
      setNewTicket({
        customer: "",
        issue: "",
        category: "Internet",
        priority: "Medium",
      });
      setShowNewTicket(false);
      showNotification(
        `Ticket ${response.data.id} created successfully`
      );
    } catch (error) {
      console.error(error);
      showNotification("Unable to create ticket.");
    }
  };

  /* =====================================
      TICKET TABLE COMPONENT
  ===================================== */
  const renderTicketTable = (ticketList) => (
    <div className="service-table-wrapper">
      <table className="service-ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Customer</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Received</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ticketList.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <strong>{ticket.id}</strong>
              </td>
              <td>{ticket.customer}</td>
              <td>
                <div className="service-issue-cell">
                  <strong>{ticket.issue}</strong>
                  <span>{ticket.category}</span>
                </div>
              </td>
              <td>
                <span
                  className={`service-priority-badge ${ticket.priority?.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span
                  className={`service-status-badge ${ticket.status
                    ?.toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {ticket.status}
                </span>
              </td>
              <td>{ticket.time}</td>
              <td>
                <button
                  className="service-open-ticket-button"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setActiveSection("dashboard");
                  }}
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {ticketList.length === 0 && (
        <div className="service-empty-state">No tickets found.</div>
      )}
    </div>
  );

  /* =====================================
      MAIN RENDER
  ===================================== */
  return (
    <div className="service-desk-page">
      {/* SIDEBAR */}
      <aside className="service-sidebar">
        <div className="service-brand">
          <div className="service-brand-icon">🎧</div>
          <div>
            <strong>Enu Telecom</strong>
            <span>Service Desk Portal</span>
          </div>
        </div>
        <nav className="service-nav">
          <button
            className={`service-nav-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            🏠 Dashboard
          </button>
          <button
            className={`service-nav-item ${
              activeSection === "tickets" ? "active" : ""
            }`}
            onClick={() => setActiveSection("tickets")}
          >
            🎫 Ticket Queue
          </button>
          <button
            className={`service-nav-item ${
              activeSection === "knowledge" ? "active" : ""
            }`}
            onClick={() => setActiveSection("knowledge")}
          >
            📚 Knowledge Base
          </button>
          <button
            className={`service-nav-item ${
              activeSection === "escalations" ? "active" : ""
            }`}
            onClick={() => setActiveSection("escalations")}
          >
            🚨 Escalations
          </button>
          <button
            className={`service-nav-item ${
              activeSection === "reports" ? "active" : ""
            }`}
            onClick={() => setActiveSection("reports")}
          >
            📊 Reports
          </button>
        </nav>
        <div className="service-sidebar-footer">
          <div className="agent-card">
            <div className="agent-avatar">
              {agentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{agentName}</strong>
              <span>IT Service Desk</span>
            </div>
          </div>
          <button className="service-logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="service-main">
        {notification && (
          <div className="service-notification">{notification}</div>
        )}

        {/* 1. DASHBOARD SECTION */}
        {activeSection === "dashboard" && (
          <>
            <header className="service-header">
              <div>
                <p className="service-eyebrow">IT SERVICE DESK</p>
                <h1>Support Operations Dashboard</h1>
                <p className="service-subtitle">
                  Monitor customer incidents, search telecom knowledge, manage
                  tickets and escalate issues to engineers.
                </p>
              </div>
              <div className="service-header-actions">
                <Link to="/" className="service-home-link">
                  ← Home
                </Link>
                <button
                  className="service-new-ticket-button"
                  onClick={() => setShowNewTicket(true)}
                >
                  + New Ticket
                </button>
              </div>
            </header>

            <section className="service-stats-grid">
              {stats.map((stat) => (
                <article key={stat.label} className="service-stat-card">
                  <div className="service-stat-top">
                    <span className="service-stat-icon">{stat.icon}</span>
                    <span className="service-live-dot">Live</span>
                  </div>
                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span className="service-stat-change">{stat.change}</span>
                </article>
              ))}
            </section>

            <section className="service-content-grid">
              <div className="service-ticket-section">
                <div className="service-section-heading">
                  <div>
                    <p className="service-section-label">CUSTOMER SUPPORT</p>
                    <h2>Active Ticket Queue</h2>
                    <span>Review and manage customer incidents.</span>
                  </div>
                  <div className="service-search-wrapper">
                    <span>🔎</span>
                    <input
                      type="text"value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search tickets..."
                    />
                  </div>
                </div>
                {renderTicketTable(filteredTickets)}
              </div>

              {/* TICKET DETAILS PANEL */}
              <aside className="service-ticket-details">
                <div className="service-detail-header">
                  <div>
                    <p className="service-section-label">TICKET DETAILS</p>
                    <h2>
                      {selectedTicket
                        ? selectedTicket.id
                        : "Select a Ticket"}
                    </h2>
                  </div>
                  {selectedTicket && (
                    <button
                      type="button"
                      className="service-close-detail"
                      onClick={() => setSelectedTicket(null)}
                    >
                      ×
                    </button>
                  )}
                </div>
                {selectedTicket ? (
                  <div className="service-detail-content">
                    <div className="service-customer-profile">
                      <div className="service-customer-avatar">
                        {selectedTicket.customer?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{selectedTicket.customer}</strong>
                        <span>{selectedTicket.category}</span>
                      </div>
                    </div>
                    <div className="service-detail-group">
                      <span>Reported Issue</span>
                      <strong>{selectedTicket.issue}</strong>
                    </div>
                    <div className="service-detail-row">
                      <div>
                        <span>Priority</span>
                        <strong>{selectedTicket.priority}</strong>
                      </div>
                      <div>
                        <span>Status</span>
                        <strong>{selectedTicket.status}</strong>
                      </div>
                    </div>
                    <div className="service-detail-group">
                      <span>Recommended Action</span>
                      <p>
                        Verify account, service status, network availability and
                        follow approved troubleshooting guides.
                      </p>
                    </div>
                    <button
  type="button"
  className="service-assist-button"
  onClick={handleFindSolution}
>
  ✨ Find Knowledge Solution
</button>

<button
  type="button"
  className="service-assist-button"
  onClick={handleResolveTicket}
>
  ✅ Resolve Ticket
</button>

<button
  type="button"
  className="service-escalate-button"
  onClick={handleEscalateTicket}
>
  🚨 Escalate Ticket
</button>
                  </div>
                ) : (
                  <div className="service-detail-empty">
                    <div>🎫</div>
                    <h3>No Ticket Selected</h3>
                    <p>
                      Select a ticket from the queue to view details and
                      available actions.
                    </p>
                  </div>
                )}
              </aside>
            </section>

            {/* SERVICE MODULES GRID */}
            <section className="service-modules-section">
              <div className="service-section-heading">
                <div>
                  <p className="service-section-label">SUPPORT TOOLS</p>
                  <h2>Service Desk Modules</h2>
                  <span>Open telecom support modules and resources.</span>
                </div>
              </div>
              <div className="service-modules-grid">
                {services.map((service) => (
                  <article
                    key={service.title}
                    className="service-module-card"
                  >
                    <div className="service-module-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <button
                      className="service-module-button"
                      onClick={() => handleOpenModule(service)}
                    >
                      Open Module →
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {/* 2. TICKET QUEUE SECTION */}
        {activeSection === "tickets" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">SERVICE DESK</p>
                <h1>Ticket Queue</h1>
                <p>Review, search and manage all customer support tickets.</p>
              </div>
              <button
                className="service-new-ticket-button"
                onClick={() => setShowNewTicket(true)}
              >
                + New Ticket
              </button>
            </div>
            <div className="service-section-heading">
              <div className="service-search-wrapper">
                <span>🔎</span>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search tickets..."
                />
              </div>
            </div>
            {renderTicketTable(filteredTickets)}
          </section>
        )}

        {/* 3. KNOWLEDGE BASE SECTION */}
        {activeSection === "knowledge" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">SUPPORT KNOWLEDGE</p>
                <h1>Knowledge Base</h1>
                <p>Search approved telecom troubleshooting procedures.</p>
              </div>
            </div>
            <div className="service-section-heading">
              <div className="service-search-wrapper">
                <span>🔎</span>
                <input
                  type="text"
                  value={knowledgeSearch}
                  onChange={(e) => setKnowledgeSearch(e.target.value)}
                  placeholder="Search knowledge..."
                />
              </div>
            </div>
            {filteredKnowledge.length > 0 ? (
              <div className="service-modules-grid">
                {filteredKnowledge.map((article) => (
                  <article key={article.id} className="service-module-card">
                    <div className="service-module-icon">📚</div>
                    <h3>{article.question}</h3>
                    <p>{article.answer}</p>
                    <span className="service-status-badge open">
                      {article.category}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="service-empty-state">
                <h2>No Knowledge Articles Found</h2>
                <p>Add articles to the database or change the search term.</p>
              </div>
            )}
          </section>
        )}

        {/* 4. INTERNET TROUBLESHOOTING SECTION */}
        {activeSection === "internet" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">INTERNET SUPPORT</p>
                <h1>Internet Troubleshooting</h1>
                <p>Diagnose broadband, Wi-Fi and mobile internet problems.</p>
              </div>
              <button
                className="service-home-link"onClick={() => setActiveSection("dashboard")}
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="service-module-page">
              <div className="service-card">
                <h2>Customer Information</h2>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedTicket?.customer || "No customer selected"}
                </p>
                <p>
                  <strong>Ticket:</strong> {selectedTicket?.id || "-"}
                </p>
                <p>
                  <strong>Issue:</strong> {selectedTicket?.issue || "-"}
                </p>
              </div>
              <div className="service-card">
                <h2>Quick Diagnostics</h2>
                <ul>
                  <li>✔️ Verify SIM status</li>
                  <li>✔️ Check customer balance</li>
                  <li>✔️ Restart customer device</li>
                  <li>✔️ Verify APN settings</li>
                  <li>✔️ Check network outage</li>
                </ul>
              </div>
              <div className="service-card">
                <h2>Resolution</h2>
                <button
                  className="service-assist-button"
                  onClick={() => {
                    if (!selectedTicket) {
                      showNotification("Select a ticket first.");
                      return;
                    }
                    setTickets((current) =>
                      current.map((ticket) =>
                        ticket.id === selectedTicket.id
                          ? { ...ticket, status: "Resolved" }
                          : ticket
                      )
                    );
                    setSelectedTicket({
                      ...selectedTicket,
                      status: "Resolved",
                    });
                    showNotification("Ticket resolved successfully.");
                  }}
                >
                  ✔️ Mark Resolved
                </button>
                <button
                  className="service-escalate-button"
                  onClick={handleEscalateTicket}
                >
                  🚨 Escalate to Engineer
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 5. ESCALATIONS SECTION */}
        {activeSection === "escalations" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">ENGINEER SUPPORT</p>
                <h1>Escalated Tickets</h1>
                <p>
                  Tickets assigned to engineers for advanced troubleshooting.
                </p>
              </div>
            </div>
            {renderTicketTable(escalatedTickets)}
          </section>
        )}

        {/* 6. REPORTS SECTION */}
        {activeSection === "reports" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">PERFORMANCE</p>
                <h1>Service Desk Reports</h1>
                <p>
                  Monitor ticket performance, workload and engineer statistics
                  in real time.
                </p>
              </div>
            </div>
            <section className="service-stats-grid">
              {stats.map((stat) => (
                <article key={stat.label} className="service-stat-card">
                  <div className="service-stat-top">
                    <span className="service-stat-icon">{stat.icon}</span>
                    <span className="service-live-dot">Live</span>
                  </div>
                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span className="service-stat-change">{stat.change}</span>
                </article>
              ))}
            </section>
          </section>
        )}
        {/* NEW TICKET MODAL */}
        {showNewTicket && (
          <div className="service-modal-overlay">
            <form className="service-modal" onSubmit={handleCreateTicket}>
              <div className="service-detail-header">
                <div>
                  <p className="service-section-label">CREATE REQUEST</p>
                  <h2>New Support Ticket</h2>
                </div>
                <button
                  type="button"
                  className="service-close-detail"
                  onClick={() => setShowNewTicket(false)}
                >
                  ×
                </button>
              </div>
              <label>
                Customer Name
                <input
                  type="text"
                  value={newTicket.customer}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, customer: e.target.value })
                  }
                  placeholder="Customer name"
                />
              </label>
              <label>
                Issue
                <textarea
                  rows="4"
                  value={newTicket.issue}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, issue: e.target.value })
                  }
                  placeholder="Describe the issue"
                />
              </label>
              <label>
                Category
                <select
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, category: e.target.value })
                  }
                >
                  <option>Internet</option>
                  <option>Billing</option>
                  <option>SIM Services</option>
                  <option>Mobile Data</option>
                </select>
              </label>
              <label>
                Priority
                <select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <button type="submit" className="service-new-ticket-button">
                Create Ticket
              </button>
            </form>
          </div>
        )}

        {/* ESCALATION MODAL */}
        {showEscalationModal && (
          <div className="service-modal-overlay">
            <div className="service-modal">
              <div className="service-detail-header">
                <div>
                  <p className="service-section-label">ESCALATION</p>
                  <h2>Escalate Ticket</h2>
                </div>
                <button
                  type="button"
                  className="service-close-detail"
                  onClick={() => setShowEscalationModal(false)}
                >
                  ×
                </button>
              </div>
              <label>
                Assign Engineer / Team
                <select
                  value={escalation.team}
                  onChange={(e) =>
                    setEscalation({ ...escalation, team: e.target.value })
                  }
                >
                  <option value="">Select Team</option>
                  <option>Network Engineer</option>
                  <option>Billing Team</option>
                  <option>SIM Support</option>
                  <option>Infrastructure Team</option>
                  <option>Senior Service Desk</option>
                </select>
              </label>
              <label>
                Escalation Reason
                <textarea
                  rows="5"
                  value={escalation.reason}
                  onChange={(e) =>
                    setEscalation({ ...escalation, reason: e.target.value })
                  }
                  placeholder="Describe why this ticket is being escalated..."
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEscalationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="service-escalate-button"
                  onClick={confirmEscalation}
                >
                  Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ServiceDeskPortal;
        