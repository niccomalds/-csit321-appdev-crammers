import { useState, useEffect } from "react";
import "./ConsultationSchedule.css";
import { ConfirmDialog, InlineFeedback } from "../components/Feedback";
import { consultationScheduleApi } from "../api/consultationScheduleApi";

function ConsultationSchedule() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const facultyId = currentUser?.id;
  const facultyName = currentUser?.fullName || "Josemarie C. Amparo";

  const [schedules, setSchedules] = useState([]);

  // Fetch schedules from backend
  useEffect(() => {
    if (facultyId) {
      consultationScheduleApi.getSchedulesByFaculty(facultyId)
        .then(data => {
          setSchedules(data);
        })
        .catch(err => {
          console.error("Failed to load consultation schedules:", err);
        });
    }
  }, [facultyId]);

  // Form toggles & state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    day: "Monday",
    mode: "Face-to-Face",
    startTime: "",
    endTime: "",
    location: "",
  });

  // Toast state
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

  const getDayAbbr = (day) => {
    if (!day) return "";
    return day.slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setFormError("");
    setEditingId(null);
    setForm({
      day: "Monday",
      mode: "Face-to-Face",
      startTime: "",
      endTime: "",
      location: "",
    });
    setIsAdding(true);
  };

  const handleEditClick = (item) => {
    setFormError("");
    setEditingId(item.id);
    setForm({
      day: item.day,
      mode: item.mode,
      startTime: item.startTime,
      endTime: item.endTime,
      location: item.location,
    });
    setIsAdding(false);
  };

  const handleCancelForm = () => {
    setFormError("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!form.day || !form.mode || !form.startTime || !form.endTime || !form.location) {
      setFormError("Please complete every consultation schedule field before saving.");
      return;
    }
    setFormError("");

    const requestData = {
      day: form.day,
      mode: form.mode,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location
    };

    if (editingId) {
      // Edit mode (Backend PUT)
      consultationScheduleApi.updateSchedule(editingId, requestData)
        .then(updatedItem => {
          setSchedules(prev => prev.map(item => item.id === editingId ? updatedItem : item));
          setEditingId(null);
          triggerToast("Consultation schedule updated!");
        })
        .catch(err => {
          console.error("Failed to update consultation schedule:", err);
          setFormError(err.response?.data?.message || "Failed to update schedule on server.");
        });
    } else {
      // Add mode (Backend POST)
      consultationScheduleApi.createSchedule(facultyId, requestData)
        .then(newItem => {
          setSchedules(prev => [...prev, newItem]);
          setIsAdding(false);
          triggerToast("Consultation schedule added!");
        })
        .catch(err => {
          console.error("Failed to add consultation schedule:", err);
          setFormError(err.response?.data?.message || "Failed to save schedule to server.");
        });
    }

    // Reset Form
    setForm({
      day: "Monday",
      mode: "Face-to-Face",
      startTime: "",
      endTime: "",
      location: "",
    });
  };

  const handleDeleteSchedule = (id) => {
    consultationScheduleApi.deleteSchedule(id)
      .then(() => {
        setSchedules(prev => prev.filter((item) => item.id !== id));
        triggerToast("Consultation schedule deleted.");
        setDeleteTarget(null);
      })
      .catch(err => {
        console.error("Failed to delete schedule:", err);
        triggerToast("Failed to delete schedule from server.");
      });
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const consultationModes = ["Face-to-Face", "Online"];

  return (
    <div className="consultation-schedule-container">
      {/* Toast Alert */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete consultation schedule?"
        message={deleteTarget ? `${deleteTarget.day}, ${deleteTarget.startTime}–${deleteTarget.endTime} will be permanently removed.` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteSchedule(deleteTarget.id)}
      />

      <div className="schedule-list-header">
        <h3 className="panel-title" style={{ margin: 0 }}>Weekly Consultation Schedules</h3>
        {!isAdding && !editingId && (
          <button className="add-class-btn" onClick={handleOpenAdd}>
            + Add Schedule
          </button>
        )}
      </div>
      <p className="consultation-subtitle">
        Manage your weekly consultation hours visible to students.
      </p>

      {/* Add / Edit Schedule Form */}
      {(isAdding || editingId) && (
        <form className="add-schedule-form-card" onSubmit={handleSaveSchedule}>
          <div className="form-section-title">
            {editingId ? "Edit Consultation Schedule" : "New Consultation Schedule"}
          </div>
          <InlineFeedback>{formError}</InlineFeedback>
          
          <div className="schedule-form-grid">
            <div className="form-group-row">
              <div className="form-input-group">
                <label>Day</label>
                <select 
                  name="day" 
                  className="select-input-field"
                  value={form.day}
                  onChange={handleInputChange}
                  required
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-input-group">
                <label>Consultation Mode</label>
                <select 
                  name="mode" 
                  className="select-input-field"
                  value={form.mode}
                  onChange={handleInputChange}
                  required
                >
                  {consultationModes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-input-group">
                <label>Start Time</label>
                <input 
                  type="text" 
                  name="startTime"
                  className="form-input-field"
                  placeholder="e.g., 09:00 AM"
                  value={form.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-group">
                <label>End Time</label>
                <input 
                  type="text" 
                  name="endTime"
                  className="form-input-field"
                  placeholder="e.g., 11:00 AM"
                  value={form.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-input-group form-full-row">
              <label>Office / Meeting Location</label>
              <input 
                type="text" 
                name="location"
                className="form-input-field"
                placeholder="e.g., CSS Dept. Faculty Room or MS Teams"
                value={form.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="form-save-btn">Save</button>
              <button type="button" className="form-cancel-btn" onClick={handleCancelForm}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Schedules List */}
      <div className="consultation-list-wrapper">
        {schedules.length > 0 ? (
          schedules.map((item) => (
            <div key={item.id} className="schedule-card-item">
              <div className="schedule-card-left">
                <div className="schedule-day-badge">
                  {getDayAbbr(item.day)}
                </div>
                <div className="schedule-card-info">
                  <div className="schedule-day-row">
                    <span className="schedule-day-name">{item.day}</span>
                    <span className={`mode-pill-badge ${item.mode === "Online" ? "mode-pill-online" : "mode-pill-f2f"}`}>
                      {item.mode === "Online" ? "Online" : "Face-to-Face"}
                    </span>
                  </div>
                  <p className="schedule-time-row">
                    {item.startTime} – {item.endTime}
                  </p>
                  <p className="schedule-location-row">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="schedule-card-actions">
                <button 
                  className="action-icon-btn" 
                  onClick={() => handleEditClick(item)}
                  title="Edit Schedule"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button 
                  className="action-icon-btn delete" 
                  onClick={() => setDeleteTarget(item)}
                  title="Delete Schedule"
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
          <div className="empty-schedule-box">
            <div className="empty-schedule-icon">📅</div>
            <p className="empty-schedule-title">No consultation hours scheduled</p>
            <p className="empty-schedule-text">
              Configure your weekly consultation slots to let students know when you are available for academic advising.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationSchedule;
