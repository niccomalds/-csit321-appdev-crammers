package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.LocalTime;

import com.appdev_crammers.cit_u.faculty.status.board.entity.ClassScheduleEntity;

public record ClassScheduleResponse(
        Long id,
        String facultyName,
        String subjectName,
        String dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        String room) {

    public static ClassScheduleResponse from(ClassScheduleEntity schedule) {
        return new ClassScheduleResponse(
                schedule.getId(),
                schedule.getFaculty().getFullName(),
                schedule.getSubjectName(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getRoom());
    }
}
