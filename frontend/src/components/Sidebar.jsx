import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/images/logo.png';

function Sidebar({ activeTab = 'dashboard', setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.stopPropagation(); // Prevent trigger profile click
    navigate('/login');
  };

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src={logo} alt="CIT-U Logo" className="sidebar-logo-img" />
        <div className="logo-text-section">
          <h1>CIT-U Faculty</h1>
          <p>Board System</p>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">MAIN</h3>
          <ul className="nav-menu">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <a href="#dashboard" className="nav-link" onClick={(e) => handleTabClick(e, 'dashboard')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                </span>
                <span className="nav-label">Dashboard</span>
              </a>
            </li>
            <li className={`nav-item ${activeTab === 'status' ? 'active' : ''}`}>
              <a href="#status" className="nav-link" onClick={(e) => handleTabClick(e, 'status')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </span>
                <span className="nav-label">Status Management</span>
              </a>
            </li>
            <li className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}>
              <a href="#schedule" className="nav-link" onClick={(e) => handleTabClick(e, 'schedule')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <span className="nav-label">Consultation Schedule</span>
              </a>
            </li>
            <li className={`nav-item ${activeTab === 'absence' ? 'active' : ''}`}>
              <a href="#absence" className="nav-link" onClick={(e) => handleTabClick(e, 'absence')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                <span className="nav-label">Absence Announcements</span>
              </a>
            </li>
            <li className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}>
              <a href="#notifications" className="nav-link" onClick={(e) => handleTabClick(e, 'notifications')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </span>
                <span className="nav-label">Notifications</span>
              </a>
            </li>
          </ul>
        </div>

        {/* System Menu */}
        <div className="nav-section">
          <h3 className="nav-section-title">SYSTEM</h3>
          <ul className="nav-menu">
            <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
              <a href="#settings" className="nav-link" onClick={(e) => handleTabClick(e, 'settings')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
                <span className="nav-label">Settings</span>
              </a>
            </li>
            <li className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}>
              <a href="#help" className="nav-link" onClick={(e) => handleTabClick(e, 'help')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                <span className="nav-label">Help & Support</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer" onClick={() => navigate('/login')}>
        <div className="user-profile">
          <div className="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="user-info">
            <p className="user-name">Jehryn D. Laurino</p>
            <p className="user-role">Student | BSIT</p>
          </div>
          <button className="user-logout" onClick={handleLogout} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
