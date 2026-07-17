import React, { useState, useEffect } from "react";
import "./StatusManagement.css";
import profImg from "../assets/images/josemarie.jpg";

function StatusManagement() {
  // Read initial states from localStorage if available
  const [selectedStatus, setSelectedStatus] = useState(() => {
    return localStorage.getItem("currentStatus") || "Available";
  });

  const [description, setDescription] = useState(() => {
    return localStorage.getItem("currentStatusDescription") || "In Office — NGE, CSS Department";
  });

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classesSchedule");
    return saved ? JSON.parse(saved) : [];
  });

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

  const handleStatusUpdate = () => {
    localStorage.setItem("currentStatus", selectedStatus);
    localStorage.setItem("currentStatusDescription", description);
    localStorage.setItem("statusLastUpdated", new Date().toISOString());
    triggerToast("Status updated successfully!");
  };

  // Class Schedule CRUD Actions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
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
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!form.subject || !form.section || !form.room || !form.startTime || !form.endTime) {
      alert("Please fill out all fields.");
      return;
    }

    if (editingId) {
      // Edit mode
      const updated = classes.map((item) => {
        if (item.id === editingId) {
          return { ...item, ...form };
        }
        return item;
      });
      setClasses(updated);
      localStorage.setItem("classesSchedule", JSON.stringify(updated));
      setEditingId(null);
      triggerToast("Class schedule updated!");
    } else {
      // Add mode
      const newClass = {
        id: Date.now(),
        ...form,
        completed: false,
      };
      const updated = [...classes, newClass];
      setClasses(updated);
      localStorage.setItem("classesSchedule", JSON.stringify(updated));
      setIsAdding(false);
      triggerToast("Class schedule added!");
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
    const updated = classes.filter((item) => item.id !== id);
    setClasses(updated);
    localStorage.setItem("classesSchedule", JSON.stringify(updated));
    triggerToast("Class schedule deleted.");
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
          <img src={profImg} alt="Josemarie C. Amparo" className="profile-avatar-img" />
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
                    onClick={() => handleDeleteClass(item.id)}
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
