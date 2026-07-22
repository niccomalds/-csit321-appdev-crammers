package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.FacultyResponse;
import com.appdev_crammers.cit_u.faculty.status.board.dto.UpdateStatusRequest;
import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatusEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.FacultyStatusRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@Service
public class FacultyStatusService {

    private final UserAccountRepository users;
    private final FacultyStatusRepository statuses;
    private final SimpMessagingTemplate messaging;
    private final NotificationService notificationService;

    public FacultyStatusService(UserAccountRepository users, FacultyStatusRepository statuses,
                          SimpMessagingTemplate messaging, NotificationService notificationService) {
        this.users = users;
        this.statuses = statuses;
        this.messaging = messaging;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<FacultyResponse> findAll() {
        return users.findAllByRoleOrderByFullNameAsc(UserRole.FACULTY).stream()
                .map(faculty -> FacultyResponse.from(faculty, findStatus(faculty.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public FacultyResponse findById(Long id) {
        UserAccountEntity faculty = findFaculty(id);
        return FacultyResponse.from(faculty, findStatus(id));
    }

    @Transactional
    public FacultyResponse updateStatus(Long id, UpdateStatusRequest request) {
        UserAccountEntity faculty = findFaculty(id);
        FacultyStatusEntity status = findStatus(id);
        status.update(request.status(), request.description(), request.room());
        FacultyResponse response = FacultyResponse.from(faculty, statuses.save(status));
        
        // Trigger real-time status update notifications
        String statusLabel = getFriendlyStatus(request.status());
        String msgDetail = (request.description() == null || request.description().isBlank()) ? "" : " — " + request.description();
        String studentMsg = faculty.getFullName() + " changed status to " + statusLabel + msgDetail;
        String facultyMsg = "Your status was successfully updated to '" + statusLabel + "'." + msgDetail;

        notificationService.createNotificationsForRole(UserRole.STUDENT, studentMsg, "status");
        notificationService.createNotification(faculty, facultyMsg, "status");

        messaging.convertAndSend("/topic/faculty-status", response);
        return response;
    }

    private String getFriendlyStatus(com.appdev_crammers.cit_u.faculty.status.board.entity.AvailabilityStatus status) {
        if (status == null) return "Available";
        return switch (status) {
            case AVAILABLE -> "Available";
            case IN_CLASS -> "Class Ongoing";
            case BUSY -> "In a Meeting";
            case OUT -> "Do Not Disturb";
        };
    }

    private UserAccountEntity findFaculty(Long id) {
        UserAccountEntity user = users.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found"));
        if (user.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }
        return user;
    }

    private FacultyStatusEntity findStatus(Long facultyId) {
        return statuses.findByFacultyId(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty status not found"));
    }
}
