package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.ConsultationScheduleEntity;

@Repository
public interface ConsultationScheduleRepository extends JpaRepository<ConsultationScheduleEntity, Long> {
    List<ConsultationScheduleEntity> findByFacultyId(Long facultyId);
}
