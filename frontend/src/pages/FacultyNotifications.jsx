import { useState, useEffect } from 'react';
import './FacultyNotifications.css';
import { notificationApi } from '../api/notificationApi';

function FacultyNotifications() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const loadNotifications = () => {
    if (currentUser?.id) {
      notificationApi.getNotificationsByUser(currentUser.id)
        .then(data => setNotifications(data))
        .catch(err => console.error("Failed to load notifications:", err));
    }
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("dashboard-reloaded", loadNotifications);
    return () => window.removeEventListener("dashboard-reloaded", loadNotifications);
  }, [currentUser?.id]);

  const handleMarkAsRead = (id) => {
    notificationApi.markAsRead(id)
      .then(() => {
        setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, unread: false } : notif));
      })
      .catch(err => console.error("Failed to mark notification as read:", err));
  };

  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    notificationApi.deleteNotification(id)
      .then(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      })
      .catch(err => console.error("Failed to delete notification:", err));
  };

  const handleMarkAllRead = () => {
    if (currentUser?.id) {
      notificationApi.markAllAsRead(currentUser.id)
        .then(() => {
          setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
        })
        .catch(err => console.error("Failed to mark all as read:", err));
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'absence':
        return (
          <div className="notif-circle-icon absence-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
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

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = notif.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  const getUnreadCount = () => {
    return notifications.filter(n => n.unread).length;
  };

  return (
    <div className="faculty-notifications-container">
      {/* Search and Action Bar */}
      <div className="notif-filter-bar">
        <div className="search-box-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search notification logs..." 
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
              { id: "All", label: "All Logs" },
              { id: "status", label: "Status & Broadcasts" },
              { id: "absence", label: "Absences & Leaves" },
              { id: "schedule", label: "Consultation & Classes" },
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

                  <div className="notif-card-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {notif.unread ? (
                      <span className="unread-badge">New</span>
                    ) : (
                      <span className="read-badge">Read</span>
                    )}
                    <button 
                      className="delete-notif-btn" 
                      onClick={(e) => handleDeleteNotification(e, notif.id)}
                      title="Delete notification"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-search-state">
              <span className="empty-search-icon">🔔</span>
              <p className="empty-search-title">No logs found</p>
              <p className="empty-search-text">Your notifications log is clear or matches no results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyNotifications;
