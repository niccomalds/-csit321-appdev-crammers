import { useState, useEffect } from "react";
import "./ClassSchedules.css";
import { ConfirmDialog, InlineFeedback } from "../components/Feedback";
import { scheduleApi } from "../api/scheduleApi";

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "00:00";
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
  if (!match) {
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    return "00:00";
  }
  let [_, hours, minutes, ampm] = match;
  hours = parseInt(hours, 10);
  if (ampm) {
    const isPM = ampm.toUpperCase() === "PM";
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const convertTo12Hour = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const formatDayDisplay = (day) => {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
};

function ClassSchedules() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const facultyId = currentUser?.id;
  const facultyName = currentUser?.fullName || "Josemarie C. Amparo";

  const [schedules, setSchedules] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    subject: "",
    section: "",
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    room: "",
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (facultyId) {
      scheduleApi.getSchedulesByFaculty(facultyId)
        .then(data => {
          const mapped = data.map(item => {
            const match = item.subjectName.match(/^(.*?)\s*\((.*?)\)$/);
            const subject = match ? match[1] : item.subjectName;
            const section = match ? match[2] : "";
            return {
              id: item.id,
              subject,
              section,
              dayOfWeek: item.dayOfWeek,
              room: item.room,
              startTime: convertTo12Hour(item.startTime),
              endTime: convertTo12Hour(item.endTime),
            };
          });
          setSchedules(mapped);
        })
        .catch(err => {
          console.error("Failed to load class schedules:", err);
        });
    }
  }, [facultyId]);

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
      subject: "",
      section: "",
      dayOfWeek: "MONDAY",
      startTime: "",
      endTime: "",
      room: "",
    });
    setIsAdding(true);
  };

  const handleEditClick = (item) => {
    setFormError("");
    setEditingId(item.id);
    setForm({
      subject: item.subject,
      section: item.section,
      dayOfWeek: item.dayOfWeek.toUpperCase(),
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
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
    if (!form.subject || !form.section || !form.room || !form.startTime || !form.endTime) {
      setFormError("Please complete all class schedule fields before saving.");
      return;
    }
    if (!form.startTime.includes(":") || !form.endTime.includes(":")) {
      setFormError("Time format must be valid (e.g. 07:30 AM)");
      return;
    }
    setFormError("");

    const requestData = {
      subjectName: `${form.subject} (${form.section})`,
      dayOfWeek: form.dayOfWeek,
      startTime: convertTo24Hour(form.startTime),
      endTime: convertTo24Hour(form.endTime),
      room: form.room
    };

    if (editingId) {
      scheduleApi.updateSchedule(editingId, requestData)
        .then(updatedItem => {
          const match = updatedItem.subjectName.match(/^(.*?)\s*\((.*?)\)$/);
          const subject = match ? match[1] : updatedItem.subjectName;
          const section = match ? match[2] : "";
          const mapped = {
            id: updatedItem.id,
            subject,
            section,
            dayOfWeek: updatedItem.dayOfWeek,
            room: updatedItem.room,
            startTime: convertTo12Hour(updatedItem.startTime),
            endTime: convertTo12Hour(updatedItem.endTime)
          };
          setSchedules(prev => prev.map(item => item.id === editingId ? mapped : item));
          setEditingId(null);
          triggerToast("Class schedule updated!");
        })
        .catch(err => {
          console.error("Failed to update class schedule:", err);
          setFormError(err.response?.data?.message || "Failed to update schedule on server.");
        });
    } else {
      scheduleApi.createSchedule(facultyId, requestData)
        .then(newItem => {
          const match = newItem.subjectName.match(/^(.*?)\s*\((.*?)\)$/);
          const subject = match ? match[1] : newItem.subjectName;
          const section = match ? match[2] : "";
          const mapped = {
            id: newItem.id,
            subject,
            section,
            dayOfWeek: newItem.dayOfWeek,
            room: newItem.room,
            startTime: convertTo12Hour(newItem.startTime),
            endTime: convertTo12Hour(newItem.endTime)
          };
          setSchedules(prev => [...prev, mapped]);
          setIsAdding(false);
          triggerToast("Class schedule added!");
        })
        .catch(err => {
          console.error("Failed to add class schedule:", err);
          setFormError(err.response?.data?.message || "Failed to save schedule to server.");
        });
    }

    setForm({
      subject: "",
      section: "",
      dayOfWeek: "MONDAY",
      startTime: "",
      endTime: "",
      room: "",
    });
  };

  const handleDeleteSchedule = (id) => {
    scheduleApi.deleteSchedule(id)
      .then(() => {
        setSchedules(prev => prev.filter((item) => item.id !== id));
        triggerToast("Class schedule deleted.");
        setDeleteTarget(null);
      })
      .catch(err => {
        console.error("Failed to delete schedule:", err);
        triggerToast("Failed to delete schedule from server.");
      });
  };

  const daysOfWeek = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" }
  ];

  const getDayAbbr = (day) => {
    if (!day) return "";
    return day.slice(0, 2).toUpperCase();
  };

  return (
    <div className="class-schedules-container">
      {toastMessage && <div className="toast-success">{toastMessage}</div>}
      
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete class schedule?"
        message={deleteTarget ? `${deleteTarget.subject} (${deleteTarget.section}) will be permanently removed.` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteSchedule(deleteTarget.id)}
      />

      <div className="schedule-list-header">
        <h3 className="panel-title" style={{ margin: 0 }}>Weekly Class Schedules</h3>
        {!isAdding && !editingId && (
          <button className="add-class-btn" onClick={handleOpenAdd}>
            + Add Schedule
          </button>
        )}
      </div>
      <p className="consultation-subtitle">
        Manage your teaching schedules visible to students.
      </p>

      {/* Add / Edit Form Card */}
      {(isAdding || editingId) && (
        <form className="add-schedule-form-card" onSubmit={handleSaveSchedule}>
          <div className="form-section-title">
            {editingId ? "Edit Class Schedule" : "New Class Schedule"}
          </div>
          <InlineFeedback>{formError}</InlineFeedback>
          
          <div className="schedule-form-grid">
            <div className="form-group-row">
              <div className="form-input-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  className="form-input-field"
                  placeholder="e.g., Web Application Development"
                  value={form.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Section</label>
                <input 
                  type="text" 
                  name="section"
                  className="form-input-field"
                  placeholder="e.g., BSIT 3-G5"
                  value={form.section}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-input-group">
                <label>Day of Week</label>
                <select 
                  name="dayOfWeek" 
                  className="select-input-field"
                  value={form.dayOfWeek}
                  onChange={handleInputChange}
                  required
                >
                  {daysOfWeek.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-input-group">
                <label>Room / Laboratory</label>
                <input 
                  type="text" 
                  name="room"
                  className="form-input-field"
                  placeholder="e.g., RTL 302"
                  value={form.room}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-input-group">
                <label>Start Time</label>
                <input 
                  type="text" 
                  name="startTime"
                  className="form-input-field"
                  placeholder="e.g., 07:30 AM"
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
                  placeholder="e.g., 09:00 AM"
                  value={form.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                  {getDayAbbr(item.dayOfWeek)}
                </div>
                <div className="schedule-card-info">
                  <div className="schedule-day-row">
                    <span className="schedule-day-name">{formatDayDisplay(item.dayOfWeek)}</span>
                    <span className="mode-pill-badge mode-pill-f2f">
                      {item.room}
                    </span>
                  </div>
                  <p className="schedule-time-row">
                    {item.subject} ({item.section})
                  </p>
                  <p className="schedule-location-row">
                    {item.startTime} – {item.endTime}
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
          <div className="empty-schedule-box">
            <div className="empty-schedule-icon">📅</div>
            <p className="empty-schedule-title">No class schedules configured</p>
            <p className="empty-schedule-text">
              Configure your weekly teaching sessions here. They will appear on the students' status tracking dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassSchedules;
