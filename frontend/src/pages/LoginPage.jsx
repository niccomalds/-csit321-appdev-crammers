import Header from "../components/Header";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

function LoginPage() {
  const handleClear = () => {
    console.log("Clear entries clicked");
    // Clear inputs -- simple approach for now
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(i => (i.value = ''));
  };

  const handleLogin = () => {
    console.log("Login clicked");
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

            <form className="register-form login-form" onSubmit={(e)=>{e.preventDefault(); handleLogin();}}>
              <div className="register-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@cit.edu" required />
              </div>

              <div className="register-form-group">
                <label>Password</label>
                <input type="password" placeholder="Password" required />
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
