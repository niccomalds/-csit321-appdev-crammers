package com.appdev_crammers.cit_u.faculty.status.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;
import com.appdev_crammers.cit_u.faculty.status.board.service.AbsenceAnnouncementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/announcements")
public class AbsenceAnnouncementController {

    private final AbsenceAnnouncementService absenceAnnouncementService;
    private final UserAccountRepository users;

    public AbsenceAnnouncementController(AbsenceAnnouncementService absenceAnnouncementService,
                                         UserAccountRepository users) {
        this.absenceAnnouncementService = absenceAnnouncementService;
        this.users = users;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AbsenceAnnouncementResponse createAnnouncement(
            @RequestParam Long facultyId,
            @Valid @RequestBody AbsenceAnnouncementRequest request) {
        UserAccountEntity faculty = users.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found"));
        return absenceAnnouncementService.createAnnouncement(faculty, request);
    }

    @GetMapping("/active")
    public List<AbsenceAnnouncementResponse> getActiveAnnouncements() {
        return absenceAnnouncementService.getActiveAnnouncements();
    }

    @GetMapping("/faculty/{facultyId}")
    public List<AbsenceAnnouncementResponse> getAnnouncementsByFaculty(@PathVariable Long facultyId) {
        return absenceAnnouncementService.getAnnouncementsByFaculty(facultyId);
    }

    @PatchMapping("/{id}/deactivate")
    public AbsenceAnnouncementResponse deactivateAnnouncement(@PathVariable Long id) {
        return absenceAnnouncementService.deactivateAnnouncement(id);
    }

    @PutMapping("/{id}")
    public AbsenceAnnouncementResponse updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AbsenceAnnouncementRequest request) {
        return absenceAnnouncementService.updateAnnouncement(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAnnouncement(@PathVariable Long id) {
        absenceAnnouncementService.deleteAnnouncement(id);
    }
}
