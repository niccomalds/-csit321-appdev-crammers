import { useState, useEffect } from "react";
import "./AbsenceAnnouncements.css";
import { ConfirmDialog, InlineFeedback } from "../components/Feedback";

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "1",
    reason: "Official Seminar",
    description: "Attending the National Higher Education Summit 2025 as institutional representative.",
    startDate: "2025-07-01",
    endDate: "2025-07-03",
    startTime: "08:00 AM",
    returnDate: "2025-07-04",
  },
  {
    id: "2",
    reason: "Sick Leave",
    description: "Medical rest as advised by attending physician.",
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    startTime: "08:00 AM",
    returnDate: "2025-06-13",
  },
];

function AbsenceAnnouncements() {
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem("absenceAnnouncements");
    if (saved) {
      return JSON.parse(saved);
    }
    // Pre-seed mock data on first load
    localStorage.setItem("absenceAnnouncements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    return DEFAULT_ANNOUNCEMENTS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    startTime: "",
    returnDate: "",
    description: "",
  });

  // Toast message state
  const [toastMessage, setToastMessage] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setFormError("");
    setEditingId(null);
    setForm({
      reason: "",
      startDate: "",
      endDate: "",
      startTime: "",
      returnDate: "",
      description: "",
    });
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setFormError("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditClick = (item) => {
    setFormError("");
    setEditingId(item.id);
    setForm({
      reason: item.reason,
      startDate: item.startDate,
      endDate: item.endDate,
      startTime: item.startTime,
      returnDate: item.returnDate,
      description: item.description,
    });
    setIsAdding(false);
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    if (!form.reason || !form.startDate || !form.endDate || !form.startTime || !form.returnDate || !form.description) {
      setFormError("Please complete every announcement field before publishing.");
      return;
    }
    if (form.endDate < form.startDate) {
      setFormError("The end date cannot be earlier than the start date.");
      return;
    }
    if (form.returnDate < form.endDate) {
      setFormError("The expected return date cannot be earlier than the end date.");
      return;
    }
    setFormError("");

    if (editingId) {
      // Edit
      const updated = announcements.map((item) => {
        if (item.id === editingId) {
          return { ...item, ...form };
        }
        return item;
      });
      setAnnouncements(updated);
      localStorage.setItem("absenceAnnouncements", JSON.stringify(updated));
      localStorage.setItem("absenceAnnouncements_teacher@cit.edu", JSON.stringify(updated));
      setEditingId(null);
      triggerToast("Absence announcement updated!");
    } else {
      // Add new
      const newItem = {
        id: Date.now().toString(),
        ...form,
      };
      const updated = [...announcements, newItem];
      setAnnouncements(updated);
      localStorage.setItem("absenceAnnouncements", JSON.stringify(updated));
      localStorage.setItem("absenceAnnouncements_teacher@cit.edu", JSON.stringify(updated));
      
      // Append student notification
      const notifications = JSON.parse(localStorage.getItem("studentNotifications") || "[]");
      const newNotif = {
        id: Date.now(),
        message: `Josemarie C. Amparo posted an absence notice until ${form.returnDate}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        type: "absence",
        unread: true
      };
      localStorage.setItem("studentNotifications", JSON.stringify([newNotif, ...notifications]));

      setIsAdding(false);
      triggerToast("Absence announcement published!");
    }

    // Reset Form
    setForm({
      reason: "",
      startDate: "",
      endDate: "",
      startTime: "",
      returnDate: "",
      description: "",
    });
  };

  const handleDeleteAnnouncement = (id) => {
    const updated = announcements.filter((item) => item.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("absenceAnnouncements", JSON.stringify(updated));
    localStorage.setItem("absenceAnnouncements_teacher@cit.edu", JSON.stringify(updated));
    triggerToast("Absence announcement deleted.");
    setDeleteTarget(null);
  };

  return (
    <div className="absence-announcements-container">
      {/* Toast Banner */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete absence announcement?"
        message={deleteTarget ? `The “${deleteTarget.reason}” announcement will be permanently removed.` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteAnnouncement(deleteTarget.id)}
      />

      <div className="schedule-list-header">
        <h3 className="panel-title" style={{ margin: 0 }}>Absence Announcements</h3>
        {!isAdding && !editingId && (
          <button className="add-class-btn" onClick={handleOpenAdd}>
            + New Announcement
          </button>
        )}
      </div>
      <p className="absence-subtitle">
        Post extended absence notices visible immediately to students.
      </p>

      {/* Add / Edit Form Card */}
      {(isAdding || editingId) && (
        <form className="add-absence-form-card" onSubmit={handleSaveAnnouncement}>
          <div className="form-section-title">
            {editingId ? "Edit Absence Announcement" : "New Absence Announcement"}
          </div>
          <InlineFeedback>{formError}</InlineFeedback>

          <div className="schedule-form-grid">
            <div className="form-three-row">
              <div className="form-input-group">
                <label>Reason for Absence</label>
                <input 
                  type="text" 
                  name="reason"
                  className="form-input-field"
                  placeholder="e.g., Official Travel, Sick Leave"
                  value={form.reason}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate"
                  className="form-input-field"
                  value={form.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  name="endDate"
                  className="form-input-field"
                  value={form.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-two-row">
              <div className="form-input-group">
                <label>Start Time</label>
                <input 
                  type="text" 
                  name="startTime"
                  className="form-input-field"
                  placeholder="e.g., 08:00 AM"
                  value={form.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Expected Return Date</label>
                <input 
                  type="date" 
                  name="returnDate"
                  className="form-input-field"
                  value={form.returnDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-input-group form-full-row">
              <label>Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Brief description for students"
                value={form.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="form-publish-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
                Publish Announcement
              </button>
              <button type="button" className="form-cancel-btn" onClick={handleCancelForm}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="absence-list-wrapper">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <div key={item.id} className="absence-card-item">
              <div className="absence-card-left">
                <div className="absence-circle-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="absence-card-info">
                  <h4 className="absence-title">{item.reason}</h4>
                  <p className="absence-details-text">{item.description}</p>
                  
                  <div className="absence-meta-row">
                    <div className="absence-meta-item">
                      <span className="absence-meta-label">Absence Period:</span>
                      <span className="absence-meta-val">{item.startDate} &mdash; {item.endDate}</span>
                    </div>
                    <div className="absence-meta-item">
                      <span className="absence-meta-label">Expected Return:</span>
                      <span className="absence-meta-val">{item.returnDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absence-card-actions">
                <button 
                  className="action-icon-btn" 
                  onClick={() => handleEditClick(item)}
                  title="Edit Announcement"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button 
                  className="action-icon-btn delete" 
                  onClick={() => setDeleteTarget(item)}
                  title="Delete Announcement"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="empty-absence-box">
            <div className="empty-absence-icon">⚠️</div>
            <p className="empty-absence-title">No absence announcements posted</p>
            <p className="empty-absence-text">
              If you have planned leaves or conferences, click "New Announcement" above to notify your classes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AbsenceAnnouncements;
