package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.ConsultationScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.ConsultationScheduleResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.ConsultationScheduleEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.ConsultationScheduleRepository;

@Service
public class ConsultationScheduleService {

    private final ConsultationScheduleRepository schedules;
    private final NotificationService notificationService;

    public ConsultationScheduleService(ConsultationScheduleRepository schedules, NotificationService notificationService) {
        this.schedules = schedules;
        this.notificationService = notificationService;
    }

    @Transactional
    public ConsultationScheduleResponse createSchedule(UserAccountEntity faculty, ConsultationScheduleRequest request) {
        if (faculty.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }

        ConsultationScheduleEntity schedule = new ConsultationScheduleEntity(
                faculty,
                request.day().trim(),
                request.mode().trim(),
                request.startTime().trim(),
                request.endTime().trim(),
                request.location().trim()
        );

        ConsultationScheduleEntity saved = schedules.save(schedule);

        // Trigger notifications
        String studentMsg = faculty.getFullName() + " updated consultation schedule";
        String facultyMsg = "Weekly consultation schedule updated successfully.";

        notificationService.createNotificationsForRole(UserRole.STUDENT, studentMsg, "schedule");
        notificationService.createNotification(faculty, facultyMsg, "schedule");

        return ConsultationScheduleResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ConsultationScheduleResponse> getSchedulesByFaculty(Long facultyId) {
        return schedules.findByFacultyId(facultyId).stream()
                .map(ConsultationScheduleResponse::from)
                .toList();
    }

    @Transactional
    public ConsultationScheduleResponse updateSchedule(Long id, ConsultationScheduleRequest request) {
        ConsultationScheduleEntity schedule = schedules.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation schedule not found"));

        schedule.update(
                request.day().trim(),
                request.mode().trim(),
                request.startTime().trim(),
                request.endTime().trim(),
                request.location().trim()
        );

        return ConsultationScheduleResponse.from(schedules.save(schedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        ConsultationScheduleEntity schedule = schedules.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation schedule not found"));
        schedules.delete(schedule);
    }
}
