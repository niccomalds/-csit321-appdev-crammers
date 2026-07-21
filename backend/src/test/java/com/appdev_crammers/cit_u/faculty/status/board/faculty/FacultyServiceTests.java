package com.appdev_crammers.cit_u.faculty.status.board.faculty;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.faculty.dto.FacultyResponse;
import com.appdev_crammers.cit_u.faculty.status.board.status.AvailabilityStatus;
import com.appdev_crammers.cit_u.faculty.status.board.status.dto.UpdateStatusRequest;

@SpringBootTest
@Transactional
class FacultyServiceTests {

    @Autowired
    private FacultyService facultyService;

    @Test
    void listsSeededFacultyAndUpdatesStatus() {
        FacultyResponse faculty = facultyService.findAll().get(0);

        FacultyResponse updated = facultyService.updateStatus(faculty.id(),
                new UpdateStatusRequest(AvailabilityStatus.BUSY, "Department meeting", "NGE 301"));

        assertThat(facultyService.findAll()).hasSize(5);
        assertThat(updated.status()).isEqualTo(AvailabilityStatus.BUSY);
        assertThat(updated.statusDescription()).isEqualTo("Department meeting");
        assertThat(updated.room()).isEqualTo("NGE 301");
    }
}
