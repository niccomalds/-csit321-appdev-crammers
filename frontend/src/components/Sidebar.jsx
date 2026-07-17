import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/images/logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  { label: "Faculty Status", path: "/faculty-status", icon: "👤" },
  { label: "Consultation Schedule", path: "/consultation-schedule", icon: "📋" },
  { label: "Faculty Absences", path: "/faculty-absences", icon: "⚠️" },
  { label: "Faculty Directory", path: "/faculty-directory", icon: "📇" },
  { label: "Notifications", path: "/notifications", icon: "🔔" },
];

const systemItems = [
  { label: "Settings", path: "/settings", icon: "⚙️" },
  { label: "Help & Support", path: "/help", icon: "❓" },
];

function Sidebar() {
  const navigate = useNavigate();

  // Static stand-in — swap for real user data once there's a backend
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    fullName: "Jehryn D. Laurino",
    role: "student",
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="CIT-U Seal" className="sidebar-logo" />
        <div>
          <h2 className="sidebar-title">CIT-U Faculty</h2>
          <p className="sidebar-subtitle">Board System</p>
        </div>
      </div>

      <div className="sidebar-section-label">MAIN</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-label">SYSTEM</div>
      <nav className="sidebar-nav">
        {systemItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <span className="sidebar-user-icon">👤</span>
          <div>
            <p className="sidebar-user-name">{currentUser.fullName}</p>
            <p className="sidebar-user-role">
              {currentUser.role === "faculty" ? "Faculty" : "Student"} | BSIT
            </p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          ⏻
        </button>
      </div>
    </div>
  );
}

export default Sidebar;