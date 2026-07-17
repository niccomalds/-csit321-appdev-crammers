// Static stand-in for a database. Swap this for real API calls once the backend is ready.

export const facultyList = [
  {
    id: 1,
    name: "Leah V. Barbaso",
    title: "Associate Professor",
    department: "Information Technology",
    status: "Available", // Available | In a Meeting | Class Ongoing | Out of Office | On Leave
    email: "leah.barbaso@cit.edu",
    statusDetail: "",
    todaysSchedule: [
      { time: "7:30 AM - 9:00 AM", subject: "CSIT111 - Introduction to Computing", section: "BSIT 1 - G1", room: "RTL 300" },
      { time: "1:00 PM - 2:30 PM", subject: "CSIT121 - Fundamentals of Programming", section: "BSIT 1 - G1", room: "RTL 301" },
      { time: "3:00 PM - 5:00 PM", subject: "CS132 - Introduction to Computer Systems", section: "BSIT 1 - G1", room: "RTL 302" },
    ],
    consultationHours: [
      { day: "Monday", time: "10:00 AM - 12:00 PM", mode: "Face-to-Face", location: "NGE Room 302" },
      { day: "Wednesday", time: "1:00 PM - 3:00 PM", mode: "Face-to-Face", location: "NGE Room 302" },
      { day: "Friday", time: "9:00 AM - 10:30 AM", mode: "Online", location: "MS Teams" },
    ],
  },
  {
    id: 2,
    name: "Jasmine A. Tulin",
    title: "Associate Professor",
    department: "Information Technology",
    status: "Class Ongoing",
    email: "jasmine.tulin@cit.edu",
    statusDetail: "Class OnGoing at NGE205-LAB",
    todaysSchedule: [
      { time: "9:00 AM - 11:00 AM", subject: "CSIT122 - Intermediate Programming", section: "BSIT 1 - G1", room: "RTL 302" },
      { time: "1:30 PM - 3:00 PM", subject: "CSIT221 - Data Structures and Algorithms", section: "BSIT 2 - G1", room: "RTL 301" },
      { time: "3:00 PM - 5:00 PM", subject: "CS132 - Introduction to Computer Systems", section: "BSIT 1 - G1", room: "RTL 302" },
    ],
    consultationHours: [],
  },
  {
    id: 3,
    name: "Roden J. Ugang",
    title: "Associate Professor",
    department: "Information Technology",
    status: "In a Meeting",
    email: "roden.ugang@cit.edu",
    statusDetail: "In a meeting at NGE, CSS Department — back by 3 PM",
    todaysSchedule: [
      { time: "7:30 AM - 9:00 AM", subject: "CSIT111 - Introduction to Computing", section: "BSIT 1 - G1", room: "RTL 300" },
      { time: "1:00 PM - 2:30 PM", subject: "CSIT121 - Fundamentals of Programming", section: "BSIT 1 - G1", room: "RTL 301" },
      { time: "3:00 PM - 5:00 PM", subject: "CS132 - Introduction to Computer Systems", section: "BSIT 1 - G1", room: "RTL 302" },
    ],
    consultationHours: [],
  },
  {
    id: 4,
    name: "Josemarie C. Amparo",
    title: "Associate Professor",
    department: "Information Technology",
    status: "Out of Office",
    email: "josemarie.amparo@cit.edu",
    statusDetail: "Out of Campus — attending regional seminar",
    todaysSchedule: [],
    consultationHours: [],
  },
  {
    id: 5,
    name: "Dr. Ernesto Villanueva",
    title: "Professor",
    department: "Electrical Engineering",
    status: "Available",
    email: "ernesto.villanueva@cit.edu",
    statusDetail: "",
    todaysSchedule: [],
    consultationHours: [],
  },
  {
    id: 6,
    name: "Prof. Clarissa Montano",
    title: "Assistant Professor",
    department: "Information Systems",
    status: "Available",
    email: "clarissa.montano@cit.edu",
    statusDetail: "",
    todaysSchedule: [],
    consultationHours: [],
  },
];

export const absenceList = [
  {
    id: 1,
    name: "Prof. Juan Dela Cruz",
    department: "College of Computer Studies",
    type: "Seminar",
    reason: "Seminar – National IT Conference",
    expectedReturn: "July 5, 2026",
    awayMessage: "I will respond to emails upon return.",
  },
  {
    id: 2,
    name: "Prof. Ramon Reyes",
    department: "College of Computer Studies",
    type: "Travel",
    reason: "Official Travel – Manila",
    expectedReturn: "July 10, 2026",
    awayMessage: "Urgent matters may be forwarded to reyes@cit.edu.",
  },
  {
    id: 3,
    name: "Prof. Maria Santos",
    department: "College of Computer Studies",
    type: "Sick Leave",
    reason: "Sick Leave",
    expectedReturn: "July 8, 2026",
    awayMessage: "Please coordinate with the department secretary.",
  },
];

export const notificationsList = [
  {
    id: 1,
    type: "status", // status | absence | schedule
    message: "Leah V. Barbaso changed status to Class Ongoing — ITEC 312, Lab 3",
    time: "9:00 AM",
    read: false,
  },
  {
    id: 2,
    type: "absence",
    message: "Josemarie C. Amparo posted an absence notice until July 1, 2026",
    time: "June 19, 2026",
    read: false,
  },
  {
    id: 3,
    type: "status",
    message: "Jasmine A. Tulin changed status to Class Ongoing — CSIT122, RTL 302",
    time: "1:00 PM",
    read: false,
  },
  {
    id: 4,
    type: "schedule",
    message: "Roden J. Ugang updated consultation schedule",
    time: "Yesterday",
    read: true,
  },
];

export const dashboardSummary = {
  available: 2,
  inMeeting: 1,
  classOngoing: 3,
  outOfOffice: 1,
};