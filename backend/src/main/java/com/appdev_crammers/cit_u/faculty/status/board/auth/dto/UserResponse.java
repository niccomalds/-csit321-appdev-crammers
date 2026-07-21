package com.appdev_crammers.cit_u.faculty.status.board.auth.dto;

import com.appdev_crammers.cit_u.faculty.status.board.user.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.user.UserRole;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        UserRole role,
        String idNumber,
        String department,
        String yearCourse) {

    public static UserResponse from(UserAccount user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(),
                user.getIdNumber(), user.getDepartment(), user.getYearCourse());
    }
}
