package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.AbsenceAnnouncement;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
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
    public AbsenceAnnouncementResponse createAnnouncement(UserAccount faculty, AbsenceAnnouncementRequest request) {
        if (faculty.getRole() != UserRole.FACULTY) {
            throw new ResourceNotFoundException("Faculty member not found");
        }

        AbsenceAnnouncement announcement = new AbsenceAnnouncement(
                faculty,
                request.reason().trim(),
                request.startDate(),
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
        AbsenceAnnouncement announcement = announcements.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcement.deactivate();
        return AbsenceAnnouncementResponse.from(announcements.save(announcement));
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        AbsenceAnnouncement announcement = announcements.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcements.delete(announcement);
    }
}
