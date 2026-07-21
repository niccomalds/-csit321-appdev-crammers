package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AbsenceAnnouncement;

public interface AbsenceAnnouncementRepository extends JpaRepository<AbsenceAnnouncement, Long> {
    List<AbsenceAnnouncement> findByFacultyId(Long facultyId);
    List<AbsenceAnnouncement> findByActiveTrue();
    Optional<AbsenceAnnouncement> findByIdAndActiveTrue(Long id);
}
