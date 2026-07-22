package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.Instant;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AvailabilityStatus;
import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatusEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;

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

    public static FacultyResponse from(UserAccountEntity faculty, FacultyStatusEntity status) {
        return new FacultyResponse(faculty.getId(), faculty.getFullName(), faculty.getEmail(),
                faculty.getDepartment(), faculty.getIdNumber(), status.getStatus(),
                status.getDescription(), status.getRoom(), status.getUpdatedAt());
    }
}
