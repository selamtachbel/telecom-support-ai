import { useNavigate } from "react-router-dom";

import "../LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const portals = [
    {
      title: "Customer Portal",
      description:
        "Get support for internet, billing, packages, SIM services, balance and other customer needs.",
      path: "/customer",
      buttonText: "Open Customer Portal",
    },
    {
      title: "IT Service Desk",
      description:
        "Access troubleshooting procedures, service desk knowledge, escalation steps and support guidance.",
      path: "/service-desk",
      buttonText: "Open Service Desk",
    },
    {
      title: "Network Engineer",
      description:
        "Access network diagnostics, technical procedures, incident support and engineering documentation.",
      path: "/engineer",
      buttonText: "Open Engineer Portal",
    },
    {
      title: "Administrator",
      description:
        "Manage the knowledge base, review activity, update support content and monitor the system.",
      path: "/admin",
      buttonText: "Open Administration",
    },
  ];

  const openPortal = (portal) => {
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
      <div className="landing-overlay"></div>

      <header className="landing-header">
        <div className="landing-brand">
          <div className="brand-logo">E</div>

          <div>
            <h2>Enu</h2>
            <p>Telecom Support Knowledge Assistant</p>
          </div>
        </div>

        <div className="online-status">
          <span></span>
          System online
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <p className="hero-label">
            AI-POWERED TELECOM SUPPORT PLATFORM
          </p>

          <h1>
            Telecom Support
            <span> Knowledge Assistant</span>
          </h1>

          <p className="hero-text">
            A centralized intelligent support platform for customers,
            IT service desk agents, network engineers and administrators.
          </p>
        </section>

        <section className="portal-section">
          <div className="portal-heading">
            <p>SELECT YOUR ROLE</p>

            <h2>Choose Your Workspace</h2>

            <span>
              Each workspace provides support tools and information designed
              for its users.
            </span>
          </div>

          <div className="portal-grid">
            {portals.map((portal, index) => (
              <article
                className="portal-card"
                key={portal.title}
                onClick={() => openPortal(portal)}
              >
                <div className="portal-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="portal-icon">
                  {portal.title.charAt(0)}
                </div>

                <h3>{portal.title}</h3>

                <p>{portal.description}</p>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openPortal(portal);
                  }}
                >
                  {portal.buttonText}
                  <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2026 Enu Telecom Support Knowledge Assistant</p>

        <div>
          <span>Secure</span>
          <span>Reliable</span>
          <span>Available 24/7</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;