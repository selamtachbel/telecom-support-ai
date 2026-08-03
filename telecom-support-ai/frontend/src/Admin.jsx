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
});

  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, knowledgeResponse] =
        await Promise.all([
          axios.get(
            "http://127.0.0.1:8000/dashboard/stats"
          ),
          axios.get(
            "http://127.0.0.1:8000/knowledge"
          ),
        ]);

      setStats(statsResponse.data);
      setKnowledge(knowledgeResponse.data);
    } catch (requestError) {
      console.error(
        "Dashboard loading error:",
        requestError
      );

      setError(
        "Unable to load dashboard data. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statistics = [
    {
      title: "Knowledge Articles",
      value: stats.total_knowledge,
      color: "#60a5fa",
      icon: "📚",
    },
    {
      title: "Search History",
      value: stats.total_searches,
      color: "#34d399",
      icon: "🔍",
    },
    {
      title: "Categories",
      value: stats.total_categories,
      color: "#fbbf24",
      icon: "📂",
    },
    {
      title: "System Status",
      value: "Online",
      color: "#a78bfa",
      icon: "🖥️",
    },
  ];

  const modules = [
    {
      title: "Knowledge Base",
      description:
        "Create, edit and manage telecom support articles.",
      icon: "📚",
    },
    {
      title: "User Management",
      description:
        "Manage service desk, engineer and administrator accounts.",
      icon: "👤",
    },
    {
      title: "Analytics",
      description:
        "View chatbot searches and support statistics.",
      icon: "📊",
    },
    {
      title: "AI Settings",
      description:
        "Configure AI responses and search behaviour.",
      icon: "🤖",
    },
    {
      title: "System Logs",
      description:
        "Review system activity and chat history.",
      icon: "📝",
    },
    {
      title: "Security",
      description:
        "Manage authentication and administrator permissions.",
      icon: "🔒",
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
          <h1 style={{ margin: 0 }}>
            ⚙️ Administrator Dashboard
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              marginTop: "10px",
            }}
          >
            Telecom Support Knowledge Assistant
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
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
          }}
        >
          {error}
        </div>
      )}

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
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
            }}
          >
            <div
              style={{
                fontSize: "42px",
              }}
            >
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <h1
              style={{
                color: item.color,
              }}
            >
              {loading ? "..." : item.value}
            </h1>
          </div>
        ))}
      </div>

      {/* Modules */}

      <h2>Administration Modules</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginBottom: "50px",
        }}
      >
        {modules.map((module) => (
          <div
            key={module.title}
            style={{
              background: "#10284b",
              borderRadius: "18px",
              padding: "25px",
            }}
          >
            <div
              style={{
                fontSize: "45px",
              }}
            >
              {module.icon}
            </div>

            <h3>{module.title}</h3>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: "1.7",
              }}
            >
              {module.description}
            </p>

            <Link
  to="/admin/knowledge"
  style={{
    display: "inline-block",
    marginTop: "15px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
  }}
>
  Open Module
</Link>
          </div>
        ))}
      </div>

      {/* Knowledge Base */}
      <div
        style={{
          background: "#10284b",
          borderRadius: "18px",
          padding: "25px",
          overflowX: "auto",
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
            <h2 style={{ margin: 0 }}>
              Knowledge Base Records
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                marginBottom: 0,
              }}
            >
              Live records loaded from the SQLite database.
            </p>
          </div>

          <span
            style={{
              background: "#163055",
              color: "#bfdbfe",
              padding: "10px 15px",
              borderRadius: "10px",
            }}
          >
            Total: {knowledge.length}
          </span>
        </div>

        {loading ? (
          <p
            style={{
              marginTop: "25px",
              color: "#cbd5e1",
            }}
          >
            Loading knowledge records...
          </p>
        ) : knowledge.length === 0 ? (
          <p
            style={{
              marginTop: "25px",
              color: "#cbd5e1",
            }}
          >
            No knowledge records were found.
          </p>
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
              <tr
                style={{
                  background: "#163055",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #35537a",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #35537a",
                  }}
                >
                  Question
                </th>

                <th
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #35537a",
                  }}
                >
                  Answer
                </th>

                <th
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #35537a",
                  }}
                >
                  Category
                </th>
              </tr>
            </thead>

            <tbody>
              {knowledge.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #1f3b63",
                  }}
                >
                  <td
                    style={{
                      padding: "15px",
                      color: "#93c5fd",
                    }}
                  >
                    {item.id}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "top",
                      maxWidth: "280px",
                    }}
                  >
                    {item.question}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "top",
                      color: "#cbd5e1",
                      maxWidth: "380px",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.answer}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "top",
                    }}
                  >
                    <span
                    style={{
                        background: "#1e3a5f",
                        color: "#bfdbfe",
                        padding: "7px 11px",
                        borderRadius: "8px",
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

      {/* Footer */}

      <div
        style={{
          marginTop: "50px",
          background: "#163055",
          borderRadius: "15px",
          padding: "20px",
          textAlign: "center",
          color: "#cbd5e1",
        }}
      >
        Telecom Support Knowledge Assistant —
        Administrator Workspace
      </div>
    </div>
  );
}

export default Admin;
    