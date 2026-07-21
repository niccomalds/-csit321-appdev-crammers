package com.appdev_crammers.cit_u.faculty.status.board.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.AbsenceAnnouncementRequest;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@SpringBootTest
@Transactional
class AbsenceAnnouncementServiceTests {

    @Autowired
    private AbsenceAnnouncementService absenceAnnouncementService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void createsAndFetchesActiveAnnouncements() {
        UserAccount faculty = userAccountRepository.save(new UserAccount(
                "Test Faculty",
                "test.faculty@cit.edu",
                "hashed-password",
                UserRole.FACULTY,
                "FAC-TEST-001",
                "College of Computer Studies",
                null));

        AbsenceAnnouncementRequest request = new AbsenceAnnouncementRequest(
                "Official Travel",
                LocalDate.of(2026, 7, 20),
                LocalDate.of(2026, 7, 25),
                "Attending a conference");

        absenceAnnouncementService.createAnnouncement(faculty, request);

        assertThat(absenceAnnouncementService.getActiveAnnouncements()).hasSize(1);
        assertThat(absenceAnnouncementService.getAnnouncementsByFaculty(faculty.getId())).hasSize(1);
    }
}
