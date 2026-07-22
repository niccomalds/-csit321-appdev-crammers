import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { facultyApi } from '../api/facultyApi';
import { notifyFacultyStatusUpdated } from '../hooks/useFacultyList';
import Sidebar from '../components/Sidebar';
import StatusManagement from './StatusManagement';
import ConsultationSchedule from './ConsultationSchedule';
import AbsenceAnnouncements from './AbsenceAnnouncements';
import StudentDashboard from './StudentDashboard';
import StudentFacultyStatus from './StudentFacultyStatus';
import StudentConsultationSchedule from './StudentConsultationSchedule';
import StudentFacultyAbsences from './StudentFacultyAbsences';
import StudentFacultyDirectory from './StudentFacultyDirectory';
import StudentNotifications from './StudentNotifications';
import SettingsPage from './SettingsPage';
import HelpSupportPage from './HelpSupportPage';
import './DashboardPage.css';

import { scheduleApi } from '../api/scheduleApi';
import { announcementApi } from '../api/announcementApi';
import { consultationScheduleApi } from '../api/consultationScheduleApi';

function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.replace(/^\/|\/$/g, '') || 'dashboard';

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Today, 8:45 AM');
  const [currentTime, setCurrentTime] = useState('');

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null") || {
    fullName: "Josemarie C. Amparo",
    role: "faculty",
    department: "College of Computer Studies"
  };
  const isStudent = currentUser.role?.toLowerCase() === 'student';

  // Live status & schedules counts in states
  const [currentStatus, setCurrentStatus] = useState("Available");
  const [currentStatusDescription, setCurrentStatusDescription] = useState("");
  const [schedulesCount, setSchedulesCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);

  const getStatusLabel = (statusId) => {
    switch (statusId) {
      case "Available": return "Available";
      case "InClass": return "In Class";
      case "Busy": return "Busy";
      case "Out": return "Out";
      default: return "Available";
    }
  };

  const getStatusDetails = (statusId) => {
    switch (statusId) {
      case "Available":
        return { color: "#10b981", bg: "#e6f7ec", text: "#15803d", dot: "dot-Available" };
      case "InClass":
        return { color: "#f59e0b", bg: "#fef3c7", text: "#92400e", dot: "dot-InClass" };
      case "Busy":
        return { color: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8", dot: "dot-Busy" };
      case "Out":
        return { color: "#ef4444", bg: "#fef2f2", text: "#b91c1c", dot: "dot-Out" };
      default:
        return { color: "#10b981", bg: "#e6f7ec", text: "#15803d", dot: "dot-Available" };
    }
  };

  const statusDetails = getStatusDetails(currentStatus);

  const [consultations, setConsultations] = useState([]);

  // Formatter for breadcrumb date/time: e.g. "Mon, Jun 29 · 3:45 PM"
  const formatDateTime = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dateNum = date.getDate();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${dayName}, ${monthName} ${dateNum} · ${hours}:${minutesStr} ${ampm}`;
  };

  // Clock tick effect & Data Seed
  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    const userObj = JSON.parse(loggedInUser);

    // Fetch faculty status list from Spring Boot backend to sync the board
    facultyApi.findAll().then(data => {
      localStorage.setItem("facultyList", JSON.stringify(data));
      notifyFacultyStatusUpdated();
    }).catch(err => console.error("Failed to sync faculty status board:", err));

    if (userObj && userObj.id && userObj.role?.toLowerCase() === 'faculty') {
      // 1. Fetch live status
      facultyApi.findById(userObj.id)
        .then(data => {
          const statusMap = {
            AVAILABLE: "Available",
            IN_CLASS: "InClass",
            BUSY: "Busy",
            OUT: "Out"
          };
          const mappedStatus = statusMap[data.status] || "Available";
          setCurrentStatus(mappedStatus);
          setCurrentStatusDescription(data.statusDescription || "");
          localStorage.setItem("currentStatus", mappedStatus);
          localStorage.setItem("currentStatusDescription", data.statusDescription || "");
        })
        .catch(err => console.error("Failed to load live status:", err));

      // 2. Fetch schedules count
      scheduleApi.getSchedulesByFaculty(userObj.id)
        .then(data => {
          setSchedulesCount(data.length);
        })
        .catch(err => console.error("Failed to load schedule count:", err));

      // 3. Fetch announcements count
      announcementApi.getAnnouncementsByFaculty(userObj.id)
        .then(data => {
          const mapped = data.map(item => ({
            ...item,
            description: item.details || item.description
          }));
          setAnnouncements(mapped);
          setAnnouncementsCount(mapped.length);
        })
        .catch(err => console.error("Failed to load announcements count:", err));

      // 4. Fetch consultation schedules
      consultationScheduleApi.getSchedulesByFaculty(userObj.id)
        .then(data => {
          setConsultations(data);
        })
        .catch(err => console.error("Failed to load consultation schedules:", err));
    }

    // Initial set
    setCurrentTime(formatDateTime(new Date()));
    
    const timer = setInterval(() => {
      setCurrentTime(formatDateTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle reload/sync button click
  const handleReload = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      
      setLastUpdated(`Today, ${hours}:${minutesStr} ${ampm}`);
      setIsSyncing(false);
    }, 850);
  };

  // Translate tab ID to friendly name for placeholder titles
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'status': return isStudent ? 'Faculty Status' : 'Status Management';
      case 'schedule': return 'Consultation Schedule';
      case 'absence': return isStudent ? 'Faculty Absences' : 'Absence Announcements';
      case 'directory': return 'Faculty Directory';
      case 'notifications': return 'Notifications';
      case 'settings': return 'Settings';
      case 'help': return 'Help & Support';
      default: return '';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Component */}
      <Sidebar activeTab={activeTab} />

      {/* Main Content Area */}
      <main className="dashboard-content">
        
        {/* Header Bar */}
        <header className="dashboard-header">
          <div className="breadcrumb">
            CIT-U Faculty Board / <span className="breadcrumb-active">{activeTab === 'dashboard' ? 'Dashboard' : getTabTitle(activeTab)}</span>
          </div>
          <div className="header-right">
            <span className="header-time">{currentTime}</span>
            <button 
              className={`refresh-button ${isSyncing ? 'spinning' : ''}`} 
              onClick={handleReload}
              title="Sync Status"
              disabled={isSyncing}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="dashboard-body">
          
          {/* Academic Year Banner */}
          <div className="academic-year-section">
            Academic Year 2025-2026 · Semester <span className="academic-year-semibold">1</span>
          </div>

          {isStudent ? (
            activeTab === 'dashboard' ? (
              <StudentDashboard />
            ) : activeTab === 'status' ? (
              <StudentFacultyStatus />
            ) : activeTab === 'schedule' ? (
              <StudentConsultationSchedule />
            ) : activeTab === 'absence' ? (
              <StudentFacultyAbsences />
            ) : activeTab === 'directory' ? (
              <StudentFacultyDirectory />
            ) : activeTab === 'notifications' ? (
              <StudentNotifications />
            ) : activeTab === 'settings' ? (
              <SettingsPage />
            ) : activeTab === 'help' ? (
              <HelpSupportPage />
            ) : (
              /* Other placeholders */
              <div className="coming-soon-container" style={{ alignSelf: 'center', marginTop: 40 }}>
                <div className="coming-soon-icon">❓</div>
                <h2 className="coming-soon-title">{getTabTitle(activeTab)} View</h2>
                <p className="coming-soon-text">
                  The {getTabTitle(activeTab)} feature is currently under construction.
                  Please check back later for updates as we finalize this page.
                </p>
              </div>
            )
          ) : (
            activeTab === 'dashboard' ? (
              <>
                {/* Metrics Grid */}
                <div className="metrics-grid">
                  
                  {/* Card 1: Current Status */}
                  <div className="metric-card">
                    <div className="card-top">
                      <div className="card-icon-container">
                        <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                          <circle cx="18" cy="18" r="18" fill={statusDetails.color} />
                          <path d="M12 18L16 22L24 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div 
                        className="card-status-badge"
                        style={{ backgroundColor: statusDetails.bg, color: statusDetails.text }}
                      >
                        <span className={`badge-dot ${statusDetails.dot}`}></span> {getStatusLabel(currentStatus)}
                      </div>
                    </div>
                    <div className="card-bottom">
                      <p className="card-label">Current Status</p>
                      <h2 className="card-value">{getStatusLabel(currentStatus)}</h2>
                      <p className="card-subtext">{currentStatusDescription}</p>
                    </div>
                  </div>

                  {/* Card 2: Class Schedules */}
                  <div className="metric-card">
                    <div className="card-top">
                      <div className="card-icon-container">
                        <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                          <circle cx="18" cy="18" r="18" fill="#7a1f2b" />
                          <path d="M9 17h18M9 12h18M9 22h18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="card-bottom">
                      <p className="card-label">Class Schedules</p>
                      <h2 className="card-value">{schedulesCount} schedules</h2>
                      <p className="card-subtext">
                        {schedulesCount === 0 ? "No classes scheduled" : `${schedulesCount} teaching session${schedulesCount > 1 ? 's' : ''} today`}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Active Announcements */}
                  <div className="metric-card">
                    <div className="card-top">
                      {/* Empty to match layout */}
                    </div>
                    <div className="card-bottom">
                      <p className="card-label">Active Announcements</p>
                      <h2 className="card-value">{announcementsCount}</h2>
                      <p className="card-subtext">Visible to students</p>
                    </div>
                  </div>

                  {/* Card 4: Last Updated */}
                  <div className="metric-card">
                    <div className="card-top">
                      {/* Empty to match layout */}
                    </div>
                    <div className="card-bottom">
                      <p className="card-label">Last Updated</p>
                      <h2 className="card-value">{lastUpdated}</h2>
                      <p className="card-subtext">Status sync</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Split Panels */}
                <div className="panels-container">
                  
                  {/* Left Panel: Active Absence Announcements */}
                  <section className="panel">
                    <div className="panel-header">
                      <h3 className="panel-title">Active Absence Announcements</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {announcements.length > 0 ? (
                        announcements.map((item) => (
                          <div key={item.id} className="announcement-card" style={{ marginBottom: 0 }}>
                            <div className="announcement-header">
                              <span className="faculty-name">{currentUser?.fullName || "Josemarie C. Amparo"} ({item.reason})</span>
                              <span className="announcement-badge">Active</span>
                            </div>
                            <p className="announcement-details">
                              {item.description}
                            </p>
                            <div className="announcement-footer">
                              <div className="date-range">
                                <span>{item.startDate}</span>
                                <span>&rarr;</span>
                                <span>{item.endDate}</span>
                              </div>
                              <div>
                                Returns <span className="return-date">{item.returnDate}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "24px 0", color: "#a1a1aa", fontSize: "12.5px", textAlign: "center" }}>
                          No active absence announcements.
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Right Panel: Weekly Consultation */}
                  <section className="panel">
                    <div className="panel-header">
                      <h3 className="panel-title">Weekly Consultation</h3>
                      <a href="#view-all" className="panel-action-link" onClick={(e) => e.preventDefault()}>View all</a>
                    </div>
                    
                    <div className="consultation-list">
                      {consultations.length > 0 ? (
                        consultations.map((item) => (
                          <div key={item.id} className="consultation-item">
                            <div className="consultation-left">
                              <div className="day-badge">{item.day ? item.day.slice(0, 2) : ""}</div>
                              <div className="consultation-info">
                                <span className="day-name">{item.day}</span>
                                <span className="consultation-time">{item.startTime} – {item.endTime}</span>
                              </div>
                            </div>
                            <span 
                              className={`modality-badge modality-${item.mode === "Online" ? "online" : "f2f"}`}
                              title={item.location}
                            >
                              {item.mode === "Online" ? "Online" : "F2F"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "24px 0", color: "#a1a1aa", fontSize: "12.5px", textAlign: "center" }}>
                          No weekly consultation hours configured.
                        </div>
                      )}
                    </div>
                  </section>

                </div>
              </>
            ) : activeTab === 'status' ? (
              <StatusManagement />
            ) : activeTab === 'schedule' ? (
              <ConsultationSchedule />
            ) : activeTab === 'absence' ? (
              <AbsenceAnnouncements />
            ) : activeTab === 'settings' ? (
              <SettingsPage />
            ) : activeTab === 'help' ? (
              <HelpSupportPage />
            ) : (
              /* Placeholder View for other pages */
              <div className="coming-soon-container" style={{ alignSelf: 'center', marginTop: 40 }}>
                <div className="coming-soon-icon">
                  {activeTab === 'notifications' ? '🔔' : '❓'}
                </div>
                <h2 className="coming-soon-title">{getTabTitle(activeTab)} View</h2>
                <p className="coming-soon-text">
                  The {getTabTitle(activeTab)} feature is currently under construction.
                  Please check back later for updates as we finalize this page.
                </p>
              </div>
            )
          )}

        </div>

      </main>
    </div>
  );
}

export default DashboardPage;
