import { useState, useEffect } from "react";
import "./StatusManagement.css";
import { notifyFacultyStatusUpdated } from "../hooks/useFacultyList";
import { facultyApi } from "../api/facultyApi";

import josemarieImg from "../assets/images/josemarie.jpg";
import leahImg from "../assets/images/leah.jpg";
import tulinImg from "../assets/images/tulin.jpg";
import ugangImg from "../assets/images/ugang.jpg";
import vonImg from "../assets/images/von.jpg";

const facultyImages = {
  "josemarie.amparo@cit.edu": josemarieImg,
  "leah.barbaso@cit.edu": leahImg,
  "jasmine.tulin@cit.edu": tulinImg,
  "roden.ugang@cit.edu": ugangImg,
  "von.godinez@cit.edu": vonImg,
};

function StatusManagement() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const facultyName = currentUser?.fullName || "Josemarie C. Amparo";
  const profileImg = facultyImages[currentUser?.email] || josemarieImg;
  const facultyId = currentUser?.id;

  const [selectedStatus, setSelectedStatus] = useState("Available");
  const [description, setDescription] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch status on load
  useEffect(() => {
    if (facultyId) {
      facultyApi.findById(facultyId)
        .then(data => {
          setSelectedStatus(data.status || "Available");
          setDescription(data.statusDescription || "");
        })
        .catch(err => {
          console.error("Failed to load status from server:", err);
        });
    }
  }, [facultyId]);

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

  // Status Selector options mapping
  const statusOptions = [
    { id: "Available", label: "Available" },
    { id: "InClass", label: "In Class" },
    { id: "Busy", label: "Busy" },
    { id: "Out", label: "Do Not Disturb" },
  ];

  const handleStatusSelect = (id) => {
    setSelectedStatus(id);
  };

  const handleStatusUpdate = async () => {
    try {
      if (facultyId) {
        const backendStatus = selectedStatus === "InClass" ? "IN_CLASS" : selectedStatus.toUpperCase();
        
        await facultyApi.updateStatus(facultyId, {
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

    triggerToast("Status updated successfully!");
  };

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
      case "Out": return "Do Not Disturb";
      default: return "Available";
    }
  };

  return (
    <div className="status-management-container">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}

      {/* Update Status Panel */}
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
    </div>
  );
}

export default StatusManagement;
