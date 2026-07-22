package com.appdev_crammers.cit_u.faculty.status.board.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@SpringBootTest
@Transactional
class ClassScheduleServiceTests {

    @Autowired
    private ClassScheduleService classScheduleService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void createsAndFetchesFacultySchedules() {
        UserAccountEntity faculty = userAccountRepository.save(new UserAccountEntity(
                "Test Faculty",
                "test.faculty.class@cit.edu",
                "hashed-password",
                UserRole.FACULTY,
                "FAC-TEST-002",
                "College of Computer Studies",
                null));

        ClassScheduleRequest request = new ClassScheduleRequest(
                "CSIT 321",
                "MONDAY",
                LocalTime.of(8, 0),
                LocalTime.of(9, 30),
                "RTL 302");

        classScheduleService.createSchedule(faculty, request);

        assertThat(classScheduleService.getSchedulesByFaculty(faculty.getId())).hasSize(1);
    }
}
