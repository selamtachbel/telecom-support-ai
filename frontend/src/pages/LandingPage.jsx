import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHeadset,
  FaTools,
  FaUserShield,
  FaArrowRight,
  FaCircle,
} from "react-icons/fa";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("customer");

  const workspaces = [
    {
      id: "customer",
      number: "01",
      title: "Customer Portal",
      description:
        "Get help, ask Enu, create support requests and find telecom solutions tailored for you.",
      icon: <FaUser />,
      route: "/customer",
      color: "cyan",
    },
    {
      id: "service",
      number: "02",
      title: "Service Desk",
      description:
        "Resolve tickets, manage incidents, search knowledge and support customers.",
      icon: <FaHeadset />,
      route: "/service-desk",
      color: "green",
    },
    {
      id: "engineer",
      number: "03",
      title: "Engineer Operations",
      description:
        "Access escalated incidents, diagnostics, technical knowledge and engineering tools.",
      icon: <FaTools />,
      route: "/engineer",
      color: "blue",
    },
    {
      id: "admin",
      number: "04",
      title: "Administrator Portal",
      description:
        "Manage users, knowledge, analytics, AI settings and platform administration.",
      icon: <FaUserShield />,
      route: "/admin",
      color: "purple",
    },
  ];

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === selectedRole
  );

  const enterWorkspace = () => {
    if (selectedWorkspace) {
      navigate(selectedWorkspace.route);
    }
  };

  return (
    <div className="landing-page">
      {/* Decorative background */}
      <div className="landing-grid"></div>
      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      {/* Telecom decoration */}
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

      {/* Globe decoration */}
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

      {/* Hero */}
      <main className="landing-content">
        <section className="landing-hero">
          <p className="landing-eyebrow">
            AI-POWERED TELECOM SUPPORT PLATFORM
          </p>

          <h1>
            Telecom Support
            <span>Knowledge Assistant</span>
          </h1>

          <p className="landing-description">
            A centralized intelligent support platform for customers,
            IT service desk agents, network engineers and administrators.
          </p>
        </section>

        <section className="workspace-section">
          <div className="workspace-heading">
            <span></span>

            <div>
              <p>CHOOSE YOUR WORKSPACE</p>
              <h2>Select Your Role</h2>
              <small>
                Each workspace provides support tools and information
                designed for its users.
              </small>
            </div>

            <span></span>
          </div>

          <div className="workspace-grid">
            {workspaces.map((workspace) => (
              <button
                type="button"
                key={workspace.id}
                className={`workspace-card ${workspace.color} ${
                  selectedRole === workspace.id ? "selected" : ""
                }`}
                onClick={() => setSelectedRole(workspace.id)}
                onDoubleClick={() => navigate(workspace.route)}
              >
                <div className="workspace-card-top">
                  <span className="workspace-number">
                    {workspace.number}
                  </span>

                  <span className="workspace-icon">
                    {workspace.icon}
                  </span>
                </div>

                <h3>{workspace.title}</h3>

                <div className="workspace-line"></div>

                <p>{workspace.description}</p>

                <span className="workspace-select">
                  {selectedRole === workspace.id
                    ? "Selected"
                    : "Select workspace"}
                </span>
              </button>
            ))}
          </div>

          <div className="workspace-enter">
            <button
              type="button"
              className="enter-workspace-button"
              onClick={enterWorkspace}
            >
              <span className="enter-arrow">
                <FaArrowRight />
              </span>

              Enter {selectedWorkspace?.title}
            </button>

            <p>
              Secure. Intelligent. <span>Always Connected.</span>
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>Enu Telecom Support Knowledge Assistant</span>
        <span>AI • RAG • Service Operations • Network Support</span>
      </footer>
    </div>
  );
}

export default LandingPage;