import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleClear = () => {
    // Clear inputs -- simple approach for now
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(i => (i.value = ''));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // 1. Check against seeded Faculty account
    if (email === "teacher@cit.edu" && password === "password123") {
      const facultyUser = {
        fullName: "Josemarie C. Amparo",
        email: "teacher@cit.edu",
        role: "faculty",
        department: "College of Computer Studies",
        idNumber: "FAC-2024-0001"
      };
      localStorage.setItem("currentUser", JSON.stringify(facultyUser));
      navigate("/dashboard");
      return;
    }

    // 2. Check against registered Student accounts
    const students = JSON.parse(localStorage.getItem("users") || "[]");
    const matchedStudent = students.find(s => s.email === email && s.password === password);

    if (matchedStudent) {
      localStorage.setItem("currentUser", JSON.stringify(matchedStudent));
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Note: Teachers use teacher@cit.edu / password123. Students must register first.");
    }
  };

  return (
    <div className="register-page">
      <Header />

      <div className="register-card">
        <div className="register-card-inner">
          <div className="register-left">
            <div className="register-left-content">
              <h3 className="card-title">Welcome<br />
                <span className="card-sub">Back</span>
              </h3>
              <p className="register-left-note">Sign in to continue to the CIT-U Board System.</p>
              <p style={{marginTop:12}} className="register-apply-note">Forgot your password? Use the link below to recover it.</p>
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
                <button type="button" className="register-btn-secondary" onClick={handleClear}>CLEAR ENTRIES</button>
                <button type="submit" className="register-btn-primary">LOGIN</button>
              </div>
            </form>

            <p className="register-login-link">Don't have an account? <Link to="/">Register here</Link></p>

            <p className="register-footer">For inquiries, email us at <a href="mailto:cit.faculty@cit.edu">cit.faculty@cit.edu</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
