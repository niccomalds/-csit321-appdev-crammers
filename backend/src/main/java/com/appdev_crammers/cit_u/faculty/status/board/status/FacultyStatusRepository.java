package com.appdev_crammers.cit_u.faculty.status.board.status;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyStatusRepository extends JpaRepository<FacultyStatus, Long> {
    Optional<FacultyStatus> findByFacultyId(Long facultyId);
}
