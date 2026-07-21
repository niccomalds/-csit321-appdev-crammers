package com.appdev_crammers.cit_u.faculty.status.board.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "faculty_statuses")
public class FacultyStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_id", nullable = false, unique = true)
    private UserAccount faculty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AvailabilityStatus status;

    @Column(length = 300)
    private String description;

    @Column(nullable = false, length = 120)
    private String room;

    @Column(nullable = false)
    private Instant updatedAt;

    protected FacultyStatus() {
    }

    public FacultyStatus(UserAccount faculty, AvailabilityStatus status, String description, String room) {
        this.faculty = faculty;
        this.status = status;
        this.description = description;
        this.room = room;
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public UserAccount getFaculty() { return faculty; }
    public AvailabilityStatus getStatus() { return status; }
    public String getDescription() { return description; }
    public String getRoom() { return room; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void update(AvailabilityStatus status, String description, String room) {
        this.status = status;
        this.description = description;
        if (room != null && !room.isBlank()) this.room = room.trim();
        this.updatedAt = Instant.now();
    }
}
