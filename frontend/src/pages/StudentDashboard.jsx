import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { useFacultyList } from '../hooks/useFacultyList';
import { notificationApi } from '../api/notificationApi';
import { announcementApi } from '../api/announcementApi';
import josemarieImg from '../assets/images/josemarie.jpg';
import leahImg from '../assets/images/leah.jpg';
import tulinImg from '../assets/images/tulin.jpg';
import ugangImg from '../assets/images/ugang.jpg';
import vonImg from '../assets/images/von.jpg';

const getFacultyAvatar = (email) => {
  switch (email) {
    case 'teacher@cit.edu':
      return josemarieImg;
    case 'leah.barbaso@cit.edu':
      return leahImg;
    case 'jasmine.tulin@cit.edu':
      return tulinImg;
    case 'roden.ugang@cit.edu':
      return ugangImg;
    case 'von.godinez@cit.edu':
      return vonImg;
    default:
      return null;
  }
};

function StudentDashboard() {
  const navigate = useNavigate();
  const faculty = useFacultyList();
  const [notifications, setNotifications] = useState([]);
  const [leaveAnnouncements, setLeaveAnnouncements] = useState([]);
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser") || "null"));

  useEffect(() => {
    if (currentUser?.id) {
      notificationApi.getNotificationsByUser(currentUser.id)
        .then(data => setNotifications(data))
        .catch(err => console.error("Failed to load notifications:", err));
    }
  }, [currentUser?.id]);

  useEffect(() => {
    announcementApi.getActiveAnnouncements()
      .then(data => setLeaveAnnouncements(data))
      .catch(err => console.error("Failed to load active announcements:", err));
  }, []);

  const getFirstName = (fullName) => {
    if (!fullName) return "Student";
    return fullName.split(' ')[0];
  };

  // Calculate status counts
  const availableCount = faculty.filter(f => f.status === 'Available').length;
  const meetingCount = faculty.filter(f => f.status === 'Busy').length;
  const classCount = faculty.filter(f => f.status === 'InClass').length;
  const outCount = faculty.filter(f => f.status === 'Out').length;

  // Format Return Date helper
  const getReturnDateForFaculty = (email) => {
    // Try to find the return date from the absence announcements key
    const rawAnnouncements = localStorage.getItem(`absenceAnnouncements_${email}`);
    if (rawAnnouncements) {
      const annList = JSON.parse(rawAnnouncements);
      if (annList.length > 0) {
        // Return returnDate of first active announcement
        return annList[0].returnDate;
      }
    }
    // Fallback if it is Josemarie (as standard absenceAnnouncements key)
    if (email === "teacher@cit.edu") {
      const joseAnnouncements = localStorage.getItem("absenceAnnouncements");
      if (joseAnnouncements) {
        const annList = JSON.parse(joseAnnouncements);
        if (annList.length > 0) {
          return annList[0].returnDate;
        }
      }
    }
    return "July 1, 2026"; // default mockup date
  };

  const getLeaveReasonForFaculty = (email) => {
    const rawAnnouncements = localStorage.getItem(`absenceAnnouncements_${email}`);
    if (rawAnnouncements) {
      const annList = JSON.parse(rawAnnouncements);
      if (annList.length > 0) {
        return annList[0].reason;
      }
    }
    if (email === "teacher@cit.edu") {
      const joseAnnouncements = localStorage.getItem("absenceAnnouncements");
      if (joseAnnouncements) {
        const annList = JSON.parse(joseAnnouncements);
        if (annList.length > 0) {
          return annList[0].reason;
        }
      }
    }
    return "Official Business";
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

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  return (
    <div className="student-dashboard-container">
      {/* Dynamic greeting */}
      <div className="student-greeting-section">
        <h1 className="student-welcome">Good morning, {getFirstName(currentUser?.fullName)}</h1>
        <p className="student-welcome-subtitle">
          Here is the current faculty availability overview for today.
          <span className="live-status-label"><span aria-hidden="true" /> Live</span>
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="student-metrics-grid">
        {/* Card 1: Available */}
        <div className="student-metric-card border-available">
          <div className="metric-header">
            <span className="metric-number text-available">{availableCount}</span>
            <div className="metric-icon-badge bg-available">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <span className="metric-label text-available">Available</span>
        </div>

        {/* Card 2: In a Meeting */}
        <div className="student-metric-card border-meeting">
          <div className="metric-header">
            <span className="metric-number text-meeting">{meetingCount}</span>
            <div className="metric-icon-badge bg-meeting">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </div>
          <span className="metric-label text-meeting">Busy</span>
        </div>

        {/* Card 3: Class Ongoing */}
        <div className="student-metric-card border-class">
          <div className="metric-header">
            <span className="metric-number text-class">{classCount}</span>
            <div className="metric-icon-badge bg-class">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
          </div>
          <span className="metric-label text-class">Class Ongoing</span>
        </div>

        {/* Card 4: Do Not Disturb */}
        <div className="student-metric-card border-out">
          <div className="metric-header">
            <span className="metric-number text-out">{outCount}</span>
            <div className="metric-icon-badge bg-out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
          </div>
          <span className="metric-label text-out">Do Not Disturb</span>
        </div>
      </div>

      {/* Split Panels */}
      <div className="student-panels-grid">

        {/* Left: Recent Notifications */}
        <div className="student-panel-card">
          <div className="student-panel-header">
            <h2 className="student-panel-title">Recent Notifications</h2>
            <button className="student-panel-link" onClick={() => navigate('/notifications')}>View all</button>
          </div>
          <div className="student-panel-content">
            {notifications.length > 0 ? (
              <div className="notif-list-container">
                {notifications.slice(0, 4).map((notif) => (
                  <div key={notif.id} className="notif-row-item">
                    <div className="notif-left-side">
                      {getNotifIcon(notif.type)}
                      <div className="notif-body-info">
                        <p className="notif-text-message">{notif.message}</p>
                        <span className="notif-text-time">{notif.timestamp}</span>
                      </div>
                    </div>
                    {notif.unread && <span className="notif-unread-indicator"></span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel-state">
                <p>No recent notifications.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Faculty on Leave */}
        <div className="student-panel-card">
          <div className="student-panel-header">
            <h2 className="student-panel-title">Faculty on Leave</h2>
            <button className="student-panel-link" onClick={() => navigate('/absence')}>View all</button>
          </div>
          <div className="student-panel-content">
            {leaveAnnouncements.length > 0 ? (
              <div className="leave-list-container">
                {leaveAnnouncements.map((ann) => (
                  <div key={ann.id} className="leave-row-item">
                    <div className="leave-left-info">
                      {getFacultyAvatar(ann.facultyEmail) ? (
                        <img src={getFacultyAvatar(ann.facultyEmail)} alt={ann.facultyName} className="leave-avatar-img" />
                      ) : (
                        <div className="leave-avatar-placeholder">
                          {getInitials(ann.facultyName)}
                        </div>
                      )}
                      <div className="leave-body-info">
                        <p className="leave-faculty-name">{ann.facultyName}</p>
                        <span className="leave-faculty-reason">{ann.reason}</span>
                        <span className="leave-faculty-return">Returns: <strong>{ann.returnDate}</strong></span>
                      </div>
                    </div>
                    <span className="leave-status-dot"></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel-state">
                <p>No faculty members are currently on leave.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
