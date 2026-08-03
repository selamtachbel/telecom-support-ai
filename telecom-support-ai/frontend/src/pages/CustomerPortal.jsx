import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBolt,
  FaClock,
  FaCog,
  FaCreditCard,
  FaExchangeAlt,
  FaFileInvoice,
  FaGift,
  FaGlobe,
  FaHeadset,
  FaHome,
  FaMicrophone,
  FaPaperPlane,
  FaPhoneAlt,
  FaRobot,
  FaShieldAlt,
  FaSimCard,
  FaUser,
  FaWifi,
} from "react-icons/fa";

import "../App.css";

function CustomerPortal() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchInputRef = useRef(null);

  const openChat = (suggestedQuestion = "") => {
    if (suggestedQuestion) {
      setQuestion(suggestedQuestion);
    }

    searchInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const askEnu = async (customQuestion = "") => {
    const finalQuestion = (customQuestion || question).trim();

    if (!finalQuestion) {
      setResult({
        answer: "Please enter a question.",
        category: "Validation",
        source: "Customer Portal",
        found: false,
      });
      return;
    }

    try {
      setLoading(true);
      setQuestion(finalQuestion);
      setResult(null);

      const response = await axios.get(
        "http://127.0.0.1:8000/search",
        {
          params: {
            query: finalQuestion,
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);

      setResult({
        answer:
          "Unable to connect to the backend. Please make sure FastAPI is running.",
        category: "Connection Error",
        source: "Frontend",
        found: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const popularQuestions = [
    {
      icon: <FaWifi />,
      title: "Internet not working",
      text: "Troubleshoot your internet connection",
      query: "internet not working",
      color: "cyan",
    },
    {
      icon: <FaSimCard />,
      title: "SIM not detected",
      text: "Fix SIM card issues quickly",
      query: "sim not detected",
      color: "green",
    },
    {
      icon: <FaCreditCard />,
      title: "Check my bill",
      text: "Get help with your telecom bill",
      query: "check bill",
      color: "purple",
    },
    {
      icon: <FaGift />,
      title: "Buy data package",
      text: "Explore available data packages",
      query: "package information",
      color: "orange",
    },
  ];

  const services = [
    {
      icon: <FaUser />,
      title: "Manage Account",
      query: "How do I manage my account?",
    },
    {
      icon: <FaGift />,
      title: "Buy Package",
      query: "How do I buy a data package?",
    },
    {
      icon: <FaSimCard />,
      title: "Check Balance",
      query: "How do I check my balance?",
    },
    {
      icon: <FaExchangeAlt />,
      title: "Airtime Transfer",
      query: "How do I transfer airtime?",
    },
    {
      icon: <FaFileInvoice />,
      title: "View Bill",
      query: "How do I view my bill?",
    },
    {
      icon: <FaCog />,
      title: "More Services",
      query: "What telecom services are available?",
    },
  ];

  return (
    <div className="portal">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <FaRobot />
          </div>

          <div>
            <h1>Enu</h1>
            <p>AI Portal</p>
          </div>
        </div>

        <nav className="menu">
          <button
            type="button"
            className="active"
            onClick={() => openChat()}
          >
            <FaRobot />
            <span>AI Chatbot</span>
          </button>

          <button type="button" onClick={goToTop}>
            <FaHome />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() =>
                openChat("My internet is not working")
            }
          >
            <FaWifi />
            <span>Internet</span>
          </button>

          <button
            type="button"
            onClick={() =>
              openChat("My SIM card is not detected")
            }
          >
            <FaSimCard />
            <span>SIM Services</span>
          </button>

          <button
            type="button"
            onClick={() =>
              openChat("How do I check my bill?")
            }
          >
            <FaCreditCard />
            <span>Billing</span>
          </button>

          <button
            type="button"
            onClick={() =>
              openChat("I want to buy a data package")
            }
          >
            <FaGift />
            <span>Packages</span>
          </button>

          <button
            type="button"
            onClick={() =>
              openChat("I need customer support")
            }
          >
            <FaHeadset />
            <span>Support</span>
          </button>
        </nav>

        <div className="help-card">
          <h3>Need Help?</h3>

          <p>Call us 24/7 on</p>

          <div className="help-number">
            <FaPhoneAlt />
            <strong>994</strong>
          </div>

          <button
            type="button"
            onClick={() =>
              openChat("How can I speak with a support agent?")
            }
          >
            <FaHeadset />
            Chat with Agent
          </button>
        </div>

        <div className="app-card">
          <h3>Get the My Ethiotel App</h3>

          <p>
            Manage your account, buy packages,
            pay bills and much more.
          </p>

          <div className="qr-box">
            {Array.from({ length: 64 }).map((_, index) => (
              <span key={index}></span>
            ))}
          </div>

          <a href="#services">
            Learn More <span>→</span>
          </a>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="online-pill">
            <span></span>
            Online
          </button>

          <div className="top-actions">
            <button type="button">
              <FaGlobe />
              EN
            </button>

            <button type="button">
              <FaUser />
              Sign In / Register
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-grid">

            <div className="hero-copy">

              <div className="enu-status">
                <button
  type="button"
  className="customer-home-button"
  onClick={() => navigate("/")}
>
  ← Back to Home
</button>
                <span></span>
                Enu is online and ready to help
              </div>

              <p className="greeting">
                Hi there! 👋
              </p>

              <h1>
                I'm <span>Enu</span>
              </h1>

              <h2>
                Your AI Telecom Assistant
              </h2>

              <p className="description">
                Smart telecom support for customers,
                service desk agents and engineers.

                Ask about internet, billing,
                SIM services, packages,
                troubleshooting and more.

                Available 24 hours a day,
                7 days a week.
              </p>

              <div className="benefits">

                <div>
                  <FaBolt />
                  Fast Responses
                </div>

                <div>
                  <FaShieldAlt />
                  Trusted Knowledge
                </div>

                <div>
                  <FaClock />
                  Available 24/7
                </div>

              </div>

            </div>

            <div className="robot-side">

              <div className="robot-glow"></div>

              <div className="robot">

                <div className="robot-antenna"></div>

                <div className="robot-head">

                  <div className="robot-face">

                    <div className="robot-eye left"></div>

                    <div className="robot-eye right"></div>

                    <div className="robot-smile"></div>

                  </div>

                </div>

                <div className="robot-body"></div>

                <div className="robot-base"></div>

              </div>

            </div>

          </div>

          <div className="search-box">

            <div className="search-avatar">
              <FaRobot />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Ask anything about telecom support..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && askEnu()
              }
            />

            <FaMicrophone className="microphone" />

            <button
              type="button"
              onClick={() => askEnu()}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask Enu"}

              <FaPaperPlane />
            </button>

          </div>

          <p className="example">
            Example:
            My internet is slow.
            What should I do?
          </p>

          <p className="warning">
            <FaShieldAlt />
            Enu can make mistakes.
            Verify important information.
          </p>

        </section>

        {result && (
          <section className="answer-card">

            <div className="answer-heading">

              <div>
                <FaRobot />
              </div>

              <div>
                <h3>Enu</h3>
              </div>

            </div>

            <p className="answer-text">
              {result.answer}
            </p>

            <div className="answer-details">

              <p>
                <strong>Category:</strong>{" "}
                {result.category}
              </p>

              <p>
                <strong>Source:</strong>{" "}
                {result.source}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {result.found
                  ? "Knowledge Found ✅"
                  : "No Match ❌"}
              </p>

            </div>

          </section>
        )}

        <section className="content-section">

          <h2 className="section-title">
            Popular Questions
          </h2>

          <div className="popular-grid">

            {popularQuestions.map((item, index) => (

              <button
                key={index}
                type="button"
                className={`popular-card ${item.color}`}
                onClick={() => askEnu(item.query)}
              >

                <div className="question-icon">
                  {item.icon}
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>

                <strong>→</strong>

              </button>

            ))}

          </div>

        </section><section
          className="content-section"
          id="services"
        >
          <h2 className="section-title">
            Featured Services
          </h2>

          <div className="service-grid">
            {services.map((service, index) => (
              <button
                key={index}
                type="button"
                className="service-card"
                onClick={() => askEnu(service.query)}
              >
                <div>{service.icon}</div>

                <span>{service.title}</span>

                <strong>+</strong>
              </button>
            ))}
          </div>
        </section>

        <footer className="footer">
          <p>
            Powered by <strong>Enu AI</strong> |
            Ethio Telecom Knowledge Assistant
          </p>

          <p>
            <span>FastAPI</span>
            <span>React</span>
            <span>SQLite</span>
          </p>
        </footer>

        <button
          type="button"
          className="floating-chat"
          onClick={() => openChat()}
        >
          <FaRobot />
          Chat with Enu
        </button>

      </main>

    </div>
  );
}

export default CustomerPortal;
              