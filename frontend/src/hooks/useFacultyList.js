import { useEffect, useState } from "react";
import { facultyApi } from "../api/facultyApi";

const FACULTY_KEY = "facultyList";
const FACULTY_EVENT = "faculty-status-updated";
const REFRESH_INTERVAL_MS = 5000;

const statusMap = {
  AVAILABLE: "Available",
  IN_CLASS: "InClass",
  BUSY: "Busy",
  OUT: "Out",
};

const normalizeFaculty = (faculty = []) => faculty.map((member) => ({
  ...member,
  status: statusMap[member.status] || member.status,
}));

const readStoredFaculty = () => {
  try {
    return normalizeFaculty(JSON.parse(localStorage.getItem(FACULTY_KEY) || "[]"));
  } catch {
    return [];
  }
};

export const notifyFacultyStatusUpdated = () => {
  window.dispatchEvent(new CustomEvent(FACULTY_EVENT, {
    detail: { updatedAt: new Date().toISOString() },
  }));
};

export function useFacultyList() {
  const [faculty, setFaculty] = useState(readStoredFaculty);

  useEffect(() => {
    let active = true;

    const loadFromBackend = async () => {
      try {
        const latestFaculty = normalizeFaculty(await facultyApi.findAll());
        if (!active) return;
        localStorage.setItem(FACULTY_KEY, JSON.stringify(latestFaculty));
        setFaculty(latestFaculty);
      } catch (error) {
        // Keep the most recently cached list when the backend is unavailable.
        console.error("Unable to refresh faculty statuses:", error);
      }
    };

    const handleLocalUpdate = () => setFaculty(readStoredFaculty());
    const handleStorage = (event) => {
      if (!event.key || event.key === FACULTY_KEY) handleLocalUpdate();
    };

    window.addEventListener(FACULTY_EVENT, handleLocalUpdate);
    window.addEventListener("storage", handleStorage);
    loadFromBackend();
    const refreshTimer = window.setInterval(loadFromBackend, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener(FACULTY_EVENT, handleLocalUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return faculty;
}
