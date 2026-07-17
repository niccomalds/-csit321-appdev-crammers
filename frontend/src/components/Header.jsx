import "./Header.css";
import logo from "../assets/images/logo.png";

function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <img
          src={logo}
          alt="CIT University Seal"
          className="header-logo"
        />
        <div className="header-text">
          <h1 className="header-title">CIT University</h1>
          <h2 className="header-subtitle">Enrollment System</h2>
        </div>
      </div>
    </div>
  );
}

export default Header;