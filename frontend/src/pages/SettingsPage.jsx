import { useState } from 'react';
import './SettingsPage.css';
import { InlineFeedback } from '../components/Feedback';

function SettingsPage() {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Theme states
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // Success toast message
  const [toastMessage, setToastMessage] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please complete every password field.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("The new password and confirmation do not match.");
      return;
    }

    triggerToast("Password updated successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleThemeToggle = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    const theme = nextDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    triggerToast(`${nextDarkMode ? 'Dark' : 'Light'} mode enabled.`);
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
            <label>{currentUser?.role?.toLowerCase() === 'student' ? 'Course & Year' : 'Academic Department'}</label>
            <input 
              type="text" 
              value={currentUser?.role?.toLowerCase() === 'student' ? currentUser?.yearCourse : currentUser?.department || ""} 
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
          <p className="settings-card-subtitle">Ensure your account uses secure password credentials.</p>

          <form onSubmit={handlePasswordSubmit} className="password-update-form">
            <InlineFeedback>{passwordError}</InlineFeedback>
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

        {/* Right: Display settings */}
        <div className="settings-section-card">
          <h3 className="settings-card-title">Display Settings</h3>
          <p className="settings-card-subtitle">Adjust the display interface theme settings.</p>

          <div className="toggle-row-setting">
            <div className="toggle-left-text">
              <span className="toggle-title">Dark Mode Theme</span>
              <span className="toggle-desc">Switch from light mode to sleek dark mode styling.</span>
            </div>
            <button 
              type="button"
              onClick={handleThemeToggle} 
              className={`theme-toggle-switch ${darkMode ? 'switch-active' : ''}`}
              role="switch"
              aria-checked={darkMode}
              aria-label="Toggle dark mode"
            >
              <span className="switch-dot"></span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
