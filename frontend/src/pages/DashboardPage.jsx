import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const seedMockData = () => {
  // Check if we need to reset/seed the 5-teacher directory
  const list = localStorage.getItem("facultyList");
  const needsReset = !list || JSON.parse(list).length !== 5 || !list.includes("von.godinez@cit.edu");

  if (needsReset) {
    const initialFaculty = [
      {
        id: "fac-1",
        fullName: "Josemarie C. Amparo",
        email: "teacher@cit.edu",
        department: "College of Computer Studies",
        idNumber: "FAC-2024-0001",
        status: "Out",
        statusDescription: "Dubai Hackathon 2026 — Official Representation",
        room: "CSS Dept. Faculty Room"
      },
      {
        id: "fac-2",
        fullName: "Leah V. Barbaso",
        email: "leah.barbaso@cit.edu",
        department: "College of Computer Studies",
        idNumber: "FAC-2024-0002",
        status: "InClass",
        statusDescription: "Class Ongoing — ITEC 312, Lab 3",
        room: "CSS Dept. Faculty Room"
      },
      {
        id: "fac-3",
        fullName: "Jasmine A. Tulin",
        email: "jasmine.tulin@cit.edu",
        department: "College of Computer Studies",
        idNumber: "FAC-2024-0003",
        status: "InClass",
        statusDescription: "Class Ongoing — CSIT122, RTL 302",
        room: "CSS Dept. Faculty Room"
      },
      {
        id: "fac-4",
        fullName: "Roden J. Ugang",
        email: "roden.ugang@cit.edu",
        department: "College of Computer Studies",
        idNumber: "FAC-2024-0004",
        status: "Available",
        statusDescription: "In Office — NGE, CSS Department",
        room: "NGE Building, 3rd Floor"
      },
      {
        id: "fac-5",
        fullName: "Von Alphonse L. Godinez",
        email: "von.godinez@cit.edu",
        department: "College of Computer Studies",
        idNumber: "FAC-2024-0005",
        status: "Available",
        statusDescription: "Available for consultation",
        room: "CSS Dept. Faculty Room"
      }
    ];
    localStorage.setItem("facultyList", JSON.stringify(initialFaculty));

    const initialNotifications = [
      {
        id: 1,
        message: "Leah V. Barbaso changed status to Class Ongoing — ITEC 312, Lab 3",
        timestamp: "9:00 AM",
        date: "Today",
        type: "status",
        unread: true
      },
      {
        id: 2,
        message: "Josemarie C. Amparo posted an absence notice until July 1, 2026",
        timestamp: "June 19, 2026",
        date: "June 19, 2026",
        type: "absence",
        unread: true
      },
      {
        id: 3,
        message: "Jasmine A. Tulin changed status to Class Ongoing — CSIT122, RTL 302",
        timestamp: "1:00 PM",
        date: "Today",
        type: "status",
        unread: true
      },
      {
        id: 4,
        message: "Roden J. Ugang updated consultation schedule",
        timestamp: "Yesterday",
        date: "Yesterday",
        type: "schedule",
        unread: true
      }
    ];
    localStorage.setItem("studentNotifications", JSON.stringify(initialNotifications));

    // Seed class schedules
    localStorage.setItem("classesSchedule_leah.barbaso@cit.edu", JSON.stringify([
      { id: 201, subject: "ITEC 312", section: "BSIT-3A", room: "Lab 3", startTime: "08:30 AM", endTime: "10:30 AM" }
    ]));
    localStorage.setItem("classesSchedule_jasmine.tulin@cit.edu", JSON.stringify([
      { id: 301, subject: "CSIT122", section: "BSIT-2B", room: "RTL 302", startTime: "01:00 PM", endTime: "03:00 PM" }
    ]));
    localStorage.setItem("classesSchedule_von.godinez@cit.edu", JSON.stringify([
      { id: 501, subject: "CSIT 321", section: "BSIT-3A", room: "Lab 2", startTime: "10:30 AM", endTime: "12:30 PM" }
    ]));

    // Seed weekly consultation schedules
    localStorage.setItem("consultationSchedules_roden.ugang@cit.edu", JSON.stringify([
      { id: "c401", day: "Monday", mode: "Face-to-Face", startTime: "01:00 PM", endTime: "03:00 PM", location: "NGE Room 302" },
      { id: "c402", day: "Thursday", mode: "Online", startTime: "10:00 AM", endTime: "12:00 PM", location: "Microsoft Teams" }
    ]));
    localStorage.setItem("consultationSchedules_leah.barbaso@cit.edu", JSON.stringify([
      { id: "c201", day: "Monday", mode: "Face-to-Face", startTime: "10:00 AM", endTime: "12:00 PM", location: "NGE Room 302" },
      { id: "c202", day: "Wednesday", mode: "Face-to-Face", startTime: "01:00 PM", endTime: "03:00 PM", location: "NGE Room 302" },
      { id: "c203", day: "Friday", mode: "Online", startTime: "09:00 AM", endTime: "10:30 AM", location: "MS Teams" }
    ]));
    localStorage.setItem("consultationSchedules_jasmine.tulin@cit.edu", JSON.stringify([
      { id: "c301", day: "Wednesday", mode: "Face-to-Face", startTime: "10:30 AM", endTime: "12:30 PM", location: "CSS Dept. Faculty Room" }
    ]));
    localStorage.setItem("consultationSchedules_von.godinez@cit.edu", JSON.stringify([
      { id: "c501", day: "Thursday", mode: "Face-to-Face", startTime: "01:00 PM", endTime: "03:00 PM", location: "CSS Dept. Faculty Room" }
    ]));

    // Seed absence announcements
    localStorage.setItem("absenceAnnouncements_teacher@cit.edu", JSON.stringify([
      {
        id: "abs-1",
        reason: "Dubai Hackathon 2026",
        description: "Attending the Dubai Hackathon 2026 as institutional mentor and supervisor.",
        startDate: "2026-06-19",
        endDate: "2026-07-01",
        startTime: "08:00 AM",
        returnDate: "2026-07-01"
      }
    ]));
    localStorage.setItem("absenceAnnouncements", localStorage.getItem("absenceAnnouncements_teacher@cit.edu"));
  }
};

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
  const isStudent = currentUser.role === 'student';

  // Read status & schedules dynamically from localStorage
  const currentStatus = localStorage.getItem("currentStatus") || "Available";
  const currentStatusDescription = localStorage.getItem("currentStatusDescription") || "In Office — NGE, CSS Department";
  const savedClasses = JSON.parse(localStorage.getItem("classesSchedule") || "[]");
  const schedulesCount = savedClasses.length;

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

  // Read consultation schedules from localStorage
  const getConsultations = () => {
    const saved = localStorage.getItem("consultationSchedules");
    if (saved) return JSON.parse(saved);
    const defaultSchedules = [
      { id: "1", day: "Monday", mode: "Face-to-Face", startTime: "09:00 AM", endTime: "11:00 AM", location: "CSS Dept. Faculty Room" },
      { id: "2", day: "Wednesday", mode: "Online", startTime: "09:00 AM", endTime: "11:00 AM", location: "CSS Dept. Faculty Room" },
    ];
    localStorage.setItem("consultationSchedules", JSON.stringify(defaultSchedules));
    return defaultSchedules;
  };
  const consultations = getConsultations();

  // Read absence announcements from localStorage
  const getAnnouncements = () => {
    const saved = localStorage.getItem("absenceAnnouncements");
    if (saved) return JSON.parse(saved);
    const defaultAnnouncements = [
      {
        id: "1",
        reason: "Official Seminar",
        description: "Attending the National Higher Education Summit 2025 as institutional representative.",
        startDate: "2025-07-01",
        endDate: "2025-07-03",
        startTime: "08:00 AM",
        returnDate: "2025-07-04"
      },
      {
        id: "2",
        reason: "Sick Leave",
        description: "Medical rest as advised by attending physician.",
        startDate: "2025-06-10",
        endDate: "2025-06-12",
        startTime: "08:00 AM",
        returnDate: "2025-06-13"
      }
    ];
    localStorage.setItem("absenceAnnouncements", JSON.stringify(defaultAnnouncements));
    return defaultAnnouncements;
  };
  const announcements = getAnnouncements();
  const announcementsCount = announcements.length;

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

    seedMockData();

    // Sync Josemarie's status with facultyList
    const listStr = localStorage.getItem("facultyList");
    if (listStr) {
      const list = JSON.parse(listStr);
      const currentStatus = localStorage.getItem("currentStatus") || "Out";
      const currentStatusDescription = localStorage.getItem("currentStatusDescription") || "Dubai Hackathon 2026 — Official Representation";
      
      const updated = list.map(f => {
        if (f.email === "teacher@cit.edu") {
          return { ...f, status: currentStatus, statusDescription: currentStatusDescription };
        }
        return f;
      });
      localStorage.setItem("facultyList", JSON.stringify(updated));
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
