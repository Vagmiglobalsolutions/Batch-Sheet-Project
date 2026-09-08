import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import tadimetyLogo from "../../assets/Tadimety-transparent-logo.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setIsLoading(true);

      await login({
        username: username.trim(),
        password,
      });

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        switch (user.role) {
          case "PRODUCTION":
            navigate("/production");
            break;

          case "QA":
            navigate("/qa");
            break;

          case "TECHNICAL":
            navigate("/technical");
            break;

          case "ADMIN":
            navigate("/admin");
            break;

          default:
            navigate("/login");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-decoration">
        <div className="factory-shape factory-left" />
        <div className="factory-shape factory-right" />
      </div>

      <div className="login-container">
        <div className="login-card">

          {/* Logo */}
          <div className="brand-section">
            <img
              src={tadimetyLogo}
              alt="Tadimety Aromatics"
              className="tadimety-logo"
            />

            <h2 className="company-name">
              TADIMETY AROMATICS PRIVATE LIMITED
            </h2>

            <div className="brand-divider" />
          </div>

          {/* Application title */}
          <div className="application-title">
            <h1>Digital Batch Sheet</h1>
            <h1>Management System</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">
                <span className="input-icon user-icon">
                  <span />
                </span>

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

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon lock-icon">
                  <span />
                </span>

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

                {/* CSS eye icon */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <span
                    className={`eye-icon ${
                      showPassword
                        ? "eye-open"
                        : ""
                    }`}
                  >
                    <span className="eye-pupil" />
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing In..."
                : "LOGIN"}
            </button>

          </form>

          {/* Footer */}
          <div className="login-footer">
            © 2026 Tadimety Aromatics. All rights reserved.
          </div>
        </div>

        {/* Security indicators */}
        <div className="security-features">

          <div className="security-item">
            <span className="security-icon shield-icon">
              ✓
            </span>
            <span>Secure Access</span>
          </div>

          <div className="security-divider" />

          <div className="security-item">
            <span className="security-icon shield-icon">
                ✓
              <span />
            </span>
            <span>Protected Data</span>
          </div>

          <div className="security-divider" />

          <div className="security-item">
            <span className="security-icon shield-icon">
              ✓
            </span>
            <span>Trusted System</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;