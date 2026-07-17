import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // "student" | "faculty"
  const [formData, setFormData] = useState({
    fullName: "",
    yearCourse: "",   // used for students
    department: "",   // used for faculty
    email: "",
    idNumber: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      yearCourse: "",
      department: "",
      email: "",
      idNumber: "",
      password: "",
    });
    setError("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    // No backend yet — store the "account" locally so Login can check it
    const newUser = { ...formData, role };
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    navigate("/login", { replace: true });
  };

  return (
    <div className="register-page">
      <Header />

      <div className="register-card">
        <div className="register-card-inner">
          <div className="register-left">
            <div className="register-left-content">
              <h3 className="card-title">
                CIT-U FACULTY
                <br />
                <span className="card-sub">Board System</span>
              </h3>
            </div>
          </div>

          <div className="register-right">
            <p className="register-subtitle">
              Create your account to get started with CIT-U Board System
            </p>

            {/* ROLE TOGGLE */}
            <div className="register-role-toggle">
              <button
                type="button"
                className={`role-btn ${role === "student" ? "role-btn-active" : ""}`}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`role-btn ${role === "faculty" ? "role-btn-active" : ""}`}
                onClick={() => setRole("faculty")}
              >
                Faculty
              </button>
            </div>

            {error && <p className="register-error">{error}</p>}

            <form className="register-form" onSubmit={handleRegister}>
              <div className="register-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Juan D. Dela Cruz"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CONDITIONAL FIELD: Year & Course for students, Department for faculty */}
              {role === "student" ? (
                <div className="register-form-group">
                  <label>Year & Course</label>
                  <input
                    type="text"
                    name="yearCourse"
                    placeholder="3rd Year - BS Computer Science"
                    value={formData.yearCourse}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <div className="register-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="College of Computer Studies"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="register-form-group">
                <label>University Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="juandelacruz@cit.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-form-row">
                <div className="register-form-group register-form-group-half">
                  <label>ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    placeholder={role === "student" ? "CIT-2024-0001" : "FAC-0001"}
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="register-form-group register-form-group-half">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-button-row">
                <button
                  type="button"
                  className="register-btn-secondary"
                  onClick={handleClear}
                >
                  CLEAR ENTRIES
                </button>
                <button type="submit" className="register-btn-primary">
                  REGISTER
                </button>
              </div>
            </form>

            <p className="register-login-link">
              Already have an account? <Link to="/login">Click here to Login</Link>
            </p>

            <p className="register-footer">
              For inquiries, email us at{" "}
              <a href="mailto:cit.faculty@cit.edu">cit.faculty@cit.edu</a>
            </p>

            <p className="register-copyright">Copyrights © 2024 CIT-U Enrollment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;