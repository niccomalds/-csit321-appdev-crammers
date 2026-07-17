import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { facultyList } from "../../data/mockFaculty";
import "../../styles/shared.css";
import "./FacultyDirectory.css";

function FacultyDirectory() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const departments = ["All", ...new Set(facultyList.map((f) => f.department))];

  const filtered = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "All" || f.department === department;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title" style={{ textAlign: "center" }}>
          Faculty Directory
        </h1>
        <p className="page-subtext" style={{ textAlign: "center" }}>
          Browse and connect with faculty members across departments
        </p>

        <input
          className="search-input"
          placeholder="Search faculty by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-chips">
          {departments.map((d) => (
            <button
              key={d}
              className={`chip ${department === d ? "chip-active" : ""}`}
              onClick={() => setDepartment(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="page-subtext">Showing {filtered.length} faculty</p>

        <div className="directory-grid">
          {filtered.map((f) => (
            <div key={f.id} className="card directory-card">
              <div className="directory-avatar">{f.name.charAt(0)}</div>
              <p className="faculty-name">{f.name}</p>
              <p className="faculty-meta">{f.department}</p>
              <p className={`badge badge-${f.status.toLowerCase().replace(/\s+/g, "-")}`}>
                Status: {f.status}
              </p>
              <button className="btn-outline directory-view-btn">View Profile</button>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="empty-state">No faculty found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default FacultyDirectory;