import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { facultyList } from "../../data/mockFaculty";
import "../../styles/shared.css";

const statusFilters = ["All", "Available", "In a Meeting", "Class Ongoing", "Out of Office"];

function badgeClass(status) {
  return "badge badge-" + status.toLowerCase().replace(/\s+/g, "-");
}

function FacultyStatus() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || f.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <div className="page-topbar">
          <p className="page-breadcrumb">
            CIT-U Faculty Board / <span>Faculty Status</span>
          </p>
        </div>

        <h1 className="page-title">Faculty Status</h1>
        <p className="page-subtext">Check real-time faculty availability.</p>

        <input
          className="search-input"
          placeholder="Search professor by name, department, or status detail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-chips">
          {statusFilters.map((s) => (
            <button
              key={s}
              className={`chip ${activeFilter === s ? "chip-active" : ""}`}
              onClick={() => setActiveFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="page-subtext">
          Showing {filtered.length} of {facultyList.length} faculty members
        </p>

        <div className="faculty-status-grid">
          {filtered.map((f) => (
            <div key={f.id} className="card faculty-status-card">
              <div className="faculty-status-header">
                <div>
                  <p className="faculty-name">{f.name}</p>
                  <p className="faculty-meta">
                    {f.title} · {f.department}
                  </p>
                </div>
                <span className={badgeClass(f.status)}>{f.status}</span>
              </div>

              {f.statusDetail && (
                <div className="faculty-status-detail">{f.statusDetail}</div>
              )}

              <p className="faculty-email">{f.email}</p>

              {f.todaysSchedule.length > 0 && (
                <div className="faculty-schedule">
                  <p className="faculty-schedule-label">TODAY'S CLASS SCHEDULE</p>
                  {f.todaysSchedule.map((s, i) => (
                    <div key={i} className="faculty-schedule-row">
                      <span className="faculty-schedule-time">{s.time}</span>
                      <div>
                        <p className="faculty-schedule-subject">{s.subject}</p>
                        <p className="faculty-schedule-meta">
                          {s.section} · {s.room}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="empty-state">No faculty match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default FacultyStatus;