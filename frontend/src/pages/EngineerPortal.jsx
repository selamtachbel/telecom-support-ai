import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EngineerPortal.css";
import { API_BASE_URL } from "../apiConfig";

function EngineerPortal() {
  const navigate = useNavigate();

  /* =========================================
      CURRENT USER
  ========================================= */
  const savedUser = JSON.parse(
    localStorage.getItem("enuUser") || "{}"
  );
  const engineerName = savedUser.username || "engineer";

  /* =========================================
      STATES
  ========================================= */
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notification, setNotification] = useState("");
  const [searchText, setSearchText] = useState("");
  const [kbSearch, setKbSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [allTickets, setAllTickets] = useState([]);

  /* =========================================
      KNOWLEDGE BASE ARTICLES
  ========================================= */
  const kbArticles = [
    {
      id: "KB-101",
      title: "Fiber Optic Outage Resolution Workflow",
      category: "Fiber Operations",
      content: "Check OTDR trace results at the main splice point. If attenuation exceeds 0.5dB/km, inspect local splitter boxes for bend radii under 30mm.",
    },
    {
      id: "KB-102",
      title: "Base Station High Latency & Packet Loss",
      category: "Cellular / BTS",
      content: "Restart the BTS site controller remotely via CLI. If issue persists, check microwave backhaul link alignment and clear optical path obstacles.",
    },
    {
      id: "KB-103",
      title: "Core Network SIM Authentication Failures",
      category: "Core Network",
      content: "Verify HLR/HSS sync status. Check if subscriber IMSI is blocked or throttled due to provisioning sync gaps.",
    },
    {
      id: "KB-104",
      title: "Broadband Router WAN IP Configuration Issue",
      category: "Broadband",
      content: "Ensure DHCP lease pools on the gateway node are not exhausted. Force lease release or reassign static IP pool.",
    },
  ];

  /* =========================================
      LOAD ESCALATED TICKETS
  ========================================= */
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets`);
      const formattedTickets = response.data.map((ticket) => ({
  ...ticket,
  customer:
    ticket.customer_name ||
    ticket.customer ||
    "Unknown Customer",
  time: ticket.created_at
    ? new Date(ticket.created_at).toLocaleString()
    : "N/A",
}));

// Keep ALL tickets for reports
setAllTickets(formattedTickets);

// Only active escalations appear in Engineer queue
const activeTickets = formattedTickets.filter(
  (ticket) =>
    ticket.status === "Escalated" ||
    ticket.status === "In Progress"
);

setTickets(activeTickets);
       
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      showNotification("Failed to load tickets from backend.");
    }
    setLoading(false);
  };

  /* =========================================
      NOTIFICATION
  ========================================= */
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  /* =========================================
      LOGOUT
  ========================================= */
  const handleLogout = () => {
    localStorage.removeItem("enuUser");
    navigate("/");
  };

  /* =========================================
      UPDATE TICKET STATUS IN BACKEND
  ========================================= */
  const handleUpdateStatus = async (ticketId, newStatus, successMsg) => {
    try {
      await axios.patch(`${API_BASE_URL}/tickets/${ticketId}`, {
        status: newStatus,
});
      await loadTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        if (newStatus === "Resolved" || newStatus === "Open") {
          setSelectedTicket(null);
        } else {
          setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
        }
      }
      showNotification(successMsg);
    } catch (error) {
      console.error("Error updating ticket:", error);
      showNotification("Failed to update ticket status on backend.");
    }
  };

  /* =========================================
      DASHBOARD STATS
  ========================================= */
  const stats = [
    {
      label: "Open Escalations",
      value: tickets.length,
      sub: "Current Queue",
      icon: "🚨",
    },
    {
      label: "Critical",
      value: tickets.filter(
        (ticket) => ticket.priority?.toLowerCase() === "high"
      ).length,
      sub: "High Priority",
      icon: "🔥",
    },
    {
      label: "In Progress",
      value: tickets.filter(
        (ticket) => ticket.status === "In Progress"
      ).length,
      sub: "Under Investigation",
      icon: "🔍",
    },
    {
      label: "Engineer",
      value: engineerName,
      sub: "Active Session",
      icon: "👷",
    },
  ];
  const formattedTickets = response.data.map((ticket) => ({
  ...ticket,
  customer:
    ticket.customer_name ||
    ticket.customer ||
    "Unknown Customer",
  time: ticket.created_at
    ? new Date(ticket.created_at).toLocaleString()
    : "N/A",
}));

// Keep ALL tickets for reports
setAllTickets(formattedTickets);

// Only active escalations appear in Engineer queue
const activeTickets = formattedTickets.filter(
  (ticket) =>
    ticket.status === "Escalated" ||
    ticket.status === "In Progress"
);

setTickets(activeTickets);

  /* =========================================
      SEARCH
  ========================================= */
  const filteredTickets = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return tickets;
    return tickets.filter(
      (ticket) =>
        ticket.id?.toString().toLowerCase().includes(query) ||
        ticket.customer?.toLowerCase().includes(query) ||
        ticket.issue?.toLowerCase().includes(query) ||
        ticket.category?.toLowerCase().includes(query)
    );
  }, [tickets, searchText]);

  const filteredKb = useMemo(() => {
    const query = kbSearch.trim().toLowerCase();
    if (!query) return kbArticles;
    return kbArticles.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query) ||
        art.content.toLowerCase().includes(query)
    );
  }, [kbSearch]);

  /* =========================================
      SIDEBAR MENU
  ========================================= */
  const menuItems = [
    {
      title: "Dashboard",
      icon: "🏠",
      section: "dashboard",
    },
    {
      title: "Ticket Queue",
      icon: "🚨",
      section: "tickets",
    },
    {
      title: "Knowledge Base",
      icon: "📚",
      section: "knowledge",
    },
    {
      title: "Diagnostics",
      icon: "🌐",
      section: "diagnostics",
    },
    {
      title: "Reports",
      icon: "📊",
      section: "reports",
    },
  ];

  /* =========================================
      TICKET TABLE
  ========================================= */
  const renderTicketTable = (ticketList) => (
    <div className="engineer-table-wrapper">
      <table className="engineer-ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Customer</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
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
              <td>{ticket.issue}</td>
              <td>
                <span
                  className={`priority-badge priority-${ticket.priority?.toLowerCase() || "low"}`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${ticket.status?.replace(/\s+/g, '-').toLowerCase()}`}>
                  {ticket.status}
                </span>
              </td>
              <td>
                <button
                  className="engineer-open-button"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    if (activeSection !== "dashboard") {
                      setActiveSection("dashboard");
                    }
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
        <div className="engineer-empty">No escalated tickets found.</div>
      )}
    </div>
  );

  /* =========================================
      MAIN JSX RENDER
  ========================================= */
  return (
    <div className="engineer-page">
      {/* SIDEBAR */}
      <aside className="engineer-sidebar">
        <div className="engineer-brand">
          <div className="engineer-brand-icon">🎧</div>
          <div>
            <strong>Enu Telecom</strong>
            <span>Engineer Operations</span>
          </div>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.title}
              className={`engineer-nav-item ${
                activeSection === item.section ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.section)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>
        <div className="engineer-profile">
          <div className="engineer-avatar">
            {engineerName.charAt(0).toLowerCase()}
          </div>
          <div>
            <strong>{engineerName}</strong>
            <span>Network Engineer</span>
          </div>
        </div>
        <button className="engineer-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      {/* MAIN CONTENT AREA */}
      <main className="engineer-main">
        {notification && (
          <div className="engineer-notification">{notification}</div>
        )}

        {/* TOP HEADER BAR */}
        <header className="engineer-header">
          <div>
            <span className="sub-heading">ENGINEER OPERATIONS</span>
            <h1>
              {activeSection === "dashboard" && "Engineering Operations Dashboard"}
              {activeSection === "tickets" && "Escalated Ticket Queue"}
              {activeSection === "knowledge" && "Engineering Knowledge Base"}
              {activeSection === "diagnostics" && "Network Diagnostics"}
              {activeSection === "reports" && "Performance & Workload Reports"}
            </h1>
            <p>
              Monitor escalated telecom incidents, search technical knowledge, run network diagnostics, and resolve tickets.
            </p>
          </div>
          <div className="header-actions">
            <Link to="/" className="engineer-home-btn">
              ← Home
            </Link>
          </div>
        </header>

        {/* 1. DASHBOARD SECTION */}
        {activeSection === "dashboard" && (
          <>
            <section className="engineer-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="engineer-stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="live-tag">• Live</span>
                  </div>
                  <p className="stat-label">{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span className="stat-sub">{stat.sub}</span>
                </div>
              ))}
            </section>

            <section className="engineer-content-grid">
              <div className="engineer-ticket-section">
                <div className="section-title-bar">
                  <div>
                    <span className="sub-heading">NETWORK ESCALATIONS</span>
                    <h2>Escalated Incidents</h2>
                    <p>Review and resolve escalated network tickets.</p>
                  </div>
                  <div className="engineer-search">
                    <input
                      type="text"
                      placeholder="🔍 Search tickets..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>
                {loading ? (
                  <p className="loading-text">Loading tickets...</p>
                ) : (
                  renderTicketTable(filteredTickets)
                )}
              </div>

              {/* TICKET DETAILS PANEL */}
              <aside className="engineer-ticket-details">
                <div className="engineer-detail-header">
                  <span className="sub-heading">TICKET DETAILS</span>
                  <h2>
                    {selectedTicket
                      ? 'Ticket #${selectedTicket.id}'
                      : "Select a Ticket"}
                  </h2>
                </div>
                {selectedTicket ? (
                  <>
                    <div className="engineer-detail-card">
                      <h3>Customer</h3>
                      <p>{selectedTicket.customer}</p>
                    </div>
                    <div className="engineer-detail-card">
                      <h3>Issue Description</h3>
                      <p>{selectedTicket.issue}</p>
                    </div>
                    <div className="engineer-detail-card">
                      <h3>Category</h3>
                      <p>{selectedTicket.category || "Network Operations"}</p>
                    </div>
                    <div className="engineer-detail-card">
                      <h3>Priority</h3>
                      <span className={`priority-badge priority-${selectedTicket.priority?.toLowerCase() || "low"}`}>
                        {selectedTicket.priority}
                        </span>
                    </div>
                    <div className="engineer-detail-card">
                      <h3>Status</h3>
                      <span className="status-badge status-open">{selectedTicket.status}</span>
                    </div>
                    <div className="engineer-action-buttons">
                      <button
                        className="engineer-primary-btn"
                        onClick={() =>
                          handleUpdateStatus(
                            selectedTicket.id,
                            "In Progress",
                            "Investigation started."
                          )
                        }
                      >
                        🔍 Start Investigation
                      </button>
                      <button
                        className="engineer-primary-btn"
                        onClick={() =>
                          showNotification("Running network diagnostics...")
                        }
                      >
                        🌐 Run Diagnostics
                      </button>
                      <button
                        className="engineer-success-btn"
                        onClick={() =>
                          handleUpdateStatus(
                            selectedTicket.id,
                            "Resolved",
                            "Ticket resolved successfully."
                          )
                        }
                      >
                        ✅ Resolve Ticket
                      </button>
                      <button
                        className="engineer-warning-btn"
                        onClick={() =>
                          handleUpdateStatus(
                            selectedTicket.id,
                            "Open",
                            "Returned to Service Desk."
                          )
                        }
                      >
                        ↩️ Return to Service Desk
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="engineer-empty-details">
                    <div className="empty-icon">🎟️</div>
                    <h3>No Ticket Selected</h3>
                    <p>
                      Select a ticket from the queue to view details and take action.
                    </p>
                  </div>
                )}
              </aside>
            </section>
          </>
        )}

        {/* 2. TICKET QUEUE SECTION */}
        {activeSection === "tickets" && (
          <section className="engineer-section-page">
            <div className="engineer-ticket-section">
              <div className="section-title-bar">
                <div className="engineer-search" style={{ width: "100%" }}>
                  <input
                    type="text"
                    placeholder="🔍 Search all escalated tickets..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              {renderTicketTable(filteredTickets)}
            </div>
          </section>
        )}

        {/* 3. KNOWLEDGE BASE SECTION */}
        {activeSection === "knowledge" && (
          <section className="engineer-section-page">
            <div className="engineer-ticket-section" style={{ marginBottom: "20px" }}>
              <input
                type="text"
                className="engineer-search-input"
                placeholder="🔍 Search engineering knowledge base articles..."
                value={kbSearch}
                onChange={(e) => setKbSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  }}
              />
            </div>
            <div className="engineer-card-grid">
              {filteredKb.map((art) => (
                <div key={art.id} className="engineer-card">
                  <span className="kb-badge">{art.category}</span>
                  <h3>{art.title}</h3>
                  <p>{art.content}</p>
                  <span className="kb-id">{art.id}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. DIAGNOSTICS PAGE */}
        {activeSection === "diagnostics" && (
          <section className="engineer-section-page">
            <div className="engineer-card-grid">
              <div className="engineer-card">
                <h3>🌐 Network Status</h3>
                <p className="status-good">Operational</p>
              </div>
              <div className="engineer-card">
                <h3>📡 Fiber Network</h3>
                <p className="status-good">No Fiber Outage Detected</p>
              </div>
              <div className="engineer-card">
                <h3>📱 SIM Registration</h3>
                <p className="status-good">SIM Successfully Registered</p>
              </div>
              <div className="engineer-card">
                <h3>📶 Signal Strength</h3>
                <p className="status-good">Excellent (98%)</p>
              </div>
              <div className="engineer-card">
                <h3>📍 Base Station</h3>
                <p>Addis Ababa BTS-104</p>
              </div>
              <div className="engineer-card">
                <h3>💻 Core Network</h3>
                <p className="status-good">Healthy</p>
              </div>
            </div>
          </section>
        )}

        {/* 5. REPORTS PAGE */}
        {activeSection === "reports" && (
          <section className="engineer-section-page">
            <div className="engineer-stats">
              {reportStats.map((stat) => (
                <div key={stat.label} className="engineer-stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="live-tag">• Live</span>
                  </div>
                  <p className="stat-label">{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span className="stat-sub">{stat.sub}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="engineer-footer">
          <div>
            <strong>Enu Telecom Support Knowledge Assistant</strong>
            <span>Engineer Operations Portal</span>
          </div>
          <p>Role Based Access • Secure Connection • Online</p>
        </footer>
      </main>
    </div>
  );
}

export default EngineerPortal;