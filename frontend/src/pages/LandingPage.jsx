import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHeadset,
  FaTools,
  FaUserShield,
  FaArrowRight,
  FaCircle,
  FaLock,
} from "react-icons/fa";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("customer");

  const portals = [
    {
      id: "customer",
      number: "01",
      title: "Customer Portal",
      description:
        "Get help from Enu, access telecom services, troubleshoot common issues and create support requests.",
      path: "/customer",
      icon: <FaUser />,
      color: "cyan",
      requiresLogin: false,
    },
    {
      id: "service",
      number: "02",
      title: "IT Service Desk",
      description:
        "Manage tickets, search telecom knowledge, assist customers and escalate complex support incidents.",
      path: "/service-desk",
      icon: <FaHeadset />,
      color: "green",
      requiresLogin: true,
    },
    {
      id: "engineer",
      number: "03",
      title: "Network Engineer",
      description:
        "Investigate escalated incidents, run diagnostics, access technical knowledge and resolve network issues.",
      path: "/engineer",
      icon: <FaTools />,
      color: "blue",
      requiresLogin: true,
    },
    {
      id: "admin",
      number: "04",
      title: "Administrator",
      description:
        "Manage users, knowledge, analytics, AI configuration, documents and system audit activity.",
      path: "/admin",
      icon: <FaUserShield />,
      color: "purple",
      requiresLogin: true,
    },
  ];

  const selectedPortal = portals.find(
    (portal) => portal.id === selectedRole
  );

  /*
    IMPORTANT:
    Customer opens directly.
    Service Desk, Engineer and Admin go through Login first.

    This restores the exact behavior from your old working version.
  */
  const openPortal = (portal) => {
    if (!portal) return;

    if (portal.path === "/customer") {
      navigate("/customer");
      return;
    }

    navigate("/login", {
      state: {
        requestedPath: portal.path,
        requestedTitle: portal.title,
      },
    });
  };

  return (
    <div className="landing-page">
      {/* Decorative Background */}
      <div className="landing-grid"></div>

      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      {/* Telecom Tower Decoration */}
      <div className="telecom-decoration">
        <div className="signal-ring ring-one"></div>
        <div className="signal-ring ring-two"></div>
        <div className="signal-ring ring-three"></div>

        <div className="tower">
          <div className="tower-top"></div>
          <div className="tower-body"></div>
          <div className="tower-leg left"></div>
          <div className="tower-leg right"></div>
        </div>
      </div>

      {/* Network Globe */}
      <div className="network-globe">
        <div className="globe-ring globe-ring-one"></div>
        <div className="globe-ring globe-ring-two"></div>
        <div className="globe-ring globe-ring-three"></div>

        <span className="network-node node-1"></span>
        <span className="network-node node-2"></span>
        <span className="network-node node-3"></span>
        <span className="network-node node-4"></span>
        <span className="network-node node-5"></span>
      </div>

      {/* Header */}
      <header className="landing-topbar">
        <div className="landing-brand">
          <div className="landing-logo">E</div>

          <div>
            <strong>Enu</strong>
            <span>Telecom Support Knowledge Assistant</span>
          </div>
        </div>

        <div className="system-status">
          <FaCircle />
          <span>System online</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-content">
        {/* Hero */}
        <section className="landing-hero">
          <p className="landing-eyebrow">
            AI-POWERED TELECOM SUPPORT PLATFORM
          </p>

          <h1>
            Telecom Support
            <span>Knowledge Assistant</span>
          </h1>

          <p className="landing-description">
            A centralized intelligent support platform connecting
            customers, IT service desk agents, network engineers
            and administrators through one AI-powered telecom
            support ecosystem.
          </p>
        </section>

        {/* Workspace Selection */}
        <section className="workspace-section">
          <div className="workspace-heading">
            <span></span>

            <div>
              <p>CHOOSE YOUR WORKSPACE</p>

              <h2>Select Your Role</h2>

              <small>
                Choose the workspace designed for your support role.
              </small>
            </div>

            <span></span>
          </div>

          {/* Cards */}
          <div className="workspace-grid">
            {portals.map((portal) => (
              <button
                type="button"
                key={portal.id}
                className={`workspace-card ${portal.color} ${
                  selectedRole === portal.id ? "selected" : ""
                }`}
                onClick={() => setSelectedRole(portal.id)}
              >
                <div className="workspace-card-top">
                  <span className="workspace-number">
                    {portal.number}
                  </span>

                  <span className="workspace-icon">
                    {portal.icon}
                  </span>
                </div>

                <h3>{portal.title}</h3>

                <div className="workspace-line"></div>

                <p>{portal.description}</p>

                <div className="workspace-card-bottom">
                  {portal.requiresLogin ? (
                    <span className="workspace-security">
                      <FaLock />
                      Secure Login Required
                    </span>
                  ) : (
                    <span className="workspace-security customer-access">
                      Direct Customer Access
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Enter Selected Portal */}
          <div className="workspace-enter">
            <button
              type="button"
              className="enter-workspace-button"
              onClick={() => openPortal(selectedPortal)}
            >
              <span className="enter-arrow">
                <FaArrowRight />
              </span>

              Enter {selectedPortal?.title}
            </button>

            {selectedPortal?.requiresLogin ? (
              <p>
                <FaLock /> Username and password required for{" "}
                <span>{selectedPortal.title}</span>
              </p>
            ) : (
              <p>
                Customer access is available{" "}
                <span>without employee login.</span>
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <span>
          © 2026 Enu Telecom Support Knowledge Assistant
        </span>

        <span>
          Secure • Intelligent • Always Connected
        </span>
      </footer>
    </div>
  );
}

export default LandingPage;