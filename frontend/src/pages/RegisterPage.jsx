import Header from "../components/Header";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  const handleClear = () => {
    console.log("Clear entries clicked");
  };

  const handleRegister = () => {
    console.log("Register clicked");
  };

  return (
    <div className="register-page">
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

            <form className="register-form">
              <div className="register-form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Juan D. Dela Cruz" readOnly />
              </div>

              <div className="register-form-group">
                <label>Year & Course</label>
                <input type="text" placeholder="3rd Year - BS Computer Science" readOnly />
              </div>

              <div className="register-form-group">
                <label>University Email</label>
                <input type="email" placeholder="juandelacruz@cit.edu" readOnly />
              </div>

              <div className="register-form-row">
                <div className="register-form-group register-form-group-half">
                  <label>ID Number</label>
                  <input type="text" placeholder="CIT-2024-0001" readOnly />
                </div>
                <div className="register-form-group register-form-group-half">
                  <label>Password</label>
                  <input type="password" placeholder="********" readOnly />
                </div>
              </div>

              <div className="register-button-row">
                <button type="button" className="register-btn-secondary" onClick={handleClear}>CLEAR ENTRIES</button>
                <button type="button" className="register-btn-primary" onClick={handleRegister}>REGISTER</button>
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