import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import "./RegisterPage.css";
import { useState } from "react";
import Silk from "../components/Silk";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    course: "",
    year: "",
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
      department: "",
      course: "",
      year: "",
      email: "",
      idNumber: "",
      password: "",
    });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.department ||
      !formData.course ||
      !formData.year ||
      !formData.email ||
      !formData.idNumber ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await authApi.register(formData);
      navigate("/login");
    } catch (err) {
      const fieldErrors = err.response?.data?.fieldErrors;
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, msg]) => {
            const formattedField = field.replace(/([A-Z])/g, ' $1').trim();
            return `${formattedField.charAt(0).toUpperCase() + formattedField.slice(1)}: ${msg}`;
          })
          .join(", ");
        setError(errorMessages);
      } else {
        const msg = err.response?.data?.message || "Registration failed. Please check your inputs.";
        setError(msg);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="silk-bg">
        <Silk
          speed={5}
          scale={1}
          color="#7a1f2b"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <Header />

      {/* REGISTER CARD */}
      <div className="register-card">
        <div className="register-card-inner">
          <div className="register-left">
            <div className="register-left-content">
              <h3 className="card-title">CIT-U FACULTY<br />
                <span className="card-sub">Board System</span>
              </h3>
            </div>
          </div>

          <div className="register-right">
            <p className="register-subtitle">Create your account to get started with CIT-U Board System</p>

            {error && <p style={{ color: "red", fontSize: 13, marginBottom: 10, textAlign: "left" }}>{error}</p>}

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

              <div className="register-form-group">
                <label>Department</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required 
                >
                  <option value="">Select Department</option>
                  <option value="College of Computer Studies">College of Computer Studies</option>
                  <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
                  <option value="College of Management, Business and Accountancy">College of Management, Business and Accountancy</option>
                  <option value="College of Arts, Sciences and Education">College of Arts, Sciences and Education</option>
                </select>
              </div>

              <div className="register-form-row">
                <div className="register-form-group register-form-group-year">
                  <label>Year Level</label>
                  <input 
                    type="text" 
                    name="year"
                    placeholder="e.g. 3rd" 
                    value={formData.year}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="register-form-group register-form-group-course">
                  <label>Course</label>
                  <input 
                    type="text" 
                    name="course"
                    placeholder="e.g. BSCS" 
                    value={formData.course}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

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
                    placeholder="CIT-2024-0001" 
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
                    minLength={8}
                    required 
                  />
                </div>
              </div>

              <div className="register-button-row">
                <button type="button" className="register-btn-secondary" onClick={handleClear}>CLEAR ENTRIES</button>
                <button type="submit" className="register-btn-primary">REGISTER</button>
              </div>
            </form>

            <p className="register-login-link">Already have an account? <Link to="/login">Click here to Login</Link></p>

            <p className="register-footer">For inquiries, email us at <a href="mailto:cit.faculty@cit.edu">cit.faculty@cit.edu</a></p>

            <p className="register-copyright">Copyrights © 2024 CIT-U Enrollment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;