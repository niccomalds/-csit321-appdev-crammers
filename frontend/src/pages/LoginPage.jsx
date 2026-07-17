import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import "./RegisterPage.css";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleClear = () => {
    const inputs = document.querySelectorAll(".login-form input");
    inputs.forEach((i) => (i.value = ""));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // No backend yet — check against locally "registered" users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const match = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!match) {
      alert("No matching account found. Please register first.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(match));
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="register-page">
      <Header />

      <div className="register-card">
        <div className="register-card-inner">
          <div className="register-left">
            <div className="register-left-content">
              <h3 className="card-title">
                Welcome
                <br />
                <span className="card-sub">Back</span>
              </h3>
              <p className="register-left-note">
                Sign in to continue to the CIT-U Board System.
              </p>
              <p style={{ marginTop: 12 }} className="register-apply-note">
                Forgot your password? Use the link below to recover it.
              </p>
            </div>
          </div>

          <div className="register-right">
            <p className="register-subtitle">Login to your account</p>

            <form className="register-form login-form" onSubmit={handleLogin}>
              <div className="register-form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="you@cit.edu" required />
              </div>

              <div className="register-form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Password" required />
              </div>

              <div className="register-button-row">
                <button type="button" className="register-btn-secondary" onClick={handleClear}>
                  CLEAR ENTRIES
                </button>
                <button type="submit" className="register-btn-primary">
                  LOGIN
                </button>
              </div>
            </form>

            <p className="register-login-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>

            <p className="register-footer">
              For inquiries, email us at{" "}
              <a href="mailto:cit.faculty@cit.edu">cit.faculty@cit.edu</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;