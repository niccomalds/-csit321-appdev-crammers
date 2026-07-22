package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.ClassSchedule;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {
    List<ClassSchedule> findByFacultyId(Long facultyId);
    List<ClassSchedule> findByFacultyIdAndDayOfWeek(Long facultyId, String dayOfWeek);
}
