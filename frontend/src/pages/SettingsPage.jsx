import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Notification states
  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    sms: false
  });

  // Theme states
  const [darkMode, setDarkMode] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    triggerToast("Password updated successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleCheckboxChange = (key) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
    triggerToast("Notification preferences updated!");
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    triggerToast(`${!darkMode ? 'Dark' : 'Light'} mode theme queued!`);
  };

  return (
    <div className="settings-page-container">
      {/* Toast Alert */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}

      <div className="settings-section-card">
        <h3 className="settings-card-title">User Profile Settings</h3>
        <p className="settings-card-subtitle">Manage your personal university profile information.</p>

        <div className="profile-fields-grid">
          <div className="profile-input-group">
            <label>Full Name</label>
            <input type="text" value={currentUser?.fullName || ""} disabled className="disabled-input" />
          </div>

          <div className="profile-input-group">
            <label>University Email</label>
            <input type="text" value={currentUser?.email || ""} disabled className="disabled-input" />
          </div>

          <div className="profile-input-group">
            <label>Account ID Number</label>
            <input type="text" value={currentUser?.idNumber || ""} disabled className="disabled-input" />
          </div>

          <div className="profile-input-group">
            <label>{currentUser?.role === 'student' ? 'Course & Year' : 'Academic Department'}</label>
            <input 
              type="text" 
              value={currentUser?.role === 'student' ? currentUser?.yearCourse : currentUser?.department || ""} 
              disabled 
              className="disabled-input" 
            />
          </div>
        </div>
      </div>

      <div className="settings-two-columns">
        
        {/* Left: Security Form */}
        <div className="settings-section-card">
          <h3 className="settings-card-title">Change Password</h3>
          <p className="settings-card-subtitle">Ensure your account uses a secure password credentials.</p>

          <form onSubmit={handlePasswordSubmit} className="password-update-form">
            <div className="profile-input-group">
              <label>Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="setting-text-input" 
              />
            </div>

            <div className="profile-input-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="setting-text-input" 
              />
            </div>

            <div className="profile-input-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="setting-text-input" 
              />
            </div>

            <button type="submit" className="save-settings-btn">
              Update Password
            </button>
          </form>
        </div>

        {/* Right: Notifications & Display settings */}
        <div className="settings-right-wrapper">
          
          {/* Notifications Card */}
          <div className="settings-section-card">
            <h3 className="settings-card-title">Notification Channels</h3>
            <p className="settings-card-subtitle">Choose where you want to receive status logs and board updates.</p>

            <div className="checkbox-options-list">
              <label className="checkbox-row-label">
                <input 
                  type="checkbox" 
                  checked={notifs.email} 
                  onChange={() => handleCheckboxChange('email')} 
                  className="setting-checkbox"
                />
                <div className="checkbox-info">
                  <span className="checkbox-title">Email Notifications</span>
                  <span className="checkbox-desc">Receive real-time alerts on your registered university mail inbox.</span>
                </div>
              </label>

              <label className="checkbox-row-label">
                <input 
                  type="checkbox" 
                  checked={notifs.push} 
                  onChange={() => handleCheckboxChange('push')} 
                  className="setting-checkbox"
                />
                <div className="checkbox-info">
                  <span className="checkbox-title">Web Push Notifications</span>
                  <span className="checkbox-desc">Receive browser banner updates while dashboard is active.</span>
                </div>
              </label>

              <label className="checkbox-row-label">
                <input 
                  type="checkbox" 
                  checked={notifs.sms} 
                  onChange={() => handleCheckboxChange('sms')} 
                  className="setting-checkbox"
                />
                <div className="checkbox-info">
                  <span className="checkbox-title">SMS Notifications</span>
                  <span className="checkbox-desc">Receive mobile messages for immediate absence alerts.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Theme Settings Card */}
          <div className="settings-section-card">
            <h3 className="settings-card-title">Display Settings</h3>
            <p className="settings-card-subtitle">Adjust the display interface theme settings.</p>

            <div className="toggle-row-setting">
              <div className="toggle-left-text">
                <span className="toggle-title">Dark Mode Theme</span>
                <span className="toggle-desc">Switch from light mode to sleek dark mode styling.</span>
              </div>
              <button 
                onClick={handleThemeToggle} 
                className={`theme-toggle-switch ${darkMode ? 'switch-active' : ''}`}
              >
                <span className="switch-dot"></span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
