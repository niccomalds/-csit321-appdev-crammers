import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { notificationsList as initialNotifications } from "../../data/mockFaculty";
import "../../styles/shared.css";
import "./Notifications.css";

const tabs = ["All", "Unread", "Status Changes", "Announcements"];

function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.read;
    if (activeTab === "Status Changes") return n.type === "status";
    if (activeTab === "Announcements") return n.type === "absence";
    return true;
  });

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title" style={{ textAlign: "center" }}>
          Notifications
        </h1>
        <p className="page-subtext" style={{ textAlign: "center" }}>
          Stay updated on faculty status changes in real time
        </p>

        <div className="filter-chips" style={{ justifyContent: "center" }}>
          {tabs.map((t) => (
            <button
              key={t}
              className={`chip ${activeTab === t ? "chip-active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="card notifications-list">
          {filtered.map((n) => (
            <div key={n.id} className="notification-item">
              <div className="notification-item-text">
                <p>{n.message}</p>
                <span className="notification-item-time">{n.time}</span>
              </div>
              {!n.read ? (
                <button
                  className="btn-outline"
                  onClick={() => markRead(n.id)}
                >
                  Mark read
                </button>
              ) : (
                <span className="notification-read-label">read</span>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="empty-state">No notifications here.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notifications;