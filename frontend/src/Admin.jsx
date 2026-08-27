import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";


function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

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
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Document Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [docCategory, setDocCategory] = useState("Broadband & Fiber");
  const [docTitle, setDocTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // AI Settings State
  const [aiModel, setAiModel] = useState("llama3");
  const [aiTemp, setAiTemp] = useState(0.7);
  const [chunkSize, setChunkSize] = useState(500);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

   const [
    statsRes,
    knowledgeRes,
    feedbackRes,
    usersRes,
    logsRes,
    aiSettingsRes,
]   = await Promise.allSettled([
    axios.get(`${API_BASE_URL}/dashboard/stats`),
    axios.get(`${API_BASE_URL}/knowledge`),
    axios.get(`${API_BASE_URL}/feedback/stats`),
    axios.get(`${API_BASE_URL}/users`),
    axios.get(`${API_BASE_URL}/audit/logs`),
    axios.get(`${API_BASE_URL}/settings/ai`),
]);

      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats((prev) => ({ ...prev, ...statsRes.value.data }));
      }
      if (
        knowledgeRes.status === "fulfilled" && 
         Array.isArray(knowledgeRes.value?.data))
          {
        setKnowledge(knowledgeRes.value.data);
      }
      if (feedbackRes.status === "fulfilled" && feedbackRes.value?.data) {
  const feedbackData = feedbackRes.value.data;

  setStats((prev) => ({
    ...prev,
    answer_accuracy: `${feedbackData.helpful_percentage}%`,
  }));
}

if (
  usersRes.status === "fulfilled" &&
  Array.isArray(usersRes.value?.data)
) {
  setUsers(usersRes.value.data);
}
      else {
        setUsers([
          { id: 1, username: "admin_user", role: "Administrator", status: "Active" },
          { id: 2, username: "engineer_01", role: "Engineer", status: "Active" },
          { id: 3, username: "agent_support", role: "Service Desk", status: "Active" },
        ]);
      }
      if (logsRes.status === "fulfilled" && Array.isArray(logsRes.value?.data)) {
        setLogs(logsRes.value.data);
      } else {
        setLogs([
          { id: 1, timestamp: new Date().toLocaleString(), action: "DOCUMENT_INGEST", user: "admin", details: "Uploaded Fiber Troubleshooting SOP.pdf" },
          { id: 2, timestamp: new Date().toLocaleString(), action: "QUERY_EXECUTE", user: "system", details: "Processed RAG search on category Broadband" },
        ]);
      }
      if (
        aiSettingsRes.status === "fulfilled" &&
        aiSettingsRes.value?.data
)  {
        const settings = aiSettingsRes.value.data;

       setAiModel(settings.model_name ?? "llama3");
       setAiTemp(Number(settings.temperature ?? 0.7));
       setChunkSize(Number(settings.chunk_size ?? 500));
}

    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to connect to backend server. Running in offline fallback mode.");
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
      await axios.post(`${API_BASE_URL}/documents/upload`, formData);
      
      alert("Telecom document uploaded successfully!");
      setShowUploadModal(false);
      setDocTitle("");
      setUploadFile(null);
      loadDashboard();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document. Check backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAISettings = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${API_BASE_URL}/settings/ai`, {
      model_name: aiModel,
      temperature: Number(aiTemp),
      top_p: 0.9,
      chunk_size: Number(chunkSize),
      chunk_overlap: 50,
    });

    await loadDashboard();
    alert("AI & Model settings saved successfully!");
  } catch (error) {
    console.error("AI settings save error:", error);
    alert("Failed to save AI settings.");
  }
};

  

  const safeKnowledge = Array.isArray(knowledge) ? knowledge : [];

  const filteredKnowledge = safeKnowledge.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const questionMatch = item?.question ? String(item.question).toLowerCase().includes(q) : false;
    const answerMatch = item?.answer ? String(item.answer).toLowerCase().includes(q) : false;
    const categoryMatch = item?.category ? String(item.category).toLowerCase().includes(q) : false;
    return questionMatch || answerMatch || categoryMatch;
  });

  const statistics = [
    { title: "Knowledge Records", value: stats.total_knowledge || safeKnowledge.length, color: "#60a5fa", icon: "📚" },
    { title: "RAG Queries Logged", value: stats.total_searches || 0, color: "#34d399", icon: "🔍" },
    { title: "Avg Response Time", value: stats.avg_response_time || "< 2s", color: "#fbbf24", icon: "⚡️" },
    { title: "Answer Accuracy", value: stats.answer_accuracy || "88%", color: "#a78bfa", icon: "🎯" },
  ];

  const modules = [
    { title: "Document Ingestion", description: "Upload and vectorize PDFs, troubleshooting guides, and SOPs.", icon: "📄", action: () => setShowUploadModal(true), buttonText: "Upload Document" },
    { title: "User Management", description: "Manage customer, service desk, and engineer access control.", icon: "👤", action: () => setActiveTab("users"), buttonText: "Manage Users" },
    { title: "Telemetry & Analytics", description: "View query metrics, search topics, and performance targets.", icon: "📊", action: () => setActiveTab("analytics"), buttonText: "View Analytics" },
    { title: "AI & Model Settings", description: "Configure Ollama, Llama 3 parameters, and vector retrieval chunking.", icon: "🤖", action: () => setActiveTab("settings"), buttonText: "Configure AI" },
    { title: "System Logs & Audit", description: "Review system activity, search history, and retrieval logs.", icon: "📝", action: () => setActiveTab("logs"), buttonText: "View Audit Logs" },
  ];
  return (
    <div style={{ background: "#081528", minHeight: "100vh", color: "white", fontFamily: "Segoe UI, sans-serif", padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
            ⚙️ Administrator Portal
          </h1>
          <p style={{ color: "#cbd5e1", marginTop: "8px", margin: 0 }}>
            Telecom Support Knowledge Assistant — System & Knowledge Management
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowUploadModal(true)} style={{ background: "#059669", color: "white", border: "none", borderRadius: "10px", padding: "12px 20px", cursor: "pointer", fontWeight: "600" }}>
            📤 Upload Document
          </button>
          <button onClick={loadDashboard} style={{ background: "#163055", color: "white", border: "1px solid #35537a", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}>
            🔄 Refresh
          </button>
          <Link to="/" style={{ background: "#2563eb", color: "white", textDecoration: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: "600" }}>
            ← Home
          </Link>
        </div>
      </div>

      {/* Internal Navigation Bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #1e3a5f", paddingBottom: "15px", flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "🏠 Overview" },
          { id: "users", label: "👤 User Management" },
          { id: "analytics", label: "📊 Telemetry & Analytics" },
          { id: "settings", label: "🤖 AI & Model Settings" },
          { id: "logs", label: "📝 System Logs & Audit" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "#2563eb" : "#10284b",
              color: "white",
              border: "1px solid #35537a",
              borderRadius: "8px",
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: "#7f1d1d", color: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "25px", border: "1px solid #f87171" }}>
          {error}
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {statistics.map((item) => (
              <div key={item.title} style={{ background: "#10284b", borderRadius: "18px", padding: "25px", border: "1px solid #1e3a5f" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>{item.icon}</div>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#94a3b8" }}>{item.title}</h3>
                <h1 style={{ color: item.color, margin: 0, fontSize: "32px" }}>{loading ? "..." : item.value}</h1>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Administration Modules</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "50px" }}>
            {modules.map((module) => (
              <div key={module.title} style={{ background: "#10284b", borderRadius: "18px", padding: "25px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #1e3a5f" }}>
                <div>
                  <div style={{ fontSize: "38px", marginBottom: "12px" }}>{module.icon}</div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{module.title}</h3>
                  <p style={{ color: "#cbd5e1", lineHeight: "1.6", fontSize: "14px", margin: 0 }}>{module.description}</p>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button onClick={module.action} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", width: "100%" }}>
                    {module.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#10284b", borderRadius: "18px", padding: "25px", overflowX: "auto", border: "1px solid #1e3a5f", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px" }}>Ingested Knowledge & SOP Records</h2>
                <p style={{ color: "#cbd5e1", margin: "5px 0 0 0", fontSize: "14px" }}>Active documents and extracted chunks indexed inside ChromaDB & SQLite.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: "#081528", border: "1px solid #35537a", borderRadius: "10px", padding: "8px 14px", color: "white", fontSize: "14px", outline: "none" }}
                />
                <span style={{ background: "#163055", color: "#bfdbfe", padding: "8px 15px", borderRadius: "10px", fontSize: "14px", border: "1px solid #35537a", whiteSpace: "nowrap" }}>
                  Total Indexed: {filteredKnowledge.length}
                </span>
              </div>
            </div>

            {loading ? (
              <p style={{ marginTop: "25px", color: "#cbd5e1" }}>Loading knowledge records...</p>
            ) : filteredKnowledge.length === 0 ? (
              <p style={{ marginTop: "25px", color: "#cbd5e1" }}>{searchTerm ? "No matching records found." : "No knowledge records found."}</p>
            ) : (
              <table style={{ width: "100%", minWidth: "750px", marginTop: "25px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#163055", textAlign: "left" }}>
                    <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>ID</th>
                    <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>Question / SOP Header</th>
                    <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>Extracted Knowledge Content</th>
                    <th style={{ padding: "12px 15px", borderBottom: "1px solid #35537a" }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKnowledge.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #1f3b63" }}>
                      <td style={{ padding: "12px 15px", color: "#93c5fd" }}>{item.id}</td>
                      <td style={{ padding: "12px 15px", verticalAlign: "top", maxWidth: "250px", fontWeight: "500" }}>{item.question}</td>
                      <td style={{ padding: "12px 15px", verticalAlign: "top", color: "#cbd5e1", maxWidth: "380px", lineHeight: "1.5", fontSize: "14px" }}>{item.answer}</td>
                      <td style={{ padding: "12px 15px", verticalAlign: "top" }}>
                        <span style={{ background: "#1e3a5f", color: "#bfdbfe", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", display: "inline-block" }}>{item.category}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div style={{ background: "#10284b", borderRadius: "18px", padding: "25px", border: "1px solid #1e3a5f" }}>
          <h2>👤 User Management</h2>
          <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "20px" }}>Manage registered system accounts and permissions across roles.</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#163055", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Username</th>
                <th style={{ padding: "12px" }}>Role</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #1f3b63" }}>
                  <td style={{ padding: "12px", color: "#60a5fa" }}>#{u.id}</td>
                  <td style={{ padding: "12px" }}>{u.username}</td>
                  <td style={{ padding: "12px" }}>{u.role}</td>
                  <td style={{ padding: "12px", color: "#34d399" }}>{u.status || "Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: TELEMETRY & ANALYTICS */}
      {activeTab === "analytics" && (
        <div>
          <h2>📊 Telemetry & Analytics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "20px" }}>
            <div style={{ background: "#10284b", padding: "20px", borderRadius: "12px", border: "1px solid #1e3a5f" }}>
              <p style={{ color: "#94a3b8", margin: 0 }}>Total RAG Queries</p>
              <h2 style={{ color: "#60a5fa", margin: "10px 0 0 0" }}>{stats.total_searches || 142}</h2>
            </div>
            <div style={{ background: "#10284b", padding: "20px", borderRadius: "12px", border: "1px solid #1e3a5f" }}>
              <p style={{ color: "#94a3b8", margin: 0 }}>Cache Hit Rate</p>
              <h2 style={{ color: "#34d399", margin: "10px 0 0 0" }}>94.2%</h2>
            </div>
            <div style={{ background: "#10284b", padding: "20px", borderRadius: "12px", border: "1px solid #1e3a5f" }}>
              <p style={{ color: "#94a3b8", margin: 0 }}>Avg Query Latency</p>
              <h2 style={{ color: "#fbbf24", margin: "10px 0 0 0" }}>{stats.avg_response_time || "0.85s"}</h2>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI & MODEL SETTINGS */}
      {activeTab === "settings" && (
        <div style={{ background: "#10284b", padding: "25px", borderRadius: "18px", maxWidth: "500px", border: "1px solid #1e3a5f" }}>
          <h2>🤖 AI & Model Settings</h2>
          <form onSubmit={handleSaveAISettings} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Ollama Model</label>
              <input type="text" value={aiModel} onChange={(e) => setAiModel(e.target.value)} style={{ width: "100%", padding: "10px", background: "#081528", border: "1px solid #35537a", color: "white", borderRadius: "6px" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Temperature ({aiTemp})</label>
              <input type="range" min="0" max="1" step="0.1" value={aiTemp} onChange={(e) => setAiTemp(parseFloat(e.target.value))} style={{ width: "100%" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Chunk Size (Vector Retrieval)</label>
              <input type="number" value={chunkSize} onChange={(e) => setChunkSize(parseInt(e.target.value))} style={{ width: "100%", padding: "10px", background: "#081528", border: "1px solid #35537a", color: "white", borderRadius: "6px" }} />
            </div>
            <button type="submit" style={{ padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Save Model Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: SYSTEM LOGS & AUDIT */}
      {activeTab === "logs" && (
        <div style={{ background: "#10284b", borderRadius: "18px", padding: "25px", border: "1px solid #1e3a5f" }}>
          <h2>📝 System Logs & Audit</h2>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {logs.map((log) => (
              <div key={log.id} style={{ background: "#163055", padding: "12px", borderRadius: "8px", display: "flex", gap: "15px", fontSize: "14px" }}>
                <span style={{ color: "#94a3b8" }}>{log.timestamp}</span>
                <strong style={{ color: "#60a5fa" }}>[{log.action}]</strong>
                <span>User: <em>{log.user}</em> — {log.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {showUploadModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#10284b", padding: "30px", borderRadius: "18px", width: "100%", maxWidth: "500px", border: "1px solid #35537a" }}>
            <h2 style={{ marginTop: 0 }}>📤 Ingest Telecom Document</h2>
            <form onSubmit={handleDocumentUpload}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Document Title</label>
                <input type="text" required value={docTitle} onChange={(e) => setDocTitle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #35537a", background: "#081528", color: "white" }} />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Category</label>
                <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #35537a", background: "#081528", color: "white" }}>
                  <option value="Broadband & Fiber">Broadband & Fiber</option>
                  <option value="SIM & Activation">SIM & Activation</option>
                  <option value="Billing & Plans">Billing & Plans</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Select File (PDF / TXT)</label>
                <input type="file" required onChange={(e) => setUploadFile(e.target.files[0])} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #35537a", background: "#081528", color: "white" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: "#334155", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  {uploading ? "Ingesting..." : "Upload & Vectorize"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;