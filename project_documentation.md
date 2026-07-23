# CIT-U Faculty Status Board
## System Architecture & Project Documentation

### Group Members:
*   **Vince Raymund J. Alerta**
*   **Jehryn D. Laurino**
*   **Nicco Victor P. Maldo**

**Course Code:** CSIT321 - Applications Development and Emerging Technologies  
**Project Title:** CIT-U Faculty Status Board

---

## 1. Entity Relationship Diagram (ERD)
The ERD maps out the structural data model of the application, representing database persistence relationships between user accounts, real-time statuses, schedules, absence logs, and notification feeds.

![Entity Relationship Diagram](./diagrams/erd.png)

<details>
<summary>💻 View Mermaid Source Code</summary>

```mermaid
erDiagram
    USER_ACCOUNT ||--o| FACULTY_STATUS : "has (1:1)"
    USER_ACCOUNT ||--o{ CLASS_SCHEDULE : "manages (1:N)"
    USER_ACCOUNT ||--o{ CONSULTATION_SCHEDULE : "conducts (1:N)"
    USER_ACCOUNT ||--o{ ABSENCE_ANNOUNCEMENT : "posts (1:N)"
    USER_ACCOUNT ||--o{ NOTIFICATION : "receives (1:N)"

    USER_ACCOUNT {
        bigint id PK
        varchar fullName
        varchar email
        varchar password
        varchar role
        varchar department
        varchar idNumber
        varchar course
        varchar year
    }
    FACULTY_STATUS {
        bigint id PK
        bigint faculty_id FK
        varchar status
        varchar description
        varchar room
        datetime updatedAt
    }
    CLASS_SCHEDULE {
        bigint id PK
        bigint faculty_id FK
        varchar subjectName
        varchar section
        varchar room
        time startTime
        time endTime
        varchar dayOfWeek
    }
    CONSULTATION_SCHEDULE {
        bigint id PK
        bigint faculty_id FK
        varchar subjectName
        varchar modality
        varchar dayOfWeek
        time startTime
        time endTime
        varchar roomOrLink
    }
    ABSENCE_ANNOUNCEMENT {
        bigint id PK
        bigint faculty_id FK
        varchar reason
        date startDate
        date endDate
        time startTime
        date returnDate
        text details
        boolean active
        datetime createdAt
    }
    NOTIFICATION {
        bigint id PK
        bigint recipient_id FK
        varchar message
        varchar type
        boolean isRead
        datetime timestamp
    }
```
</details>

---

## 2. Use Case Diagram
This diagram outlines the interactions between the two primary Actors (Faculty and Student) and the key behaviors supported by the system.

![Use Case Diagram](./diagrams/use_case.png)

<details>
<summary>💻 View Mermaid Source Code</summary>

```mermaid
graph TD
    classDef actor fill:#fdf,stroke:#701f2b,stroke-width:2px;
    classDef usecase fill:#fff,stroke:#701f2b,stroke-width:1px,rx:10px,ry:10px;

    Faculty((Faculty Member)):::actor
    Student((Student User)):::actor

    subgraph CIT-U Status Board Boundary
        UC1(Register Account):::usecase
        UC2(Login to System):::usecase
        UC3(Update Availability Status & Note):::usecase
        UC4(Manage Class Schedules):::usecase
        UC5(Manage Consultation Hours):::usecase
        UC6(Post Absence Announcements):::usecase
        UC7(View Status Directory & Avatar Lights):::usecase
        UC8(View Consultation Schedules):::usecase
        UC9(View Active Absence/Leave Notices):::usecase
        UC10(Receive Alerts Feed):::usecase
    end

    Faculty --> UC1
    Faculty --> UC2
    Faculty --> UC3
    Faculty --> UC4
    Faculty --> UC5
    Faculty --> UC6
    Faculty --> UC10

    Student --> UC1
    Student --> UC2
    Student --> UC7
    Student --> UC8
    Student --> UC9
    Student --> UC10
```
</details>

---

## 3. Class Diagram
The Class Diagram models the technical composition of the Spring Boot backend layer, showcasing relationships between entities, service handlers, repository queries, and REST controllers.

![Class Diagram](./diagrams/class_diagram.png)

<details>
<summary>💻 View Mermaid Source Code</summary>

```mermaid
classDiagram
    class UserAccountEntity {
        +Long id
        +String fullName
        +String email
        +String password
        +UserRole role
        +String department
        +String idNumber
        +String course
        +String year
        +getYearCourse() String
    }

    class FacultyStatusEntity {
        +Long id
        +UserAccountEntity faculty
        +AvailabilityStatus status
        +String description
        +String room
        +Instant updatedAt
    }

    class NotificationEntity {
        +Long id
        +UserAccountEntity recipient
        +String message
        +String type
        +boolean isRead
        +Instant timestamp
    }

    class FacultyStatusService {
        -UserAccountRepository users
        -FacultyStatusRepository statuses
        -SimpMessagingTemplate messaging
        -NotificationService notificationService
        +findAll() List~FacultyResponse~
        +findById(Long id) FacultyResponse
        +updateStatus(Long id, UpdateStatusRequest request) FacultyResponse
    }

    class NotificationService {
        -NotificationRepository notifications
        -UserAccountRepository users
        +getNotificationsByUser(Long userId) List~NotificationResponse~
        +createNotificationsForRole(UserRole role, String msg, String type) void
        +createNotification(UserAccountEntity user, String msg, String type) void
        +markAsRead(Long notifId) void
        +clearAll(Long userId) void
    }

    class FacultyStatusController {
        -FacultyStatusService facultyStatusService
        +findAll() List~FacultyResponse~
        +findById(Long id) FacultyResponse
        +updateStatus(Long id, UpdateStatusRequest request) FacultyResponse
    }

    FacultyStatusService ..> UserAccountEntity : queries
    FacultyStatusService ..> FacultyStatusEntity : updates
    FacultyStatusService ..> NotificationService : triggers
    FacultyStatusController --> FacultyStatusService : delegates
    NotificationService ..> NotificationEntity : persists
```
</details>

---

## 4. Activity Diagram
This workflow maps the sequence of actions and state decisions when a Faculty member updates their availability status.

![Activity Diagram](./diagrams/activity_diagram.png)

<details>
<summary>💻 View Mermaid Source Code</summary>

```mermaid
flowchart TD
    Start([Start]) --> Login[Faculty Logs In]
    Login --> OpenStatus[Open Status Manager Tab]
    OpenStatus --> ChooseStatus[Select Availability & Input Description]
    ChooseStatus --> ClickUpdate[Click 'Update Status']
    ClickUpdate --> Validate[Backend Validates Payload]
    Validate -- Valid --> UpdateDB[Save to Database Table: faculty_statuses]
    Validate -- Invalid --> Error[Display UI Validation Errors]
    Error --> ChooseStatus
    UpdateDB --> TriggerNotif[Trigger Notification Engine]
    TriggerNotif --> FanOut[Generate Notifications for all Students]
    FanOut --> SaveNotif[Save Alerts in notifications DB Table]
    SaveNotif --> RefreshDashboard[Refresh Student Board]
    RefreshDashboard --> UpdateUI[Update Status indicator lights & metric cards]
    UpdateUI --> End([End])
```
</details>

---

## 5. Sequence Diagram
This displays the sequential flow of messages between system actors and technical components during a status update and subsequent student directory sync.

![Sequence Diagram](./diagrams/sequence_diagram.png)

<details>
<summary>💻 View Mermaid Source Code</summary>

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Client
    actor Faculty as Faculty Client
    participant Controller as FacultyStatusController
    participant Service as FacultyStatusService
    participant NotifService as NotificationService
    participant DB as Database (MySQL)

    Note over Faculty, Controller: Faculty Status Update Flow
    Faculty->>Controller: PUT /api/faculty/{id}/status (UpdateStatusRequest)
    activate Controller
    Controller->>Service: updateStatus(id, request)
    activate Service
    Service->>DB: Update faculty_statuses table
    DB-->>Service: Success
    Service->>NotifService: createNotificationsForRole(STUDENT, message, "status")
    activate NotifService
    NotifService->>DB: Insert notification records for all students
    DB-->>NotifService: Success
    deactivate NotifService
    Service-->>Controller: FacultyResponse (camelcased status)
    deactivate Service
    Controller-->>Faculty: HTTP 200 OK (camelcased status)
    deactivate Controller

    Note over Student, DB: Student Board Sync Flow
    Student->>Controller: GET /api/faculty
    activate Controller
    Controller->>Service: findAll()
    activate Service
    Service->>DB: Query users and status tables
    DB-->>Service: User details & status records
    Service-->>Controller: List of mapped FacultyResponse objects
    deactivate Service
    Controller-->>Student: HTTP 200 OK (Clean camelcase JSON)
    deactivate Controller
    Student->>Student: Re-calculate metrics & update profile avatar lights
```
</details>
