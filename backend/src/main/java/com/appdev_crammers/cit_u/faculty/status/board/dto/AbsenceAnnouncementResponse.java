package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AbsenceAnnouncement;

public record AbsenceAnnouncementResponse(
        Long id,
        String facultyName,
        String reason,
        LocalDate startDate,
        LocalDate returnDate,
        String details,
        boolean active,
        Instant createdAt) {

    public static AbsenceAnnouncementResponse from(AbsenceAnnouncement announcement) {
        return new AbsenceAnnouncementResponse(
                announcement.getId(),
                announcement.getFaculty().getFullName(),
                announcement.getReason(),
                announcement.getStartDate(),
                announcement.getReturnDate(),
                announcement.getDetails(),
                announcement.isActive(),
                announcement.getCreatedAt());
    }
}
