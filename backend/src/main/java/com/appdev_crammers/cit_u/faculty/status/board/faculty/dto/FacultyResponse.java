package com.appdev_crammers.cit_u.faculty.status.board.faculty.dto;

import java.time.Instant;

import com.appdev_crammers.cit_u.faculty.status.board.status.AvailabilityStatus;
import com.appdev_crammers.cit_u.faculty.status.board.status.FacultyStatus;
import com.appdev_crammers.cit_u.faculty.status.board.user.UserAccount;

public record FacultyResponse(
        Long id,
        String fullName,
        String email,
        String department,
        String idNumber,
        AvailabilityStatus status,
        String statusDescription,
        String room,
        Instant updatedAt) {

    public static FacultyResponse from(UserAccount faculty, FacultyStatus status) {
        return new FacultyResponse(faculty.getId(), faculty.getFullName(), faculty.getEmail(),
                faculty.getDepartment(), faculty.getIdNumber(), status.getStatus(),
                status.getDescription(), status.getRoom(), status.getUpdatedAt());
    }
}
