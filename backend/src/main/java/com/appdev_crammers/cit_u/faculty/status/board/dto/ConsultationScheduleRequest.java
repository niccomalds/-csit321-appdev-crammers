package com.appdev_crammers.cit_u.faculty.status.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConsultationScheduleRequest(
        @NotBlank @Size(max = 20) String day,
        @NotBlank @Size(max = 30) String mode,
        @NotBlank @Size(max = 20) String startTime,
        @NotBlank @Size(max = 20) String endTime,
        @NotBlank @Size(max = 120) String location) {
}
