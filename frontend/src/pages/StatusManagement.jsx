import { useState, useEffect } from "react";
import "./StatusManagement.css";
import { ConfirmDialog, InlineFeedback } from "../components/Feedback";
import { notifyFacultyStatusUpdated } from "../hooks/useFacultyList";
import { facultyApi } from "../api/facultyApi";
import { scheduleApi } from "../api/scheduleApi";

import josemarieImg from "../assets/images/josemarie.jpg";
import leahImg from "../assets/images/leah.jpg";
import tulinImg from "../assets/images/tulin.jpg";
import ugangImg from "../assets/images/ugang.jpg";
import vonImg from "../assets/images/von.jpg";

const facultyImages = {
  "teacher@cit.edu": josemarieImg,
  "leah.barbaso@cit.edu": leahImg,
  "jasmine.tulin@cit.edu": tulinImg,
  "roden.ugang@cit.edu": ugangImg,
  "von.godinez@cit.edu": vonImg,
};

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

function StatusManagement() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const facultyName = currentUser?.fullName || "Josemarie C. Amparo";
  const profileImg = facultyImages[currentUser?.email] || josemarieImg;
  const facultyId = currentUser?.id;

  const [selectedStatus, setSelectedStatus] = useState("Available");
  const [description, setDescription] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (facultyId) {
      // 1. Fetch live status
      facultyApi.findById(facultyId)
        .then(data => {
          const statusMap = {
            AVAILABLE: "Available",
            IN_CLASS: "InClass",
            BUSY: "Busy",
            OUT: "Out"
          };
          setSelectedStatus(statusMap[data.status] || "Available");
          setDescription(data.statusDescription || "");
        })
        .catch(err => {
          console.error("Failed to load status from server:", err);
        });

      // 2. Fetch schedules
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
              room: item.room,
              startTime: convertTo12Hour(item.startTime),
              endTime: convertTo12Hour(item.endTime),
              completed: false
            };
          });
          setClasses(mapped);
        })
        .catch(err => {
          console.error("Failed to load schedules:", err);
        });
    }
  }, [facultyId]);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    subject: "",
    section: "",
    room: "",
    startTime: "",
    endTime: "",
  });

  // Success toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Auto-dismiss toast
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

  const getFormattedDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  // Status Selector options mapping
  const statusOptions = [
    { id: "Available", label: "Available" },
    { id: "InClass", label: "In Class" },
    { id: "Busy", label: "Busy" },
    { id: "Out", label: "Out" },
  ];

  const handleStatusSelect = (id) => {
    setSelectedStatus(id);
  };

  const handleStatusUpdate = async () => {
    // Send status update request to Spring Boot backend
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (currentUser && currentUser.id) {
        const backendStatus = selectedStatus === "InClass" ? "IN_CLASS" : selectedStatus.toUpperCase();
        
        await facultyApi.updateStatus(currentUser.id, {
          status: backendStatus,
          description: description,
          room: "CSS Dept. Faculty Room"
        });
      }
    } catch (err) {
      console.error("Failed to update status on backend database:", err);
    }

    localStorage.setItem("currentStatus", selectedStatus);
    localStorage.setItem("currentStatusDescription", description);
    localStorage.setItem("statusLastUpdated", new Date().toISOString());

    // Sync to facultyList in localStorage
    const listStr = localStorage.getItem("facultyList");
    if (listStr) {
      const list = JSON.parse(listStr);
      const updated = list.map((f) => {
        if (f.email === currentUser?.email) {
          return { ...f, status: selectedStatus, statusDescription: description };
        }
        return f;
      });
      localStorage.setItem("facultyList", JSON.stringify(updated));
      notifyFacultyStatusUpdated();
    }

    // Append to studentNotifications
    const labelMap = {
      Available: "Available",
      InClass: "Class Ongoing",
      Busy: "In a Meeting",
      Out: "Out of Office"
    };
    const notifications = JSON.parse(localStorage.getItem("studentNotifications") || "[]");
    const newNotif = {
      id: Date.now(),
      message: `${facultyName} changed status to ${labelMap[selectedStatus] || selectedStatus}${description ? ' — ' + description : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      type: "status",
      unread: true
    };
    localStorage.setItem("studentNotifications", JSON.stringify([newNotif, ...notifications]));

    triggerToast("Status updated successfully!");
  };

  // Class Schedule CRUD Actions
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
      room: "",
      startTime: "",
      endTime: "",
    });
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setFormError("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!form.subject || !form.section || !form.room || !form.startTime || !form.endTime) {
      setFormError("All class schedule fields are required.");
      return;
    }
    if (!form.startTime.includes(":") || !form.endTime.includes(":")) {
      setFormError("Time format must be valid (e.g. 07:30 AM)");
      return;
    }
    setFormError("");

    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const dayOfWeek = days[new Date().getDay()];

    const requestData = {
      subjectName: `${form.subject} (${form.section})`,
      dayOfWeek: dayOfWeek,
      startTime: convertTo24Hour(form.startTime),
      endTime: convertTo24Hour(form.endTime),
      room: form.room
    };

    if (editingId) {
      // Edit mode (Backend PUT)
      scheduleApi.updateSchedule(editingId, requestData)
        .then(updatedItem => {
          const match = updatedItem.subjectName.match(/^(.*?)\s*\((.*?)\)$/);
          const subject = match ? match[1] : updatedItem.subjectName;
          const section = match ? match[2] : "";
          const mapped = {
            id: updatedItem.id,
            subject,
            section,
            room: updatedItem.room,
            startTime: convertTo12Hour(updatedItem.startTime),
            endTime: convertTo12Hour(updatedItem.endTime),
            completed: false
          };
          setClasses(prev => prev.map(item => item.id === editingId ? mapped : item));
          setEditingId(null);
          triggerToast("Class schedule updated!");
        })
        .catch(err => {
          console.error("Failed to update class schedule:", err);
          setFormError(err.response?.data?.message || "Failed to update schedule on server.");
        });
    } else {
      // Add mode (Backend POST)
      scheduleApi.createSchedule(facultyId, requestData)
        .then(newItem => {
          const match = newItem.subjectName.match(/^(.*?)\s*\((.*?)\)$/);
          const subject = match ? match[1] : newItem.subjectName;
          const section = match ? match[2] : "";
          const mapped = {
            id: newItem.id,
            subject,
            section,
            room: newItem.room,
            startTime: convertTo12Hour(newItem.startTime),
            endTime: convertTo12Hour(newItem.endTime),
            completed: false
          };
          setClasses(prev => [...prev, mapped]);
          setIsAdding(false);
          triggerToast("Class schedule added!");
        })
        .catch(err => {
          console.error("Failed to add class schedule:", err);
          setFormError(err.response?.data?.message || "Failed to save schedule to server.");
        });
    }

    // Reset form
    setForm({
      subject: "",
      section: "",
      room: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleEditClick = (item) => {
    setFormError("");
    setEditingId(item.id);
    setForm({
      subject: item.subject,
      section: item.section,
      room: item.room,
      startTime: item.startTime,
      endTime: item.endTime,
    });
    setIsAdding(false);
  };

  const handleDeleteClass = (id) => {
    scheduleApi.deleteSchedule(id)
      .then(() => {
        setClasses(prev => prev.filter((item) => item.id !== id));
        triggerToast("Class schedule deleted.");
        setDeleteTarget(null);
      })
      .catch(err => {
        console.error("Failed to delete schedule:", err);
        triggerToast("Failed to delete schedule from server.");
      });
  };

  const handleToggleComplete = (id) => {
    const updated = classes.map((item) => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setClasses(updated);
    localStorage.setItem("classesSchedule", JSON.stringify(updated));
  };

  // Map selected status ID to friendly label for current dot color
  const getStatusColorClass = (statusId) => {
    switch (statusId) {
      case "Available": return "#10b981"; // green
      case "InClass": return "#f59e0b"; // gold
      case "Busy": return "#3b82f6"; // blue
      case "Out": return "#ef4444"; // red
      default: return "#10b981";
    }
  };

  const getStatusLabel = (statusId) => {
    switch (statusId) {
      case "Available": return "Available";
      case "InClass": return "In Class";
      case "Busy": return "Busy";
      case "Out": return "Out";
      default: return "Available";
    }
  };

  return (
    <div className="status-management-container">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete class schedule?"
        message={deleteTarget ? `${deleteTarget.subject} (${deleteTarget.section}) will be permanently removed.` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteClass(deleteTarget.id)}
      />

      {/* Left Panel: Update Status */}
      <div className="panel">
        <div className="panel-header" style={{ marginBottom: 16 }}>
          <h3 className="panel-title">Update Your Status</h3>
        </div>
        <p className="panel-subtext" style={{ marginTop: -14, marginBottom: 20 }}>
          Choose your current availability for students.
        </p>

        {/* Profile Headshot & Dot */}
        <div className="avatar-wrapper">
          <img src={profileImg} alt={facultyName} className="profile-avatar-img" />
          <div 
            className="status-dot-indicator" 
            style={{ backgroundColor: getStatusColorClass(selectedStatus) }}
          />
          <div className="current-status-wrapper">
            <div 
              className="card-status-badge" 
              style={{ 
                backgroundColor: selectedStatus === "Available" ? "#e6f7ec" : 
                                 selectedStatus === "InClass" ? "#fef3c7" : 
                                 selectedStatus === "Busy" ? "#eff6ff" : "#fef2f2",
                color: selectedStatus === "Available" ? "#15803d" : 
                       selectedStatus === "InClass" ? "#92400e" : 
                       selectedStatus === "Busy" ? "#1d4ed8" : "#b91c1c",
                marginTop: 10,
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <span 
                className="badge-dot" 
                style={{ backgroundColor: getStatusColorClass(selectedStatus) }}
              />
              {getStatusLabel(selectedStatus)}
            </div>
          </div>
        </div>

        {/* Set Status Selection Buttons */}
        <div className="description-input-group" style={{ marginBottom: 0 }}>
          <label>Set New Status</label>
        </div>
        <div className="status-selectors">
          {statusOptions.map((opt) => (
            <div 
              key={opt.id} 
              className={`status-option-card ${selectedStatus === opt.id ? `selected-${opt.id}` : ""}`}
              onClick={() => handleStatusSelect(opt.id)}
            >
              <span className={`selector-dot dot-${opt.id}`} />
              {opt.label}
            </div>
          ))}
        </div>

        {/* Description Field */}
        <div className="description-input-group">
          <label>Description</label>
          <input 
            type="text" 
            className="description-input-field" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specify location or detail (e.g. In Room 301, Busy grading)"
          />
        </div>

        <button className="update-status-btn" onClick={handleStatusUpdate}>
          Update Status
        </button>
        <span className="update-note">Your updated status will immediately appear on the student portal</span>
      </div>

      {/* Right Panel: Class Schedule */}
      <div className="panel">
        <div className="schedule-header">
          <h3 className="panel-title">Today's Class Schedule</h3>
          {!isAdding && !editingId && (
            <button className="add-class-btn" onClick={handleOpenAdd}>
              Add Class
            </button>
          )}
        </div>
        <p className="panel-subtext" style={{ marginTop: -20, marginBottom: 24, textAlign: "left" }}>
          {getFormattedDate()}
        </p>

        {/* Add/Edit Class Form */}
        {(isAdding || editingId) && (
          <form className="new-class-form-card" onSubmit={handleSaveClass}>
            <div className="form-title">{editingId ? "Edit Class" : "New Class"}</div>
            <InlineFeedback>{formError}</InlineFeedback>
            
            <div className="form-input-group">
              <label>Subject</label>
              <input 
                type="text" 
                name="subject"
                className="form-input-field"
                placeholder="e.g., Data Structures & Algorithm"
                value={form.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group-row">
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
              <div className="form-input-group">
                <label>Room</label>
                <input 
                  type="text" 
                  name="room"
                  className="form-input-field"
                  placeholder="e.g., RTL300"
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
          </form>
        )}

        {/* Classes List */}
        <div className="consultation-list" style={{ gap: 12 }}>
          {classes.length > 0 ? (
            classes.map((item) => (
              <div key={item.id} className="class-schedule-item">
                <div className="class-schedule-left">
                  {/* Mark complete checklist circle */}
                  <div 
                    className={`radio-circle-placeholder ${item.completed ? "completed" : ""}`}
                    onClick={() => handleToggleComplete(item.id)}
                    title="Toggle class status"
                  />
                  <div className="class-schedule-info">
                    <span 
                      className="class-subject-title"
                      style={{ textDecoration: item.completed ? "line-through" : "none", opacity: item.completed ? 0.6 : 1 }}
                    >
                      {item.subject}
                    </span>
                    <span className="class-meta-details">
                      {item.section} &nbsp;&bull;&nbsp; {item.startTime}–{item.endTime} &nbsp;&bull;&nbsp; {item.room}
                    </span>
                  </div>
                </div>

                <div className="class-schedule-actions">
                  <button 
                    className="action-icon-btn" 
                    onClick={() => handleEditClick(item)}
                    title="Edit Class"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button 
                    className="action-icon-btn delete" 
                    onClick={() => setDeleteTarget(item)}
                    title="Delete Class"
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
            <div className="empty-schedule-state">
              <div className="empty-schedule-icon">📅</div>
              <p className="empty-schedule-title">No class schedules today</p>
              <p className="empty-schedule-text">
                Your schedule is clear. Click "Add Class" above to set your teaching hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatusManagement;
