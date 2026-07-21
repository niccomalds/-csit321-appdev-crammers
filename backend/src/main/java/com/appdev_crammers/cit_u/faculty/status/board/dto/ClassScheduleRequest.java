package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClassScheduleRequest(
        @NotBlank @Size(max = 120) String subjectName,
        @NotBlank @Size(max = 20) String dayOfWeek,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @NotBlank @Size(max = 120) String room) {
}
