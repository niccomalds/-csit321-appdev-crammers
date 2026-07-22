package com.appdev_crammers.cit_u.faculty.status.board.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.ConsultationScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.ConsultationScheduleResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@SpringBootTest
@Transactional
class ConsultationScheduleServiceTests {

    @Autowired
    private ConsultationScheduleService consultationScheduleService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void createsFetchesUpdatesAndDeletesConsultationSchedules() {
        UserAccountEntity faculty = userAccountRepository.save(new UserAccountEntity(
                "Test Faculty",
                "test.faculty.consult@cit.edu",
                "hashed-password",
                UserRole.FACULTY,
                "FAC-TEST-003",
                "College of Computer Studies",
                null,
                null));

        ConsultationScheduleRequest request = new ConsultationScheduleRequest(
                "Monday",
                "Face-to-Face",
                "09:00 AM",
                "11:00 AM",
                "CSS Dept. Faculty Room");

        ConsultationScheduleResponse created = consultationScheduleService.createSchedule(faculty, request);
        assertThat(created.id()).isNotNull();
        assertThat(created.day()).isEqualTo("Monday");

        assertThat(consultationScheduleService.getSchedulesByFaculty(faculty.getId())).hasSize(1);

        ConsultationScheduleRequest updateRequest = new ConsultationScheduleRequest(
                "Wednesday",
                "Online",
                "10:00 AM",
                "12:00 PM",
                "MS Teams");

        ConsultationScheduleResponse updated = consultationScheduleService.updateSchedule(created.id(), updateRequest);
        assertThat(updated.day()).isEqualTo("Wednesday");
        assertThat(updated.mode()).isEqualTo("Online");

        consultationScheduleService.deleteSchedule(updated.id());
        assertThat(consultationScheduleService.getSchedulesByFaculty(faculty.getId())).isEmpty();
    }
}
