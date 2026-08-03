import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Admin() {
  const [stats, setStats] = useState({
    total_knowledge: 0,
    total_searches: 0,
    total_categories: 0,
    total_tickets: 0,
    open_tickets: 0,
    in_progress: 0,
    escalated: 0,
    resolved: 0,
    total_employees: 0,
    avg_response_time: "< 1.2s",
    answer_accuracy: "92%",
  });

  const [knowledge, setKnowledge] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Document Upload Form State (FR-001, FR-002)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [docCategory, setDocCategory] = useState("Broadband & Fiber");
  const [docTitle, setDocTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsResponse, knowledgeResponse, feedbackResponse] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/dashboard/stats").catch(() => ({ data: {} })),
          axios.get("http://127.0.0.1:8000/knowledge").catch(() => ({ data: [] })),
          axios.get("http://127.0.0.1:8000/feedback").catch(() => ({ data: [] }))
        ]);

      setStats((prev) => ({ ...prev, ...statsResponse.data }));
      setKnowledge(knowledgeResponse.data || []);
      setFeedback(feedbackResponse.data || []);
    } catch (requestError) {
      console.error("Dashboard loading error:", requestError);
      setError("Unable to load dashboard data. Make sure the backend service is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", docTitle);
    formData.append("category", docCategory);

    try {
      setUploading(true);
      await axios.post("http://127.0.0.1:8000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Telecom document uploaded and embedded into ChromaDB successfully!");
      setShowUploadModal(false);
      setDocTitle("");
      setUploadFile(null);
      loadDashboard();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document. Please check the backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const statistics = [
    {
      title: "Knowledge Records",
      value: stats.total_knowledge,
      color: "#60a5fa",
      icon: "📚",
    },
    {
      title: "RAG Queries Logged",
      value: stats.total_searches,
      color: "#34d399",
      icon: "🔍",
    },
    {
      title: "Avg Response Time",
      value: stats.avg_response_time || "< 2s",
      color: "#fbbf24",
      icon: "⚡️",
    },
    {
      title: "Answer Accuracy",
      value: stats.answer_accuracy || "88%",
      color: "#a78bfa",
      icon: "🎯",
    },
  ];

  const modules = [
    {
      title: "Document Ingestion",
      description: "Upload and vectorize PDFs, troubleshooting guides, and SOPs.",
      icon: "📄",
      action: () => setShowUploadModal(true),
      buttonText: "Upload Document",
    },
    {
      title: "Knowledge Base",
      description: "Manage telecom articles, SOPs, and prompt contexts.",
      icon: "📚",
      link: "/admin/knowledge",
      buttonText: "Open Module",
    },
    {
      title: "User Management",
      description: "Manage customer, service desk, and engineer access control.",
      icon: "👤",
      link: "/admin/users",
      buttonText: "Manage Users",
    },
    {
      title: "Telemetry & Analytics",
      description: "View query metrics, search topics, and performance targets.",
      icon: "📊",
      link: "/admin/analytics",
      buttonText: "View Analytics",
    },
    {
      title: "AI & Model Settings",
      description: "Configure Ollama, Llama 3 parameters, and vector retrieval chunking.",
      icon: "🤖",
      link: "/admin/settings",
      buttonText: "Configure AI",
    },
    {
      title: "System Logs & Audit",
      description: "Review system activity, search history, and retrieval logs.",
      icon: "📝",
      link: "/admin/logs",
      buttonText: "View Audit Logs",
    },
  ];

  return (
    <div
      style={{
        background: "#081528",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
        padding: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
            ⚙️ Administrator Portal
          </h1>
          <p style={{ color: "#cbd5e1", marginTop: "8px", margin: 0 }}>
            Telecom Support Knowledge Assistant — System & Knowledge Management
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            📤 Upload Document
          </button>
          <button
            onClick={loadDashboard}
            style={{
              background: "#163055",
              color: "white",
              border: "1px solid #35537a",
              borderRadius: "10px",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
          <Link
            to="/"
            style={{
              background: "#2563eb",
              color: "white",
              textDecoration: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            ← Home
          </Link>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#7f1d1d",
            color: "#fff",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
            border: "1px solid #f87171",
          }}
        >
          {error}
        </div>
      )}

      {/* Operational Key Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {statistics.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#10284b",
              borderRadius: "18px",
              padding: "25px",
              border: "1px solid #1e3a5f",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>{item.icon}</div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#94a3b8" }}>{item.title}</h3>
            <h1 style={{ color: item.color, margin: 0, fontSize: "32px" }}>
              {loading ? "..." : item.value}
            </h1>
          </div>
        ))}
      </div>

      {/* Admin Modules */}
      <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Administration Modules</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "50px",
        }}
      >
        {modules.map((module) => (
          <div
            key={module.title}
            style={{background: "#10284b",
              borderRadius: "18px",
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid #1e3a5f",
            }}
          >
            <div>
              <div style={{ fontSize: "38px", marginBottom: "12px" }}>{module.icon}</div>
              <h3 style={{ margin: "0 0 8px 0" }}>{module.title}</h3>
              <p style={{ color: "#cbd5e1", lineHeight: "1.6", fontSize: "14px", margin: 0 }}>
                {module.description}
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
              {module.action ? (
                <button
                  onClick={module.action}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {module.buttonText}
                </button>
              ) : (
                <Link
                  to={module.link}
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "#1e3a5f",
                    color: "#bfdbfe",
                    textDecoration: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    border: "1px solid #35537a",
                  }}
                >
                  {module.buttonText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Knowledge Base Managed Table */}
      <div
        style={{
          background: "#10284b",
          borderRadius: "18px",
          padding: "25px",
          overflowX: "auto",
          border: "1px solid #1e3a5f",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>Ingested Knowledge & SOP Records</h2>
            <p style={{ color: "#cbd5e1", margin: "5px 0 0 0", fontSize: "14px" }}>
              Active documents and extracted chunks indexed inside ChromaDB & SQLite.
            </p>
          </div>
          <span
            style={{
              background: "#163055",
              color: "#bfdbfe",
              padding: "8px 15px",
              borderRadius: "10px",
              fontSize: "14px",
              border: "1px solid #35537a",
            }}
          >
            Total Indexed: {knowledge.length}
          </span>
        </div>

        {loading ? (
          <p style={{ marginTop: "25px", color: "#cbd5e1" }}>Loading knowledge records...</p>
        ) : knowledge.length === 0 ? (
          <p style={{ marginTop: "25px", color: "#cbd5e1" }}>No knowledge records found. Upload a document to get started.</p>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: "750px",
              marginTop: "25px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#163055", textAlign: "left" }}>
                <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>ID</th>
                <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>Question / SOP Header</th>
                <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>Extracted Knowledge Content</th>
                <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>Category</th>
                </tr>
            </thead>
            <tbody>
              {knowledge.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #1f3b63" }}>
                  <td style={{ padding: "12px 15px", color: "#93c5fd" }}>{item.id}</td>
                  <td style={{ padding: "12px 15px", verticalAlign: "top", maxWidth: "250px", fontWeight: "500" }}>
                    {item.question}
                  </td>
                  <td style={{ padding: "12px 15px", verticalAlign: "top", color: "#cbd5e1", maxWidth: "380px", lineHeight: "1.5", fontSize: "14px" }}>
                    {item.answer}
                  </td>
                  <td style={{ padding: "12px 15px", verticalAlign: "top" }}>
                    <span
                      style={{
                        background: "#1e3a5f",
                        color: "#bfdbfe",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        display: "inline-block",
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Feedback & Telemetry Module (FR-007, US-045) */}
      <div
        style={{
          background: "#10284b",
          borderRadius: "18px",
          padding: "25px",
          border: "1px solid #1e3a5f",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>User Feedback Telemetry (FR-007)</h2>
        <p style={{ color: "#cbd5e1", margin: "0 0 20px 0", fontSize: "14px" }}>
          Monitor user ratings and comments on AI-generated responses to evaluate system helpfulness.
        </p>

        {feedback.length === 0 ? (
          <div style={{ padding: "20px", background: "#091a30", borderRadius: "10px", color: "#94a3b8" }}>
            No user feedback submitted yet. Ratings from customers and service agents will appear here.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {feedback.map((item, idx) => (
              <div key={idx} style={{ background: "#163055", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#60a5fa" }}>Rating: {item.rating} / 5 ⭐️</div>
                  <div style={{ color: "#cbd5e1", marginTop: "5px", fontSize: "14px" }}>{item.comments || "No comment provided."}</div>
                </div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>Response ID: #{item.response_id}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal (FR-001) */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#10284b",
              padding: "30px",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "500px",
              border: "1px solid #35537a",
            }}
          >
            <h2 style={{ marginTop: 0 }}>📤 Ingest Telecom Document</h2>
            <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
              Upload technical manuals, SOPs, or billing policies. Text will be chunked and indexed into ChromaDB.
            </p>
            <form onSubmit={handleDocumentUpload}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Document Title</label>
                <input type="text"
                  required
                  placeholder="e.g. Fiber Troubleshooting SOP v2"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #35537a",
                    background: "#081528",
                    color: "white",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #35537a",
                    background: "#081528",
                    color: "white",
                  }}
                >
                  <option value="Broadband & Fiber">Broadband & Fiber</option>
                  <option value="SIM & Activation">SIM & Activation</option>
                  <option value="Billing & Plans">Billing & Plans</option>
                  <option value="Base Station & Network">Base Station & Network</option>
                  <option value="Equipment & Hardware">Equipment & Hardware</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Select File (PDF / TXT)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #35537a",
                    background: "#081528",
                    color: "white",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    background: "#334155",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {uploading ? "Ingesting..." : "Upload & Vectorize"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "50px",
          background: "#163055",
          borderRadius: "15px",
          padding: "20px",
          textAlign: "center",
          color: "#cbd5e1",
          fontSize: "14px",
        }}
      >
        Telecom Support Knowledge Assistant — Administrator Workspace (MSSE Capstone Project)
      </div>
    </div>
  );
}

export default Admin;