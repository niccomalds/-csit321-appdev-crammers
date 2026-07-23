import { useState } from 'react';
import './StudentFacultyDirectory.css';
import josemarieImg from '../assets/images/josemarie.jpg';
import leahImg from '../assets/images/leah.jpg';
import tulinImg from '../assets/images/tulin.jpg';
import ugangImg from '../assets/images/ugang.jpg';
import vonImg from '../assets/images/von.jpg';
import { useFacultyList } from '../hooks/useFacultyList';

const getFacultyAvatar = (email) => {
  switch (email) {
    case 'josemarie.amparo@cit.edu':
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

function StudentFacultyDirectory() {
  const faculty = useFacultyList();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const departments = [...new Set(faculty.map((item) => item.department).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  const statusOptions = [...new Set(faculty.map((item) => item.status).filter(Boolean))];

  const getStatusLabel = (status) => status === "InClass" ? "In Class" : status;

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = search.trim() || departmentFilter !== "all" || statusFilter !== "all";

  // Search and filter faculty
  const filteredFaculty = faculty.filter((f) => {
    const query = search.trim().toLowerCase();
    const searchableText = [f.fullName, f.email, f.department, f.room]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const matchesDepartment = departmentFilter === "all" || f.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="student-directory-container">
      {/* Search Bar */}
      <div className="directory-filter-bar">
        <div className="search-box-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by name, email, department, or room..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-field"
            aria-label="Search faculty directory"
          />
        </div>
        <div className="directory-select-group">
          <label>
            <span className="sr-only">Department</span>
            <select
              className="directory-filter-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Availability status</span>
            <select
              className="directory-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{getStatusLabel(status)}</option>
              ))}
            </select>
          </label>
          {hasActiveFilters && (
            <button type="button" className="directory-clear-btn" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Directory List */}
      <div className="directory-list-section">
        <p className="directory-result-count" aria-live="polite">
          Showing {filteredFaculty.length} of {faculty.length} faculty members
        </p>
        {filteredFaculty.length > 0 ? (
          <div className="directory-grid">
            {filteredFaculty.map((item) => (
              <div key={item.id} className="directory-card">
                <div className="directory-card-top">
                  {getFacultyAvatar(item.email) ? (
                    <img src={getFacultyAvatar(item.email)} alt={item.fullName} className="directory-avatar" />
                  ) : (
                    <div className="directory-avatar-abbr">
                      {getInitials(item.fullName)}
                    </div>
                  )}
                  <div className="directory-meta-info">
                    <h4 className="directory-name">{item.fullName}</h4>
                    <span className="directory-dept">{item.department}</span>
                    <span className={`directory-status status-${item.status?.toLowerCase()}`}>
                      <span className="directory-status-dot" aria-hidden="true" />
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>

                <div className="directory-card-body">
                  <div className="contact-info-row">
                    <span className="contact-label">Office / Room</span>
                    <div className="contact-value-display">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>{item.room}</span>
                    </div>
                  </div>

                  <div className="contact-info-row">
                    <span className="contact-label">University Email</span>
                    <div className="email-copy-display">
                      <div className="email-text-box" title={item.email}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>{item.email}</span>
                      </div>
                      <button 
                        className={`email-copy-btn ${copiedId === item.id ? 'copied-status' : ''}`}
                        onClick={() => handleCopyEmail(item.email, item.id)}
                        title="Copy email to clipboard"
                      >
                        {copiedId === item.id ? (
                          <span>Copied!</span>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-search-state">
            <span className="empty-search-icon">👥</span>
            <p className="empty-search-title">No matching contacts</p>
            <p className="empty-search-text">No instructors match your current search and filters.</p>
            {hasActiveFilters && (
              <button type="button" className="empty-clear-btn" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentFacultyDirectory;
