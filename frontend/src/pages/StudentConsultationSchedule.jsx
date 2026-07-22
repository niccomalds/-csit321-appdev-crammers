import React, { useState, useEffect } from 'react';
import './StudentConsultationSchedule.css';
import { consultationScheduleApi } from '../api/consultationScheduleApi';
import josemarieImg from '../assets/images/josemarie.jpg';
import leahImg from '../assets/images/leah.jpg';
import tulinImg from '../assets/images/tulin.jpg';
import ugangImg from '../assets/images/ugang.jpg';
import vonImg from '../assets/images/von.jpg';

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

function StudentConsultationSchedule() {
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const list = localStorage.getItem("facultyList");
    if (list) {
      const parsed = JSON.parse(list);
      setFaculty(parsed);
      if (parsed.length > 0) {
        setSelectedFaculty(parsed[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedFaculty) {
      setConsultations([]);
      return;
    }
    consultationScheduleApi.getSchedulesByFaculty(selectedFaculty.id)
      .then(data => {
        setConsultations(data);
      })
      .catch(err => {
        console.error("Failed to load consultation schedules:", err);
        setConsultations([]);
      });
  }, [selectedFaculty]);

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Available': return 'Available';
      case 'Busy': return 'In a Meeting';
      case 'InClass': return 'Class Ongoing';
      case 'Out': return 'Out of Office';
      default: return 'Available';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Available': return 'status-available';
      case 'Busy': return 'status-busy';
      case 'InClass': return 'status-class';
      case 'Out': return 'status-out';
      default: return 'status-available';
    }
  };

  // Filtered faculty list based on search query
  const filteredFaculty = faculty.filter(f => 
    f.fullName.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-consultation-container">
      {/* Search and Split Layout */}
      <div className="consultation-split-layout">
        
        {/* Left Side: Faculty Search & List */}
        <div className="consultation-list-column">
          <div className="search-box-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search faculty..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-field"
            />
          </div>

          <div className="faculty-scroll-list">
            {filteredFaculty.length > 0 ? (
              filteredFaculty.map((f) => {
                const isSelected = selectedFaculty?.id === f.id;
                return (
                  <div 
                    key={f.id} 
                    className={`faculty-consult-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedFaculty(f)}
                  >
                    <div className="avatar-container">
                      {getFacultyAvatar(f.email) ? (
                        <img src={getFacultyAvatar(f.email)} alt={f.fullName} className="avatar-img" />
                      ) : (
                        <div className="avatar-placeholder">
                          {getInitials(f.fullName)}
                        </div>
                      )}
                      {/* Status indicator dot over avatar */}
                      <span className={`avatar-status-dot dot-${f.status}`}></span>
                    </div>
                    <div className="faculty-meta">
                      <h4 className="faculty-name">{f.fullName}</h4>
                      <p className="faculty-dept">{f.department}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-search-text-box">
                No faculty members found.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Consultation Details Panel */}
        <div className="consultation-details-column">
          {selectedFaculty ? (
            <div className="details-panel-wrapper">
              
              {/* Profile details header card */}
              <div className="faculty-profile-banner-card">
                <div className="banner-top-green"></div>
                <div className="banner-bottom-info">
                  {getFacultyAvatar(selectedFaculty.email) ? (
                    <img src={getFacultyAvatar(selectedFaculty.email)} alt={selectedFaculty.fullName} className="banner-avatar-img" />
                  ) : (
                    <div className="banner-avatar-placeholder">
                      {getInitials(selectedFaculty.fullName)}
                    </div>
                  )}

                  <div className="banner-texts-row">
                    <div className="texts-left">
                      <h3 className="banner-faculty-name">{selectedFaculty.fullName}</h3>
                      <p className="banner-faculty-title">
                        {selectedFaculty.email === "teacher@cit.edu" ? "Associate Professor" : "Assistant Professor"} · {selectedFaculty.department}
                      </p>
                      
                      <div className="banner-office-row">
                        <span className="office-label">{selectedFaculty.room}</span>
                        {/* Mail Envelope Icon */}
                        <a href={`mailto:${selectedFaculty.email}`} className="email-link-btn" title={`Mail ${selectedFaculty.fullName}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="badge-right">
                      <span className={`faculty-status-pill ${getStatusClass(selectedFaculty.status)}`}>
                        <span className="status-dot"></span>
                        {getStatusLabel(selectedFaculty.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Hours Table Card */}
              <div className="consultation-hours-card">
                <div className="card-header-bar">
                  <h3 className="card-title">Consultation Hours</h3>
                </div>
                
                <div className="table-responsive-wrapper">
                  {consultations.length > 0 ? (
                    <table className="consult-schedules-table">
                      <thead>
                        <tr>
                          <th>DAY</th>
                          <th>TIME</th>
                          <th>MODE</th>
                          <th>LOCATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((item) => (
                          <tr key={item.id}>
                            <td className="table-day-cell">{item.day ? item.day.toUpperCase() : ""}</td>
                            <td className="table-time-cell">{item.startTime} – {item.endTime}</td>
                            <td className="table-mode-cell">
                              <span className={`mode-badge-pill ${item.mode === "Online" ? "online" : "f2f"}`}>
                                {item.mode}
                              </span>
                            </td>
                            <td className="table-location-cell">{item.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-hours-state">
                      <div className="empty-hours-icon">📅</div>
                      <p className="empty-hours-title">No Consultation Hours</p>
                      <p className="empty-hours-text">This instructor has not configured any weekly consultation hours yet.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="empty-details-fallback">
              <span className="fallback-icon">👤</span>
              <p className="fallback-title">Select an Instructor</p>
              <p className="fallback-text">Choose a faculty member from the list on the left to see their consultation schedule, modalities, and offices.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentConsultationSchedule;
