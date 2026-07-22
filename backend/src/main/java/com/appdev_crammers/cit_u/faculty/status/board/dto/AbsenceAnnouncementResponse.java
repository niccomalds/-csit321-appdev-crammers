package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AbsenceAnnouncementEntity;

public record AbsenceAnnouncementResponse(
        Long id,
        String facultyName,
        String facultyEmail,
        String facultyDept,
        String reason,
        LocalDate startDate,
        LocalDate endDate,
        String startTime,
        LocalDate returnDate,
        String details,
        boolean active,
        Instant createdAt) {

    public static AbsenceAnnouncementResponse from(AbsenceAnnouncementEntity announcement) {
        return new AbsenceAnnouncementResponse(
                announcement.getId(),
                announcement.getFaculty().getFullName(),
                announcement.getFaculty().getEmail(),
                announcement.getFaculty().getDepartment(),
                announcement.getReason(),
                announcement.getStartDate(),
                announcement.getEndDate(),
                announcement.getStartTime(),
                announcement.getReturnDate(),
                announcement.getDetails(),
                announcement.isActive(),
                announcement.getCreatedAt());
    }
}
