import Sidebar from "../../components/Sidebar";
import "./Dashboard.css";
import {
  dashboardSummary,
  notificationsList,
  absenceList,
} from "../../data/mockFaculty";

function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    fullName: "Jehryn D. Laurino",
  };

  const firstName = currentUser.fullName?.split(" ")[0] || "there";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const onLeave = absenceList.filter((a) => a.type !== "Seminar" || true); // shows all current absences

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <p className="dashboard-breadcrumb">
            CIT-U Faculty Board / <span>Dashboard</span>
          </p>
          <p className="dashboard-date">{today}</p>
        </div>

        <h1 className="dashboard-greeting">Good morning, {firstName}</h1>
        <p className="dashboard-subtext">
          Here is the current faculty availability overview for today.
        </p>

        {/* STAT CARDS */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{dashboardSummary.available}</div>
            <div className="stat-label stat-green">✔ Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dashboardSummary.inMeeting}</div>
            <div className="stat-label stat-orange">● In a Meeting</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dashboardSummary.classOngoing}</div>
            <div className="stat-label stat-blue">◐ Class Ongoing</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dashboardSummary.outOfOffice}</div>
            <div className="stat-label stat-red">↪ Out of Office</div>
          </div>
        </div>

        {/* PANELS */}
        <div className="dashboard-panels">
          <div className="panel">
            <div className="panel-header">
              <h3>Recent Notifications</h3>
              <a href="/notifications">View all</a>
            </div>
            <p className="panel-subtext">
              {notificationsList.filter((n) => !n.read).length} unread
            </p>

            <div className="panel-list">
              {notificationsList.map((n) => (
                <div key={n.id} className="notification-row">
                  <div className="notification-text">
                    <p>{n.message}</p>
                    <span className="notification-time">{n.time}</span>
                  </div>
                  {!n.read && <span className="notification-dot" />}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Faculty on Leave</h3>
              <a href="/faculty-absences">View all</a>
            </div>
            <p className="panel-subtext">{onLeave.length} currently absent</p>

            <div className="panel-list">
              {onLeave.map((f) => (
                <div key={f.id} className="leave-row">
                  <div className="leave-avatar">
                    {f.name.charAt(0)}
                  </div>
                  <div className="leave-text">
                    <p className="leave-name">{f.name}</p>
                    <p className="leave-department">{f.department}</p>
                    <p className="leave-return">Returns: {f.expectedReturn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;