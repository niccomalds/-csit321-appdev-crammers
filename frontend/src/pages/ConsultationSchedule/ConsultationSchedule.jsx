import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { facultyList } from "../../data/mockFaculty";
import "../../styles/shared.css";
import "./ConsultationSchedule.css";

function ConsultationSchedule() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(facultyList[0]?.id);

  const filtered = facultyList.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = facultyList.find((f) => f.id === selectedId);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <div className="page-topbar">
          <p className="page-breadcrumb">
            CIT-U Faculty Board / <span>Consultation Schedule</span>
          </p>
        </div>

        <h1 className="page-title">Consultation Schedule</h1>

        <div className="consultation-layout">
          <div className="consultation-list card">
            <input
              className="search-input"
              placeholder="Search faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {filtered.map((f) => (
              <button
                key={f.id}
                className={`faculty-list-item ${
                  f.id === selectedId ? "faculty-list-item-active" : ""
                }`}
                onClick={() => setSelectedId(f.id)}
              >
                <div className="faculty-list-avatar">{f.name.charAt(0)}</div>
                <div>
                  <p className="faculty-list-name">{f.name}</p>
                  <p className="faculty-list-dept">{f.department}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="empty-state">No faculty found.</p>
            )}
          </div>

          <div className="consultation-detail">
            {selected ? (
              <>
                <div className="card consultation-profile">
                  <div className="consultation-avatar">
                    {selected.name.charAt(0)}
                  </div>
                  <div className="consultation-profile-text">
                    <p className="faculty-name">{selected.name}</p>
                    <p className="faculty-meta">
                      {selected.title} · {selected.department}
                    </p>
                  </div>
                  <span
                    className={`badge badge-${selected.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {selected.status}
                  </span>
                </div>

                <div className="card">
                  <p className="consultation-hours-title">Consultation Hours</p>
                  {selected.consultationHours.length > 0 ? (
                    <table className="consultation-table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Time</th>
                          <th>Mode</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.consultationHours.map((c, i) => (
                          <tr key={i}>
                            <td>{c.day}</td>
                            <td>{c.time}</td>
                            <td>
                              <span
                                className={`mode-pill ${
                                  c.mode === "Online" ? "mode-online" : "mode-f2f"
                                }`}
                              >
                                {c.mode}
                              </span>
                            </td>
                            <td>{c.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-state">
                      No consultation hours posted yet.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="empty-state">Select a faculty member.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConsultationSchedule;