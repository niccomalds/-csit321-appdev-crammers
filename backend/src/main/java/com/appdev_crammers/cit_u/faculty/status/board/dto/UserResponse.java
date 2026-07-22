package com.appdev_crammers.cit_u.faculty.status.board.dto;

import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        UserRole role,
        String idNumber,
        String department,
        String yearCourse) {

    public static UserResponse from(UserAccountEntity user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(),
                user.getIdNumber(), user.getDepartment(), user.getYearCourse());
    }
}
