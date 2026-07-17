import Sidebar from "../../components/Sidebar";
import "../../styles/shared.css";
import "./Settings.css";

function Settings() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    fullName: "Jehryn D. Laurino",
    email: "jehryn.laurino@cit.edu",
    role: "student",
    idNumber: "CIT-2024-0001",
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtext">Manage your account information.</p>

        <div className="card settings-card">
          <div className="settings-row">
            <span className="settings-label">Full Name</span>
            <span className="settings-value">{currentUser.fullName}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Email</span>
            <span className="settings-value">{currentUser.email}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Role</span>
            <span className="settings-value">
              {currentUser.role === "faculty" ? "Faculty" : "Student"}
            </span>
          </div>
          <div className="settings-row">
            <span className="settings-label">ID Number</span>
            <span className="settings-value">{currentUser.idNumber}</span>
          </div>

          <button className="btn-maroon" style={{ marginTop: 16 }}>
            Save Changes
          </button>
          <p className="page-subtext" style={{ marginTop: 8, fontSize: 12 }}>
            Editing isn't wired up yet — this is a static preview.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Settings;