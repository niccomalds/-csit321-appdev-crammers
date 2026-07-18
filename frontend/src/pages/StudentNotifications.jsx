import React, { useState, useEffect } from 'react';
import './StudentNotifications.css';

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("studentNotifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const saveNotifications = (updatedNotifs) => {
    setNotifications(updatedNotifs);
    localStorage.setItem("studentNotifications", JSON.stringify(updatedNotifs));
    // Also trigger custom event to notify parent dashboard if needed
    window.dispatchEvent(new Event('storage'));
  };

  const handleMarkAsRead = (id) => {
    const updated = notifications.map((notif) => {
      if (notif.id === id) {
        return { ...notif, unread: false };
      }
      return notif;
    });
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((notif) => ({ ...notif, unread: false }));
    saveNotifications(updated);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'absence':
        return (
          <div className="notif-circle-icon absence-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        );
      case 'schedule':
        return (
          <div className="notif-circle-icon schedule-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        );
      case 'status':
      default:
        return (
          <div className="notif-circle-icon status-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </div>
        );
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = notif.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  const getUnreadCount = () => {
    return notifications.filter(n => n.unread).length;
  };

  return (
    <div className="student-notifications-container">
      {/* Search and Action Bar */}
      <div className="notif-filter-bar">
        <div className="search-box-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search notification messages..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-field"
          />
        </div>

        <div className="notif-actions">
          {getUnreadCount() > 0 && (
            <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="notif-main-panel">
        <div className="notif-panel-sidebar">
          <h4 className="sidebar-group-title">Categories</h4>
          <div className="sidebar-filter-list">
            {[
              { id: "All", label: "All Notifications" },
              { id: "status", label: "Status Changes" },
              { id: "absence", label: "Absences" },
              { id: "schedule", label: "Consultation Schedules" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterType(cat.id)}
                className={`sidebar-filter-item ${filterType === cat.id ? 'active-item' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="notif-panel-list-view">
          {filteredNotifications.length > 0 ? (
            <div className="notif-full-list">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notif-card-row ${notif.unread ? 'notif-unread' : ''}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div className="notif-card-left">
                    {getNotifIcon(notif.type)}
                    <div className="notif-card-texts">
                      <p className="notif-card-msg">{notif.message}</p>
                      <span className="notif-card-time">{notif.date} · {notif.timestamp}</span>
                    </div>
                  </div>

                  <div className="notif-card-right">
                    {notif.unread ? (
                      <span className="unread-badge">New</span>
                    ) : (
                      <span className="read-badge">Read</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-search-state">
              <span className="empty-search-icon">🔔</span>
              <p className="empty-search-title">No notifications found</p>
              <p className="empty-search-text">Your notifications log is clear or matches no results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentNotifications;
