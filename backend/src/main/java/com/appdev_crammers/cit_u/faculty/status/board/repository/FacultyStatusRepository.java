package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatusEntity;

public interface FacultyStatusRepository extends JpaRepository<FacultyStatusEntity, Long> {
    Optional<FacultyStatusEntity> findByFacultyId(Long facultyId);
}
