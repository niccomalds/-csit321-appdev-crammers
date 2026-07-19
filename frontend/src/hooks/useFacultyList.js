import { useSyncExternalStore } from "react";

const FACULTY_KEY = "facultyList";
const FACULTY_EVENT = "faculty-status-updated";

let cachedRaw = null;
let cachedFaculty = [];

const readFaculty = () => {
  const raw = localStorage.getItem(FACULTY_KEY) || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedFaculty = JSON.parse(raw);
    } catch {
      cachedFaculty = [];
    }
  }
  return cachedFaculty;
};

const subscribe = (callback) => {
  const handleStorage = (event) => {
    if (!event.key || event.key === FACULTY_KEY) callback();
  };
  const handleFacultyUpdate = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(FACULTY_EVENT, handleFacultyUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FACULTY_EVENT, handleFacultyUpdate);
  };
};

export const notifyFacultyStatusUpdated = () => {
  cachedRaw = null;
  window.dispatchEvent(new CustomEvent(FACULTY_EVENT, {
    detail: { updatedAt: new Date().toISOString() },
  }));
};

export function useFacultyList() {
  return useSyncExternalStore(subscribe, readFaculty, () => []);
}
