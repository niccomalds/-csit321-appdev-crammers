package com.appdev_crammers.cit_u.faculty.status.board.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Size(max = 120) String department,
        @NotBlank @Size(max = 120) String course,
        @NotBlank @Size(max = 120) String year,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(max = 40) String idNumber,
        @NotBlank @Size(min = 8, max = 72) String password) {
}
