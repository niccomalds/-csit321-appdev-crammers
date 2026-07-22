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
@Table(name = "notifications")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccountEntity user;

    @Column(nullable = false, length = 255)
    private String message;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private boolean unread = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected NotificationEntity() {}

    public NotificationEntity(UserAccountEntity user, String message, String type) {
        this.user = user;
        this.message = message;
        this.type = type;
    }

    public Long getId() { return id; }
    public UserAccountEntity getUser() { return user; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public boolean isUnread() { return unread; }
    public void setUnread(boolean unread) { this.unread = unread; }
    public Instant getCreatedAt() { return createdAt; }
}
