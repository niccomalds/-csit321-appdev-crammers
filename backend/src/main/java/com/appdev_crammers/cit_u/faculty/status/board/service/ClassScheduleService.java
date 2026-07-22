package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.ClassSchedule;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.ClassScheduleRepository;

@Service
public class ClassScheduleService {

    private final ClassScheduleRepository schedules;

    public ClassScheduleService(ClassScheduleRepository schedules) {
        this.schedules = schedules;
    }

    @Transactional
    public ClassScheduleResponse createSchedule(UserAccount faculty, ClassScheduleRequest request) {
        if (faculty.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }

        ClassSchedule schedule = new ClassSchedule(
                faculty,
                request.subjectName().trim(),
                request.dayOfWeek().trim().toUpperCase(),
                request.startTime(),
                request.endTime(),
                request.room().trim());

        return ClassScheduleResponse.from(schedules.save(schedule));
    }

    @Transactional(readOnly = true)
    public List<ClassScheduleResponse> getSchedulesByFaculty(Long facultyId) {
        return schedules.findByFacultyId(facultyId).stream()
                .map(ClassScheduleResponse::from)
                .toList();
    }

    @Transactional
    public ClassScheduleResponse updateSchedule(Long id, ClassScheduleRequest request) {
        ClassSchedule schedule = schedules.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class schedule not found"));

        schedule.update(
                request.subjectName().trim(),
                request.dayOfWeek().trim().toUpperCase(),
                request.startTime(),
                request.endTime(),
                request.room().trim());

        return ClassScheduleResponse.from(schedules.save(schedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        ClassSchedule schedule = schedules.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class schedule not found"));
        schedules.delete(schedule);
    }
}
