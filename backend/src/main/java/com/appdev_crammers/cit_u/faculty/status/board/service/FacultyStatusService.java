package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.FacultyResponse;
import com.appdev_crammers.cit_u.faculty.status.board.dto.UpdateStatusRequest;
import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatus;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.FacultyStatusRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@Service
public class FacultyStatusService {

    private final UserAccountRepository users;
    private final FacultyStatusRepository statuses;
    private final SimpMessagingTemplate messaging;

    public FacultyStatusService(UserAccountRepository users, FacultyStatusRepository statuses,
                          SimpMessagingTemplate messaging) {
        this.users = users;
        this.statuses = statuses;
        this.messaging = messaging;
    }

    @Transactional(readOnly = true)
    public List<FacultyResponse> findAll() {
        return users.findAllByRoleOrderByFullNameAsc(UserRole.FACULTY).stream()
                .map(faculty -> FacultyResponse.from(faculty, findStatus(faculty.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public FacultyResponse findById(Long id) {
        UserAccount faculty = findFaculty(id);
        return FacultyResponse.from(faculty, findStatus(id));
    }

    @Transactional
    public FacultyResponse updateStatus(Long id, UpdateStatusRequest request) {
        UserAccount faculty = findFaculty(id);
        FacultyStatus status = findStatus(id);
        status.update(request.status(), request.description(), request.room());
        FacultyResponse response = FacultyResponse.from(faculty, statuses.save(status));
        messaging.convertAndSend("/topic/faculty-status", response);
        return response;
    }

    private UserAccount findFaculty(Long id) {
        UserAccount user = users.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found"));
        if (user.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }
        return user;
    }

    private FacultyStatus findStatus(Long facultyId) {
        return statuses.findByFacultyId(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty status not found"));
    }
}
