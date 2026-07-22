import { useState, useEffect } from 'react';
import './StudentFacultyStatus.css';
import { useFacultyList } from '../hooks/useFacultyList';
import josemarieImg from '../assets/images/josemarie.jpg';
import leahImg from '../assets/images/leah.jpg';
import tulinImg from '../assets/images/tulin.jpg';
import ugangImg from '../assets/images/ugang.jpg';
import vonImg from '../assets/images/von.jpg';
import { scheduleApi } from '../api/scheduleApi';

const getFacultyAvatar = (email) => {
  switch (email) {
    case 'teacher@cit.edu':
      return josemarieImg;
    case 'leah.barbaso@cit.edu':
      return leahImg;
    case 'jasmine.tulin@cit.edu':
      return tulinImg;
    case 'roden.ugang@cit.edu':
      return ugangImg;
    case 'von.godinez@cit.edu':
      return vonImg;
    default:
      return null;
  }
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

const getClassStatus = (startTimeStr, endTimeStr) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/i);
    if (!match) {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
      return 0;
    }
    let [_, hours, minutes, ampm] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (ampm) {
      const isPM = ampm.toUpperCase() === "PM";
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    }
    return hours * 60 + minutes;
  };

  const startMinutes = parseTimeToMinutes(startTimeStr);
  const endMinutes = parseTimeToMinutes(endTimeStr);

  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
    return "Ongoing";
  } else if (currentMinutes > endMinutes) {
    return "Ended";
  } else {
    return "Upcoming";
  }
};

function StudentFacultyStatus() {
  const faculty = useFacultyList();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFacultyId, setSelectedFacultyId] = useState(() => faculty[0]?.id || null);
  const selectedFaculty = faculty.find((item) => item.id === selectedFacultyId) || faculty[0] || null;

  const [facultyClasses, setFacultyClasses] = useState([]);

  useEffect(() => {
    if (selectedFaculty && selectedFaculty.id) {
      scheduleApi.getSchedulesByFaculty(selectedFaculty.id)
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
              endTime: convertTo12Hour(item.endTime)
            };
          });
          setFacultyClasses(mapped);
        })
        .catch(err => {
          console.error("Failed to fetch faculty schedules:", err);
          setFacultyClasses([]);
        });
    } else {
      setFacultyClasses([]);
    }
  }, [selectedFacultyId, selectedFaculty]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available': return 'status-badge-available';
      case 'Busy': return 'status-badge-meeting';
      case 'InClass': return 'status-badge-class';
      case 'Out': return 'status-badge-out';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Available': return 'Available';
      case 'Busy': return 'Busy';
      case 'InClass': return 'Class Ongoing';
      case 'Out': return 'Do Not Disturb';
      default: return 'Available';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Available': return 'dot-Available';
      case 'Busy': return 'dot-Busy';
      case 'InClass': return 'dot-InClass';
      case 'Out': return 'dot-Out';
      default: return 'dot-Available';
    }
  };

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  // Filters logic
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.fullName.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "All") return matchesSearch;
    if (statusFilter === "Available") return matchesSearch && f.status === "Available";
    if (statusFilter === "InClass") return matchesSearch && f.status === "InClass";
    if (statusFilter === "Busy") return matchesSearch && f.status === "Busy";
    if (statusFilter === "Out") return matchesSearch && f.status === "Out";

    return matchesSearch;
  });

  return (
    <div className="faculty-status-container">
      {/* Search and Filters Section */}
      <div className="faculty-filter-bar">
        <div className="search-box-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search faculty name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-field"
          />
        </div>

        <div className="filter-tabs-wrapper">
          {["All", "Available", "InClass", "Busy", "Out"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`filter-tab-btn ${statusFilter === filter ? 'active-filter' : ''}`}
            >
              {filter === "All" ? "All" : getStatusLabel(filter)}
            </button>
          ))}
        </div>
        <span className="faculty-live-indicator"><span aria-hidden="true" />Live updates</span>
      </div>

      {/* Main Split Panels */}
      <div className="faculty-panels-layout">

        {/* Left Column: Faculty Directory Cards List */}
        <div className="faculty-list-panel">
          {filteredFaculty.length > 0 ? (
            <div className="faculty-cards-list">
              {filteredFaculty.map((item) => (
                <div
                  key={item.id}
                  className={`faculty-list-card ${selectedFaculty?.id === item.id ? 'active-card' : ''}`}
                  onClick={() => setSelectedFacultyId(item.id)}
                >
                  <div className="faculty-card-left">
                    <div className="avatar-container">
                      {getFacultyAvatar(item.email) ? (
                        <img src={getFacultyAvatar(item.email)} alt={item.fullName} className="faculty-card-avatar" />
                      ) : (
                        <div className="faculty-avatar-abbr">
                          {getInitials(item.fullName)}
                        </div>
                      )}
                      <span className={`avatar-status-dot ${getStatusDot(item.status)}`}></span>
                    </div>
                    <div className="faculty-card-main-info">
                      <h4 className="faculty-card-name">{item.fullName}</h4>
                      <span className="faculty-card-dept">{item.department}</span>
                    </div>
                  </div>

                  <span className={`faculty-status-badge ${getStatusBadgeClass(item.status)}`}>
                    <span className={`status-dot-indicator ${getStatusDot(item.status)}`}></span>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-search-state">
              <span className="empty-search-icon">🔍</span>
              <p className="empty-search-title">No faculty members found</p>
              <p className="empty-search-text">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Schedule Drawer */}
        <div className="faculty-detail-panel">
          {selectedFaculty ? (
            <div className="details-card-wrapper">
              <div className="details-header-section">
                {getFacultyAvatar(selectedFaculty.email) ? (
                  <img src={getFacultyAvatar(selectedFaculty.email)} alt={selectedFaculty.fullName} className="details-avatar-large" />
                ) : (
                  <div className="details-avatar-placeholder-large">
                    {getInitials(selectedFaculty.fullName)}
                  </div>
                )}
                <div className="details-meta-right">
                  <h3 className="details-faculty-name">{selectedFaculty.fullName}</h3>
                  <span className="details-faculty-id">ID: {selectedFaculty.idNumber}</span>

                  <div className="details-status-container">
                    <span className={`faculty-status-badge ${getStatusBadgeClass(selectedFaculty.status)}`}>
                      <span className={`status-dot-indicator ${getStatusDot(selectedFaculty.status)}`}></span>
                      {getStatusLabel(selectedFaculty.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="details-info-section">
                <div className="info-row-item">
                  <span className="info-row-label">Current Status Note</span>
                  <p className="info-row-value">{selectedFaculty.statusDescription || "No status description provided."}</p>
                </div>
                <div className="info-row-grid">
                  <div className="info-row-item">
                    <span className="info-row-label">Office / Room</span>
                    <p className="info-row-value">{selectedFaculty.room}</p>
                  </div>
                  <div className="info-row-item">
                    <span className="info-row-label">Email Contact</span>
                    <p className="info-row-value">{selectedFaculty.email}</p>
                  </div>
                </div>
              </div>

              {/* Today's class schedule list */}
              <div className="details-schedule-section">
                <h4 className="schedule-section-title">Class Schedule</h4>

                {facultyClasses.length > 0 ? (
                  <div className="details-classes-timeline">
                    {facultyClasses.map((item) => {
                      const classStatus = getClassStatus(item.startTime, item.endTime);
                      const isEnded = classStatus === 'Ended';
                      const isOngoing = classStatus === 'Ongoing';
                      return (
                        <div key={item.id} className={`timeline-class-item ${isEnded ? 'class-completed' : ''} ${isOngoing ? 'class-ongoing' : ''}`}>
                          <div className="timeline-class-left">
                            <span className="timeline-class-time">{item.startTime} - {item.endTime}</span>
                            <h5 className="timeline-class-subject">{item.subject}</h5>
                            <span className="timeline-class-meta">Section: {item.section} · Room: {item.room}</span>
                          </div>
                          <div className={`timeline-status-badge ${
                            isOngoing ? 'ongoing-badge' : 
                            isEnded ? 'completed-badge' : 'pending-badge'
                          }`}>
                            {classStatus}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-classes-box">
                    <div className="empty-classes-icon">📅</div>
                    <p className="empty-classes-title">No Class Schedules Today</p>
                    <p className="empty-classes-text">This instructor has no scheduled teaching hours configured for today.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="empty-detail-state">
              <span className="empty-detail-state-icon">👤</span>
              <p className="empty-detail-state-title">Select an Instructor</p>
              <p className="empty-detail-state-text">Choose a faculty member from the directory list on the left to see their daily schedules, contact details, and locations.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentFacultyStatus;
