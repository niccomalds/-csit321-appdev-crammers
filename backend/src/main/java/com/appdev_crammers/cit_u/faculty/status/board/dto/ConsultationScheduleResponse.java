package com.appdev_crammers.cit_u.faculty.status.board.dto;

import com.appdev_crammers.cit_u.faculty.status.board.entity.ConsultationScheduleEntity;

public record ConsultationScheduleResponse(
        Long id,
        Long facultyId,
        String day,
        String mode,
        String startTime,
        String endTime,
        String location) {

    public static ConsultationScheduleResponse from(ConsultationScheduleEntity schedule) {
        return new ConsultationScheduleResponse(
                schedule.getId(),
                schedule.getFaculty().getId(),
                schedule.getDay(),
                schedule.getMode(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getLocation()
        );
    }
}
