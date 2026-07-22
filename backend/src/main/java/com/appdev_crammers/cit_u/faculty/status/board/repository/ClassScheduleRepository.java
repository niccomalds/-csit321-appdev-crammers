package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.ClassScheduleEntity;

public interface ClassScheduleRepository extends JpaRepository<ClassScheduleEntity, Long> {
    List<ClassScheduleEntity> findByFacultyId(Long facultyId);
    List<ClassScheduleEntity> findByFacultyIdAndDayOfWeek(Long facultyId, String dayOfWeek);
}
