package com.appdev_crammers.cit_u.faculty.status.board.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_accounts")
public class UserAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Column(nullable = false, unique = true, length = 40)
    private String idNumber;

    @Column(length = 120)
    private String department;

    @Column(length = 120)
    private String course;

    @Column(name = "`year`", length = 120)
    private String year;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected UserAccountEntity() {
    }

    public UserAccountEntity(String fullName, String email, String passwordHash, UserRole role,
                       String idNumber, String department, String course, String year) {
        this.fullName = fullName;
        this.email = email.toLowerCase().trim();
        this.passwordHash = passwordHash;
        this.role = role;
        this.idNumber = idNumber;
        this.department = department;
        this.course = course;
        this.year = year;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public UserRole getRole() { return role; }
    public String getIdNumber() { return idNumber; }
    public String getDepartment() { return department; }
    public String getCourse() { return course; }
    public String getYear() { return year; }
    public String getYearCourse() {
        if (this.year == null && this.course == null) return null;
        return this.year + " - " + this.course;
    }
    public Instant getCreatedAt() { return createdAt; }
}
