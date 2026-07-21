package com.appdev_crammers.cit_u.faculty.status.board.status.dto;

import com.appdev_crammers.cit_u.faculty.status.board.status.AvailabilityStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateStatusRequest(
        @NotNull AvailabilityStatus status,
        @Size(max = 300) String description,
        @Size(max = 120) String room) {
}
