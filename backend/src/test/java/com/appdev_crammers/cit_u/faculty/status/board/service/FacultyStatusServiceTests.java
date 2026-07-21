package com.appdev_crammers.cit_u.faculty.status.board.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.FacultyResponse;
import com.appdev_crammers.cit_u.faculty.status.board.dto.UpdateStatusRequest;
import com.appdev_crammers.cit_u.faculty.status.board.entity.AvailabilityStatus;

@SpringBootTest
@Transactional
class FacultyStatusServiceTests {

    @Autowired
    private FacultyStatusService facultyStatusService;

    @Test
    void listsSeededFacultyAndUpdatesStatus() {
        FacultyResponse faculty = facultyStatusService.findAll().get(0);

        FacultyResponse updated = facultyStatusService.updateStatus(faculty.id(),
                new UpdateStatusRequest(AvailabilityStatus.BUSY, "Department meeting", "NGE 301"));

        assertThat(facultyStatusService.findAll()).hasSize(5);
        assertThat(updated.status()).isEqualTo(AvailabilityStatus.BUSY);
        assertThat(updated.statusDescription()).isEqualTo("Department meeting");
        assertThat(updated.room()).isEqualTo("NGE 301");
    }
}
