package com.appdev_crammers.cit_u.faculty.status.board.entity;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "absence_announcements")
public class AbsenceAnnouncementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private UserAccountEntity faculty;

    @Column(nullable = false, length = 120)
    private String reason;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, length = 40)
    private String startTime;

    @Column(nullable = false)
    private LocalDate returnDate;

    @Column(length = 1000)
    private String details;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private boolean active = true;

    protected AbsenceAnnouncementEntity() {
    }

    public AbsenceAnnouncementEntity(UserAccountEntity faculty, String reason, LocalDate startDate,
                               LocalDate endDate, String startTime, LocalDate returnDate, String details) {
        this.faculty = faculty;
        this.reason = reason;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.returnDate = returnDate;
        this.details = details;
    }

    public Long getId() { return id; }
    public UserAccountEntity getFaculty() { return faculty; }
    public String getReason() { return reason; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getStartTime() { return startTime; }
    public LocalDate getReturnDate() { return returnDate; }
    public String getDetails() { return details; }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isActive() { return active; }

    public void deactivate() {
        this.active = false;
    }

    public void update(String reason, LocalDate startDate, LocalDate endDate, String startTime,
                      LocalDate returnDate, String details) {
        this.reason = reason;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.returnDate = returnDate;
        this.details = details;
    }
}
