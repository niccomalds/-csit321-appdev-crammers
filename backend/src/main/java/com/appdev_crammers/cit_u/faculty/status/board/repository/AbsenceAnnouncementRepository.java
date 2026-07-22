package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AbsenceAnnouncementEntity;

public interface AbsenceAnnouncementRepository extends JpaRepository<AbsenceAnnouncementEntity, Long> {
    List<AbsenceAnnouncementEntity> findByFacultyId(Long facultyId);
    List<AbsenceAnnouncementEntity> findByActiveTrue();
    Optional<AbsenceAnnouncementEntity> findByIdAndActiveTrue(Long id);
}
