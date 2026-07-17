import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { absenceList } from "../../data/mockFaculty";
import "../../styles/shared.css";
import "./FacultyAbsences.css";

const filters = ["All", "On Leave", "Seminar", "Sick Leave", "Travel", "Official Business"];

function FacultyAbsences() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = absenceList.filter(
    (a) => activeFilter === "All" || a.type === activeFilter
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <div className="page-topbar">
          <p className="page-breadcrumb">
            CIT-U Faculty Board / <span>Faculty Absences</span>
          </p>
        </div>

        <h1 className="page-title">Faculty Absence Information</h1>
        <p className="page-subtext">Check faculty availability before heading to campus.</p>

        <div className="filter-chips">
          {filters.map((f) => (
            <button
              key={f}
              className={`chip ${activeFilter === f ? "chip-active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="absence-grid">
          {filtered.map((a) => (
            <div key={a.id} className="card absence-card">
              <span className="absence-type-tag">{a.type}</span>
              <p className="faculty-name">{a.name}</p>
              <p className="faculty-meta">{a.department}</p>
              <p className="absence-reason">{a.reason}</p>
              <p className="absence-return">Expected Return: {a.expectedReturn}</p>

              <div className="absence-message">
                <p className="absence-message-label">AWAY MESSAGE</p>
                <p className="absence-message-text">"{a.awayMessage}"</p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="empty-state">No absences under this filter.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default FacultyAbsences;