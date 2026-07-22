package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AbsenceAnnouncementRequest(
        @NotBlank @Size(max = 120) String reason,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotBlank @Size(max = 40) String startTime,
        @NotNull LocalDate returnDate,
        @NotBlank @Size(max = 1000) String details) {
}
