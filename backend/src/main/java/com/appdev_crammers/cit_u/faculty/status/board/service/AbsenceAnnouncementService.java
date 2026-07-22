package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.AbsenceAnnouncementEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.AbsenceAnnouncementRepository;

@Service
public class AbsenceAnnouncementService {

    private final AbsenceAnnouncementRepository announcements;

    public AbsenceAnnouncementService(AbsenceAnnouncementRepository announcements) {
        this.announcements = announcements;
    }

    @Transactional
    public AbsenceAnnouncementResponse createAnnouncement(UserAccountEntity faculty, AbsenceAnnouncementRequest request) {
        if (faculty.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }

        AbsenceAnnouncementEntity announcement = new AbsenceAnnouncementEntity(
                faculty,
                request.reason().trim(),
                request.startDate(),
                request.endDate(),
                request.startTime().trim(),
                request.returnDate(),
                request.details().trim());

        return AbsenceAnnouncementResponse.from(announcements.save(announcement));
    }

    @Transactional(readOnly = true)
    public List<AbsenceAnnouncementResponse> getActiveAnnouncements() {
        return announcements.findByActiveTrue().stream()
                .map(AbsenceAnnouncementResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AbsenceAnnouncementResponse> getAnnouncementsByFaculty(Long facultyId) {
        return announcements.findByFacultyId(facultyId).stream()
                .map(AbsenceAnnouncementResponse::from)
                .toList();
    }

    @Transactional
    public AbsenceAnnouncementResponse deactivateAnnouncement(Long id) {
        AbsenceAnnouncementEntity announcement = announcements.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcement.deactivate();
        return AbsenceAnnouncementResponse.from(announcements.save(announcement));
    }

    @Transactional
    public AbsenceAnnouncementResponse updateAnnouncement(Long id, AbsenceAnnouncementRequest request) {
        AbsenceAnnouncementEntity announcement = announcements.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcement.update(
                request.reason().trim(),
                request.startDate(),
                request.endDate(),
                request.startTime().trim(),
                request.returnDate(),
                request.details().trim());
        return AbsenceAnnouncementResponse.from(announcements.save(announcement));
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        AbsenceAnnouncementEntity announcement = announcements.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcements.delete(announcement);
    }
}
