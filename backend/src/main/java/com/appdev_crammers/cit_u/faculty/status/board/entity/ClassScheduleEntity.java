package com.appdev_crammers.cit_u.faculty.status.board.entity;

import java.time.Instant;
import java.time.LocalTime;

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
@Table(name = "class_schedules")
public class ClassScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private UserAccountEntity faculty;

    @Column(nullable = false, length = 120)
    private String subjectName;

    @Column(nullable = false, length = 20)
    private String dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 120)
    private String room;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected ClassScheduleEntity() {
    }

    public ClassScheduleEntity(UserAccountEntity faculty, String subjectName, String dayOfWeek,
                         LocalTime startTime, LocalTime endTime, String room) {
        this.faculty = faculty;
        this.subjectName = subjectName;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
    }

    public Long getId() { return id; }
    public UserAccountEntity getFaculty() { return faculty; }
    public String getSubjectName() { return subjectName; }
    public String getDayOfWeek() { return dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getRoom() { return room; }
    public Instant getCreatedAt() { return createdAt; }

    public void update(String subjectName, String dayOfWeek, LocalTime startTime,
                       LocalTime endTime, String room) {
        this.subjectName = subjectName;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
    }
}
