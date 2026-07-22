package com.appdev_crammers.cit_u.faculty.status.board.entity;

import java.time.Instant;

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
@Table(name = "consultation_schedules")
public class ConsultationScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private UserAccountEntity faculty;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String day;

    @Column(nullable = false, length = 30)
    private String mode;

    @Column(nullable = false, length = 20)
    private String startTime;

    @Column(nullable = false, length = 20)
    private String endTime;

    @Column(nullable = false, length = 120)
    private String location;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected ConsultationScheduleEntity() {
    }

    public ConsultationScheduleEntity(UserAccountEntity faculty, String day, String mode,
                                      String startTime, String endTime, String location) {
        this.faculty = faculty;
        this.day = day;
        this.mode = mode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
    }

    public Long getId() { return id; }
    public UserAccountEntity getFaculty() { return faculty; }
    public String getDay() { return day; }
    public String getMode() { return mode; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getLocation() { return location; }
    public Instant getCreatedAt() { return createdAt; }

    public void update(String day, String mode, String startTime, String endTime, String location) {
        this.day = day;
        this.mode = mode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
    }
}
