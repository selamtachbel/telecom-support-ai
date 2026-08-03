import { Link } from "react-router-dom";
import { useState } from "react";

function EngineerPortal() {
  const [escalatedTickets, setEscalatedTickets] = useState([
  {
    id: "INC-1001",
    customer: "Abebe",
    issue: "Internet Down",
    priority: "High",
    status: "Escalated",
  },
  {
    id: "INC-1002",
    customer: "Hana",
    issue: "SIM Not Detected",
    priority: "Medium",
    status: "Escalated",
  },
]);

const [selectedTicket, setSelectedTicket] = useState(null);

const [engineerName, setEngineerName] = useState("");

const [investigationNotes, setInvestigationNotes] = useState("");

const [rootCause, setRootCause] = useState("");

const [resolution, setResolution] = useState("");
const [assignedEngineer, setAssignedEngineer] = useState("");
const [resolvedTickets, setResolvedTickets] = useState([]);
  const tools = [
    {
      title: "Network Diagnostics",
      icon: "📡",
      description:
        "Diagnose network failures, connectivity problems and equipment issues.",
    },
    {
      title: "Alarm Monitoring",
      icon: "🚨",
      description:
        "Review network alarms, identify faults and investigate incidents.",
    },
    {
      title: "Transmission Network",
      icon: "🔗",
      description:
        "Support transmission links, fiber connections and backbone networks.",
    },
    {
      title: "Core Network",
      icon: "🖥️",
      description:
        "Access technical documentation for core network infrastructure.",
    },
    {
      title: "Radio Access Network",
      icon: "📶",
      description:
        "Troubleshoot BTS, 4G, 5G and radio access network issues.",
    },
    {
      title: "Engineering Knowledge",
      icon: "📚",
      description:
        "Search engineering manuals, SOPs and technical documentation.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#061221",
        color: "white",
        padding: "40px",
        fontFamily: "Segoe UI",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            🛠 Network Engineer Portal
          </h1>

          <p style={{ color: "#cbd5e1" }}>
            Enu Telecom Support Knowledge Assistant
          </p>
        </div>

        <Link
          to="/"
          style={{
            background: "#7c3aed",
            color: "white",
            textDecoration: "none",
            padding: "12px 22px",
            borderRadius: "10px",
          }}
        >
          ← Home
        </Link>
      </div>
      {/* Escalated Tickets */}

<div
  style={{
    background: "#10284b",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "30px",
  }}
>
  <h2>🚨 Escalated Tickets</h2>

  {escalatedTickets.length === 0 ? (
    <p>No escalated tickets.</p>
  ) : (
    escalatedTickets.map((ticket) => (
      <div
        key={ticket.id}
        style={{
          background: "#1e293b",
          marginTop: "15px",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h3>{ticket.id}</h3>

        <p>
          <strong>Customer:</strong> {ticket.customer}
        </p>

        <p>
          <strong>Issue:</strong> {ticket.issue}
        </p>

        <p>
          <strong>Priority:</strong> {ticket.priority}
        </p>

        <p>
          <strong>Status:</strong> {ticket.status}
        </p>

        <button
          style={{
            background: "#7c3aed",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={() => setSelectedTicket(ticket)}
        >
          Open Ticket
        </button>
      </div>
    ))
  )}
</div>
{selectedTicket && (
  <div
    style={{
      background: "#10284b",
      marginTop: "30px",
      padding: "25px",
      borderRadius: "18px",
    }}
  >
    <h2>🛠 Ticket Details</h2>

    <p><strong>Ticket:</strong> {selectedTicket.id}</p>
    <p><strong>Customer:</strong> {selectedTicket.customer}</p>
    <p><strong>Issue:</strong> {selectedTicket.issue}</p>
    <p><strong>Priority:</strong> {selectedTicket.priority}</p>
    <p><strong>Status:</strong> {selectedTicket.status}</p>

    <br />

    <label>Assigned Engineer</label>

    <input
      value={assignedEngineer}
      onChange={(e) => setAssignedEngineer(e.target.value)}
      placeholder="Engineer name"
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
      }}
    />

    <label>Investigation Notes</label>

    <textarea
      value={investigationNotes}
      onChange={(e) => setInvestigationNotes(e.target.value)}
      rows={4}
      style={{
        width: "100%",
        marginBottom: "15px",
      }}
    />

    <label>Root Cause</label>

    <textarea
      value={rootCause}
      onChange={(e) => setRootCause(e.target.value)}
      rows={3}
      style={{
        width: "100%",
        marginBottom: "15px",
      }}
    />

    <label>Resolution</label>

    <textarea
      value={resolution}
      onChange={(e) => setResolution(e.target.value)}
      rows={3}
      style={{
        width: "100%",
        marginBottom: "20px",
      }}
    />

    <button
      onClick={() => {
        const updated = {
          ...selectedTicket,
          status: "Resolved",
          assignedEngineer,
          investigationNotes,
          rootCause,
          resolution,
        };

        setResolvedTickets([...resolvedTickets, updated]);

        setEscalatedTickets(
          escalatedTickets.filter(
            (ticket) => ticket.id !== selectedTicket.id
          )
        );

        setSelectedTicket(null);

        alert("Ticket marked as resolved.");
      }}
      style={{
        background: "green",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        marginRight: "15px",
        cursor: "pointer",
      }}
    >
      ✔️ Mark Fixed
    </button>

    <button
      onClick={() => setSelectedTicket(null)}
      style={{
        background: "#7c3aed",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      Close
    </button>
  </div>
)}

      {/* Hero */}

      <div
        style={{
          background: "#10284b",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "40px",
        }}
      >
        <h2>Engineering Knowledge Search</h2>

        <p style={{ color: "#cbd5e1" }}>
          Search technical procedures, alarms, transmission guides,
          engineering manuals and troubleshooting documents.
        </p>

        <input
          type="text"
          placeholder="Search engineering knowledge..."
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        {tools.map((tool) => (
          <div
            key={tool.title}
            style={{
              background: "#10284b",
              borderRadius: "18px",
              padding: "25px",
            }}
          >
            <div style={{ fontSize: "45px" }}>
              {tool.icon}
            </div>

            <h3>{tool.title}</h3>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: "1.6",
              }}
            >
              {tool.description}
            </p>

            <button
              style={{
                marginTop: "18px",
                background: "#7c3aed",
                color: "white",
                border: "none",
                padding: "12px 18px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Open Module
            </button>
          </div>
        ))}
      </div>
      {/* ================= Resolved Tickets ================= */}

<div
  style={{
    background: "#10284b",
    padding: "25px",
    borderRadius: "20px",
    marginTop: "40px",
  }}
>
  <h2>✅ Resolved Tickets</h2>

  {resolvedTickets.length === 0 ? (
    <p>No resolved tickets.</p>
  ) : (
    resolvedTickets.map((ticket) => (
      <div
        key={ticket.id}
        style={{
          background: "#1e293b",
          marginTop: "15px",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h3>{ticket.id}</h3>

        <p><strong>Customer:</strong> {ticket.customer}</p>

        <p><strong>Issue:</strong> {ticket.issue}</p>

        <p><strong>Engineer:</strong> {ticket.assignedEngineer}</p>

        <p><strong>Root Cause:</strong> {ticket.rootCause}</p>

        <p><strong>Resolution:</strong> {ticket.resolution}</p>

        <p>
          <strong>Status:</strong>
          <span style={{ color: "#22c55e" }}>
            {" "}Resolved
          </span>
        </p>
      </div>
    ))
  )}
</div>

      {/* Footer */}

      <div
        style={{
          marginTop: "50px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
        }}
      ><strong>Next Development Phase</strong>

        <p>
          This page will connect to your FastAPI backend to provide
          AI-powered engineering support, document search, network
          troubleshooting, incident guidance and technical knowledge retrieval.
        </p>
      </div>
    </div>
  );
}

export default EngineerPortal;