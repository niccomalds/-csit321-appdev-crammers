package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.ClassScheduleEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.ClassScheduleRepository;

@Service
public class ClassScheduleService {

    private final ClassScheduleRepository schedules;
    private final NotificationService notificationService;

    public ClassScheduleService(ClassScheduleRepository schedules, NotificationService notificationService) {
        this.schedules = schedules;
        this.notificationService = notificationService;
    }

    @Transactional
    public ClassScheduleResponse createSchedule(UserAccountEntity faculty, ClassScheduleRequest request) {
        if (faculty.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }

        ClassScheduleEntity schedule = new ClassScheduleEntity(
                faculty,
                request.subjectName().trim(),
                request.dayOfWeek().trim().toUpperCase(),
                request.startTime(),
                request.endTime(),
                request.room().trim());

        ClassScheduleEntity saved = schedules.save(schedule);

        // Trigger notifications
        String studentMsg = faculty.getFullName() + " added class schedule: " + saved.getSubjectName() + " at " + saved.getRoom();
        String facultyMsg = "Class schedule added: " + saved.getSubjectName() + " at " + saved.getRoom();
        
        notificationService.createNotificationsForRole(UserRole.STUDENT, studentMsg, "schedule");
        notificationService.createNotification(faculty, facultyMsg, "schedule");

        return ClassScheduleResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassScheduleResponse> getSchedulesByFaculty(Long facultyId) {
        return schedules.findByFacultyId(facultyId).stream()
                .map(ClassScheduleResponse::from)
                .toList();
    }

    @Transactional
    public ClassScheduleResponse updateSchedule(Long id, ClassScheduleRequest request) {
        ClassScheduleEntity schedule = schedules.findById(id)
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
        ClassScheduleEntity schedule = schedules.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class schedule not found"));
        schedules.delete(schedule);
    }
}
