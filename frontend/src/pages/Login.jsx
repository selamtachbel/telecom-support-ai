import { useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedPath =
    location.state?.requestedPath || "/";

  const requestedTitle =
    location.state?.requestedTitle || "Staff Portal";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const allowedRoleForPath = {
  "/service-desk": "Service Desk",
  "/engineer": "Network Engineer",
  "/admin": "Admin",
};

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/login`, 
        {
          username: username.trim(),
          password,
        }
      );

      const userRole = response.data.role;
      const requiredRole =
        allowedRoleForPath[requestedPath];

      if (!requiredRole) {
        setError("This portal is not available.");
        return;
      }

      if (userRole !== requiredRole) {
        setError(
          `This account cannot access the ${requestedTitle}.`
        );
        return;
      }

      localStorage.setItem(
        "enuUser",
        JSON.stringify({
          username: response.data.username,
          role: userRole,
        })
      );

      navigate(requestedPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          "Unable to connect to the backend. Make sure FastAPI is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="login-page">
    <div className="login-background-grid"></div>
    <div className="login-glow login-glow-one"></div>
    <div className="login-glow login-glow-two"></div>

    <main className="login-shell">
      <section className="login-information">
        <div className="brand-row">
          <div className="brand-icon">📡</div>

          <div className="brand-text">
            <strong>Telecom Support AI</strong>
            <span>Knowledge Assistant Platform</span>
          </div>
        </div>

        <div className="login-hero-content">
          <p className="login-eyebrow">SECURE STAFF ACCESS</p>

          <h1>
            Smarter telecom support starts here.
          </h1>

          <p>
            Access role-based tools for service desk teams,
            network engineers, and system administrators.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="feature-check">✓</span>
              <span>AI-powered telecom knowledge search</span>
            </div>

            <div className="login-feature">
              <span className="feature-check">✓</span>
              <span>Secure role-based portal access</span>
            </div>

            <div className="login-feature">
              <span className="feature-check">✓</span>
              <span>Knowledge Base and analytics tools</span>
            </div>
          </div>
        </div>

        <p className="login-footer-note">
          Telecom Support Knowledge Assistant · MSSE Capstone Project
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="mobile-brand brand-row">
            <div className="brand-icon">📡</div>

            <div className="brand-text">
              <strong>Telecom Support AI</strong>
              <span>Knowledge Assistant Platform</span>
            </div>
          </div>

          <div className="login-form-heading">
            <p>{requestedTitle.toUpperCase()}</p>
            <h2>Welcome Back</h2>

            <span>
              Enter your authorized staff credentials to continue.
            </span>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="username">Username</label>

              <div className="login-input-wrapper">
                <span className="login-input-icon">👤</span>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
  <label htmlFor="password">Password</label>

  <div className="login-input-wrapper">
    <span className="login-input-icon">🔒</span>

    <input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(event) =>
        setPassword(event.target.value)
      }
      placeholder="Enter your password"
      autoComplete="current-password"
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowPassword((currentValue) => !currentValue)
      }
      aria-label={
        showPassword ? "Hide password" : "Show password"
      }
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>
</div>
{error && (
  <div className="login-error">
    {error}
  </div>
)}

<button
  className="login-button"
  type="submit"
  disabled={loading}
>
  {loading ? "Signing in..." : "Sign In Securely"}
</button>
          </form>

          <div className="login-security">
            <span>🔐</span>
            <span>Protected role-based access</span>
          </div>
          <button
            type="button"
            className="back-home-link"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </main>
  </div>
);
}
export default Login;