import React, { useState, useEffect } from 'react';
import './StudentFacultyAbsences.css';
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

function StudentFacultyAbsences() {
  const [absences, setAbsences] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const list = localStorage.getItem("facultyList");
    if (!list) return;

    const faculties = JSON.parse(list);
    const combinedAbsences = [];
    const todayStr = new Date().toISOString().split('T')[0];

    faculties.forEach((f) => {
      let facultyAnn = [];
      const email = f.email;
      if (email === "teacher@cit.edu") {
        const saved = localStorage.getItem("absenceAnnouncements");
        facultyAnn = saved ? JSON.parse(saved) : [];
      } else {
        const saved = localStorage.getItem(`absenceAnnouncements_${email}`);
        facultyAnn = saved ? JSON.parse(saved) : [];
      }

      facultyAnn.forEach((ann) => {
        // Only include active or upcoming absences
        if (ann.endDate >= todayStr) {
          combinedAbsences.push({
            ...ann,
            facultyName: f.fullName,
            facultyEmail: f.email,
            facultyDept: f.department
          });
        }
      });
    });

    setAbsences(combinedAbsences);
  }, []);

  const getAbsenceStatus = (item) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (todayStr >= item.startDate && todayStr <= item.endDate) {
      return "Active";
    } else if (todayStr < item.startDate) {
      return "Upcoming";
    }
    return "Past";
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  // Filter absences
  const filteredAbsences = absences.filter((item) => {
    const matchesSearch = item.facultyName.toLowerCase().includes(search.toLowerCase()) ||
                          item.reason.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="student-absences-container">
      {/* Search Bar */}
      <div className="absences-filter-bar">
        <div className="search-box-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search absences by instructor, reason, or description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-field"
          />
        </div>
      </div>

      {/* Absences List */}
      <div className="absences-list-section">
        {filteredAbsences.length > 0 ? (
          <div className="absences-cards-grid">
            {filteredAbsences.map((item) => {
              const status = getAbsenceStatus(item);
              return (
                <div key={item.id} className="student-absence-card">
                  <div className="absence-card-header">
                    <div className="absence-profile-info">
                      {getFacultyAvatar(item.facultyEmail) ? (
                        <img src={getFacultyAvatar(item.facultyEmail)} alt={item.facultyName} className="absence-avatar" />
                      ) : (
                        <div className="absence-avatar-abbr">
                          {getInitials(item.facultyName)}
                        </div>
                      )}
                      <div className="absence-profile-texts">
                        <h4 className="absence-faculty-name">{item.facultyName}</h4>
                        <span className="absence-faculty-dept">{item.facultyDept}</span>
                      </div>
                    </div>

                    <span className={`absence-badge-status ${status === "Active" ? "status-active" : "status-upcoming"}`}>
                      {status}
                    </span>
                  </div>

                  <div className="absence-card-body">
                    <h5 className="absence-reason-title">{item.reason}</h5>
                    <p className="absence-description-text">{item.description}</p>
                  </div>

                  <div className="absence-card-footer">
                    <div className="absence-date-info">
                      <span className="footer-meta-label">Schedule Absence</span>
                      <div className="date-duration-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{item.startDate} &rarr; {item.endDate}</span>
                      </div>
                    </div>

                    <div className="absence-return-info">
                      <span className="footer-meta-label">Expected Return</span>
                      <div className="return-date-badge">
                        {item.returnDate}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-search-state">
            <span className="empty-search-icon">⚠️</span>
            <p className="empty-search-title">No absence notices found</p>
            <p className="empty-search-text">No active or upcoming absence announcements match your current search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentFacultyAbsences;
