import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ServiceDeskPortal.css";

function ServiceDeskPortal() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("enuUser") || "{}"
  );

  const agentName =
    savedUser.username || "Service Desk Agent";

  const initialTickets = [
    {
      id: "INC-1048",
      customer: "Abel Tesfaye",
      issue: "Fiber internet disconnected",
      category: "Internet",
      priority: "High",
      status: "Open",
      time: "4 min ago",
    },
    {
      id: "INC-1047",
      customer: "Meron Bekele",
      issue: "SIM card not detected",
      category: "SIM Services",
      priority: "Medium",
      status: "In Progress",
      time: "12 min ago",
    },
    {
      id: "INC-1046",
      customer: "Daniel Worku",
      issue: "Incorrect monthly billing charge",
      category: "Billing",
      priority: "Medium",
      status: "Open",
      time: "18 min ago",
    },
    {
      id: "INC-1045",
      customer: "Sara Ahmed",
      issue: "Mobile data package not active",
      category: "Mobile Data",
      priority: "Low",
      status: "Resolved",
      time: "30 min ago",
    },
  ];

  const services = [
    {
      title: "Internet Troubleshooting",
      description:
        "Resolve mobile data, broadband and Wi-Fi connectivity problems.",
      icon: "🌐",
      section: "internet",
    },
    {
      title: "Billing Support",
      description:
        "Help customers with billing, payments and account information.",
      icon: "💳",
      section: "knowledge",
    },
    {
      title: "SIM Services",
      description:
        "Support SIM replacement, activation and registration requests.",
      icon: "📱",
      section: "knowledge",
    },
    {
      title: "Service Requests",
      description:
        "Track, update and manage customer support tickets.",
      icon: "🎫",
      section: "tickets",
    },
    {
      title: "Escalation",
      description:
        "Escalate unresolved incidents to Network Engineers.",
      icon: "🚨",
      section: "escalations",
    },
    {
      title: "Knowledge Base",
      description:
        "Search approved telecom procedures and support solutions.",
      icon: "📚",
      section: "knowledge",
    },
  ];

  const knowledgeArticles = [
    {
      id: 1,
      title: "Fiber Internet Disconnection",
      category: "Internet",
      keywords: "fiber internet disconnected broadband router",
      solution:
        "Check the optical network terminal lights, restart the router, verify cable connections, and confirm that there is no regional outage.",
    },
    {
      id: 2,
      title: "SIM Card Not Detected",
      category: "SIM Services",
      keywords: "sim card not detected registration activation",
      solution:
        "Restart the phone, remove and reinsert the SIM card, test it in another device, and verify SIM registration status.",
    },
    {
      id: 3,
      title: "Incorrect Billing Charge",
      category: "Billing",
      keywords: "incorrect monthly billing charge payment account",
      solution:
        "Verify the billing period, review package renewals and usage, confirm previous payments, and submit a billing adjustment when required.",
    },
    {
      id: 4,
      title: "Mobile Data Package Not Active",
      category: "Mobile Data",
      keywords: "mobile data package not active internet",
      solution:
        "Confirm the package purchase, check the account balance, restart mobile data, and verify the APN settings.",
    },
  ];

  const [tickets, setTickets] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeSection, setActiveSection] =
    useState("dashboard");
  const [notification, setNotification] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customer: "",
    issue: "",
    category: "Internet",
    priority: "Medium",
  });
  useEffect(() => {
  loadTickets();
}, []);

const loadTickets = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/tickets");

    const formattedTickets = response.data.map((ticket) => ({
      ...ticket,
      customer: ticket.employee,
      time: new Date(ticket.created_at).toLocaleString(),
    }));

    setTickets(formattedTickets);
  } catch (error) {
    console.error("Failed to load tickets:", error);
  }
};

  const stats = [
    {
      label: "Open Tickets",
      value: tickets.filter(
        (ticket) => ticket.status === "Open"
      ).length,
      change: "Current queue",
      icon: "🎫",
    },
    {
      label: "Resolved Today",
      value: tickets.filter(
        (ticket) => ticket.status === "Resolved"
      ).length,
      change: "Completed tickets",
      icon: "✅",
    },
    {
      label: "Escalated",
      value: tickets.filter(
        (ticket) => ticket.status === "Escalated"
      ).length,
      change: "Engineer review",
      icon: "🚨",
    },
    {
      label: "Total Tickets",
      value: tickets.length,
      change: "All service requests",
      icon: "📈",
    },
  ];

  const filteredTickets = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return tickets;
    }

    return tickets.filter((ticket) =>
      [
        ticket.id,
        ticket.customer,
        ticket.issue,
        ticket.category,
        ticket.priority,
        ticket.status,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [searchText, tickets]);

  const filteredKnowledge = useMemo(() => {
    const query = knowledgeSearch.trim().toLowerCase();

    if (!query) {
      return knowledgeArticles;
    }

    return knowledgeArticles.filter((article) =>
      [
        article.title,
        article.category,
        article.keywords,
        article.solution,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [knowledgeSearch]);

  const escalatedTickets = tickets.filter(
    (ticket) => ticket.status === "Escalated"
  );

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("enuUser");
    navigate("/");
  };

 const handleFindSolution = () => {
  if (!selectedTicket) {
    showNotification("Please select a ticket first.");
    return;
  }

  setKnowledgeSearch(selectedTicket.issue);
  setActiveSection("knowledge");

  showNotification(
    `Searching solution for ${selectedTicket.id}`
  );
};
   

  const handleEscalateTicket = () => {
    if (!selectedTicket) {
      showNotification("Please select a ticket first.");
      return;
    }

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? { ...ticket, status: "Escalated" }
          : ticket
      )
    );

    setSelectedTicket((currentTicket) => ({
      ...currentTicket,
      status: "Escalated",
    }));

    showNotification(
      `${selectedTicket.id} was escalated successfully.`
    );
  };

  const handleOpenModule = (service) => {
    setActiveSection(service.section);
if (service.title === "Billing Support") {
  setKnowledgeSearch("billing");
} else if (service.title === "SIM Services") {
  setKnowledgeSearch("sim");
} else if (service.title === "Knowledge Base") {
  setKnowledgeSearch("");
}

    showNotification(`${service.title} opened.`);
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    if (
      !newTicket.customer.trim() ||
      !newTicket.issue.trim()
    ) {
      showNotification(
        "Customer name and issue are required."
      );
      return;
    }

   try {
  const response = await axios.post("http://127.0.0.1:8000/tickets", {
    employee: newTicket.customer,
    issue: newTicket.issue,
    category: newTicket.category,
    priority: newTicket.priority,
  });

  loadTickets();

  setNewTicket({
    customer: "",
    issue: "",
    category: "Internet",
    priority: "Medium",
  });

  setShowNewTicket(false);
  setActiveSection("tickets");

  showNotification(`Ticket ${response.data.id} created successfully.`);
} catch (error) {
  console.error(error);
  showNotification("Failed to create ticket.");
}
};
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
                  className={`service-priority-badge ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
              </td>

              <td>
                <span
                  className={`service-status-badge ${ticket.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {ticket.status}
                </span>
              </td>

              <td>{ticket.time}</td>

              <td>
                <button
                  type="button"
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
        <div className="service-empty-state">
          No tickets found.
        </div>
      )}
    </div>
  );

  return (
    <div className="service-desk-page">
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
            type="button"
            className={`service-nav-item ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("dashboard")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            type="button"
            className={`service-nav-item ${
              activeSection === "tickets" ? "active" : ""
            }`}
            onClick={() => setActiveSection("tickets")}
          >
            <span>🎫</span>
            Ticket Queue
          </button>

          <button
            type="button"
            className={`service-nav-item ${
              activeSection === "knowledge"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("knowledge")
            }
          >
            <span>📚</span>
            Knowledge Base
          </button>

          <button
            type="button"
            className={`service-nav-item ${
              activeSection === "escalations"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("escalations")
            }
          >
            <span>🚨</span>
            Escalations
          </button>

          <button
            type="button"
            className={`service-nav-item ${
              activeSection === "reports" ? "active" : ""
            }`}
            onClick={() => setActiveSection("reports")}
          >
            <span>📊</span>
            Reports
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

          <button
            type="button"
            className="service-logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="service-main">
        {notification && (
          <div className="service-notification">
            {notification}
          </div>
        )}

        {activeSection === "dashboard" && (
          <>
            <header className="service-header">
              <div>
                <p className="service-eyebrow">
                  IT SERVICE DESK
                </p>

                <h1>Support Operations Dashboard</h1>

                <p className="service-subtitle">
                  Monitor customer incidents, search
                  support knowledge and manage telecom
                  service requests.
                </p>
              </div>

              <div className="service-header-actions">
                <Link
                  to="/"
                  className="service-home-link"
                >
                  ← Home
                </Link>

                <button
                  type="button"
                  className="service-new-ticket-button"
                  onClick={() => setShowNewTicket(true)}
                >
                  + New Ticket
                </button>
              </div>
            </header>

            <section className="service-stats-grid">
              {stats.map((stat) => (
                <article
                  className="service-stat-card"
                  key={stat.label}
                >
                  <div className="service-stat-top">
                    <span className="service-stat-icon">
                      {stat.icon}
                    </span>

                    <span className="service-live-dot">
                      Live
                    </span>
                  </div>

                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>

                  <span className="service-stat-change">
                    {stat.change}
                  </span>
                </article>
              ))}
            </section>

            <section className="service-content-grid">
              <div className="service-ticket-section">
                <div className="service-section-heading">
                  <div>
                    <p className="service-section-label">
                      CUSTOMER SUPPORT
                    </p>

                    <h2>Active Ticket Queue</h2>

                    <span>
                      Review, filter and open current
                      telecom incidents.
                    </span>
                  </div>

                  <div className="service-search-wrapper">
                    <span>🔎</span>

                    <input
                      type="text"
                      value={searchText}
                      onChange={(event) =>
                        setSearchText(event.target.value)
                      }
                      placeholder="Search tickets..."
                    />
                  </div>
                </div>

                {renderTicketTable(filteredTickets)}
              </div>

              <aside className="service-ticket-details">
                <div className="service-detail-header">
                  <div>
                    <p className="service-section-label">
                      TICKET DETAILS
                    </p>

                    <h2>
                      {selectedTicket
                        ? selectedTicket.id
                        : "Select a ticket"}
                    </h2>
                  </div>
                  {selectedTicket && (
                    <button
                      type="button"
                      className="service-close-detail"
                      onClick={() =>
                        setSelectedTicket(null)
                      }
                    >
                      ×
                    </button>
                  )}
                </div>

                {selectedTicket ? (
                  <div className="service-detail-content">
                    <div className="service-customer-profile">
                      <div className="service-customer-avatar">
                        {selectedTicket.customer
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {selectedTicket.customer}
                        </strong>

                        <span>
                          {selectedTicket.category} customer
                        </span>
                      </div>
                    </div>

                    <div className="service-detail-group">
                      <span>Reported issue</span>
                      <strong>
                        {selectedTicket.issue}
                      </strong>
                    </div>

                    <div className="service-detail-row">
                      <div>
                        <span>Priority</span>
                        <strong>
                          {selectedTicket.priority}
                        </strong>
                      </div>

                      <div>
                        <span>Status</span>
                        <strong>
                          {selectedTicket.status}
                        </strong>
                      </div>
                    </div>

                    <div className="service-detail-group">
                      <span>
                        Recommended first action
                      </span>

                      <p>
                        Verify the customer account and
                        service status, then follow the
                        approved troubleshooting guide.
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
                      className="service-escalate-button"
                      onClick={() => {
  if (!selectedTicket) {
    showNotification("Select a ticket first.");
    return;
  }

  setTickets((currentTickets) =>
    currentTickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, status: "Escalated" }
        : ticket
    )
  );

  setSelectedTicket({
    ...selectedTicket,
    status: "Escalated",
  });

  showNotification("Ticket sent to Network Engineer .");
}}
                    >
                      🚨 Escalate Ticket
                    </button>
                  </div>
                ) : (
                  <div className="service-detail-empty">
                    <div>🎫</div>
                    <h3>No ticket selected</h3>

                    <p>
                      Choose a ticket from the queue to view
                      details and available actions.
                    </p>
                  </div>
                )}
              </aside>
            </section>

            <section className="service-modules-section">
              <div className="service-section-heading">
                <div>
                  <p className="service-section-label">
                    SUPPORT TOOLS
                  </p>

                  <h2>Service Desk Modules</h2>

                  <span>
                    Access common telecom support workflows
                    and resources.
                  </span>
                </div>
              </div>

              <div className="service-modules-grid">
                {services.map((service) => (
                  <article
                    className="service-module-card"
                    key={service.title}
                  >
                    <div className="service-module-icon">
                      {service.icon}
                      </div>

                    <h3>{service.title}</h3>
                    <p>{service.description}</p>

                    <button
                      type="button"
                      className="service-module-button"
                      onClick={() =>
                        handleOpenModule(service)
                      }
                    >
                      Open Module →
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === "tickets" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">
                  SERVICE DESK
                </p>

                <h1>Ticket Queue</h1>

                <p>
                  Review and manage active customer support
                  tickets.
                </p>
              </div>

              <button
                type="button"
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
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search tickets..."
                />
              </div>
            </div>

            {renderTicketTable(filteredTickets)}
          </section>
        )}

        {activeSection === "knowledge" && (
          
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">
                  SUPPORT KNOWLEDGE
                </p>

                <h1>Knowledge Base</h1>

                <p>
                  Search approved telecom troubleshooting
                  procedures and solutions.
                </p>
              </div>
            </div>

            <div className="service-section-heading">
              <div className="service-search-wrapper">
                <span>🔎</span>

                <input
                  value={knowledgeSearch}
                  onChange={(event) =>
                    setKnowledgeSearch(event.target.value)
                  }
                  placeholder="Search knowledge solutions..."
                />
              </div>
            </div>

            <div className="service-modules-grid">
              {filteredKnowledge.map((article) => (
                <article
                  className="service-module-card"
                  key={article.id}
                >
                  <div className="service-module-icon">
                    📚
                  </div>

                  <h3>{article.title}</h3>
                  <p>{article.solution}</p>

                  <span className="service-status-badge open">
                    {article.category}
                  </span>
                </article>
              ))}
            </div>

            {filteredKnowledge.length === 0 && (
              <div className="service-empty-state">
                No matching knowledge solution found.
              </div>
            )}
          </section>
          )}
          {activeSection === "internet" && (
  <section className="service-section-page">
    <div className="service-section-page-header">
      <div>
        <p className="service-section-label">
          INTERNET SUPPORT
        </p>

        <h1>Internet Troubleshooting</h1>

        <p>
          Diagnose broadband, Wi-Fi and mobile internet issues.
        </p>
      </div>

      <button
        className="service-home-link"
        onClick={() => setActiveSection("dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>

    <div className="service-module-page">

      <div className="service-card">
        <h2>Customer Information</h2>

        <p><strong>Name:</strong> {selectedTicket?.customer || "No customer selected"}</p>
        <p><strong>Ticket:</strong> {selectedTicket?.id || "-"}</p>
        <p><strong>Issue:</strong> {selectedTicket?.issue || "-"}</p>
      </div>

      <div className="service-card">
        <h2>Quick Diagnostics</h2>

        <ul>
          <li>✔️ Verify SIM is active</li>
          <li>✔️ Check account balance</li>
          <li>✔️ Restart customer device</li>
          <li>✔️ Verify APN settings</li>
          <li>✔️ Check nearby network outage</li>
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

  setTickets((currentTickets) =>
    currentTickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, status: "Resolved" }
        : ticket
    )
  );

  setSelectedTicket({
    ...selectedTicket,
    status: "Resolved",
  });

  showNotification("Ticket marked as resolved.");
}}
        >
          ✔️ Mark Resolved
        </button>

        <button
    type="button"
    className="service-escalate-button"
    onClick={() => {
        alert("Escalate clicked");
        handleEscalateTicket();
    }}
>
    🚨 Escalate to Network Engineer
</button>
      </div>

    </div>
  </section>
)}
      
        

        {activeSection === "escalations" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">
                  ENGINEER SUPPORT
                </p>

                <h1>Escalations</h1>

                <p>
                  Review incidents transferred to network
                  engineers and senior support teams.
                </p>
              </div>
              </div>

            {renderTicketTable(escalatedTickets)}
          </section>
        )}

        {activeSection === "reports" && (
          <section className="service-section-page">
            <div className="service-section-page-header">
              <div>
                <p className="service-section-label">
                  PERFORMANCE
                </p>

                <h1>Service Desk Reports</h1>

                <p>
                  View current incident and service desk
                  performance statistics.
                </p>
              </div>
            </div>

            <div className="service-stats-grid">
              {stats.map((stat) => (
                <article
                  className="service-stat-card"
                  key={stat.label}
                >
                  <span className="service-stat-icon">
                    {stat.icon}
                  </span>

                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span>{stat.change}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {showNewTicket && (
          <div className="service-modal-overlay">
            <form
              className="service-modal"
              onSubmit={handleCreateTicket}
            >
              <div className="service-detail-header">
                <div>
                  <p className="service-section-label">
                    CREATE REQUEST
                  </p>

                  <h2>New Support Ticket</h2>
                </div>

                <button
                  type="button"
                  className="service-close-detail"
                  onClick={() =>
                    setShowNewTicket(false)
                  }
                >
                  ×
                </button>
              </div>

              <label>
                Customer name
                <input
                  value={newTicket.customer}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      customer: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Issue
                <textarea
                  value={newTicket.issue}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      issue: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Category
                <select
                  value={newTicket.category}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      category: event.target.value,
                    })
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
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      priority: event.target.value,
                    })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <button
                type="submit"
                className="service-new-ticket-button"
              >
                Create Ticket
              </button>
            </form>
          </div>
        )}

        <footer className="service-footer">
          <div>
            <strong>
              Enu Telecom Support Knowledge Assistant
            </strong>
            <span>
              Service Desk Operations Portal
            </span>
          </div>

          <p>
            Secure role-based access · System status: Online
          </p>
        </footer>
      </main>
    </div>
  );
}

export default ServiceDeskPortal;