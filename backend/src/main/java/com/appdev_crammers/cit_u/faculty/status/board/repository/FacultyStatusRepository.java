package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatus;

public interface FacultyStatusRepository extends JpaRepository<FacultyStatus, Long> {
    Optional<FacultyStatus> findByFacultyId(Long facultyId);
}
