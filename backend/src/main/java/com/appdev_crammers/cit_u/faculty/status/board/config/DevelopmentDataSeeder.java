package com.appdev_crammers.cit_u.faculty.status.board.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AvailabilityStatus;
import com.appdev_crammers.cit_u.faculty.status.board.entity.ConsultationScheduleEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatusEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.repository.ConsultationScheduleRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.FacultyStatusRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@Configuration
public class DevelopmentDataSeeder {

    @Bean
    CommandLineRunner seedFaculty(UserAccountRepository users, FacultyStatusRepository statuses,
                                  ConsultationScheduleRepository consultationSchedules,
                                  org.springframework.jdbc.core.JdbcTemplate jdbcTemplate,
                                  PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE consultation_schedules DROP COLUMN day");
            } catch (Exception e) {
                // Ignore if the column or table does not exist
            }

            try {
                jdbcTemplate.update("UPDATE user_accounts SET email = 'josemarie.amparo@cit.edu' WHERE email = 'teacher@cit.edu'");
            } catch (Exception e) {
                // Ignore if table doesn't exist yet
            }

            if (users.findByEmailIgnoreCase("josemarie.amparo@cit.edu").isPresent()) return;

            List<FacultySeed> seeds = List.of(
                    new FacultySeed("Josemarie C. Amparo", "josemarie.amparo@cit.edu", "FAC-2024-0001",
                            AvailabilityStatus.OUT, "Dubai Hackathon 2026 — Official Representation", "CSS Dept. Faculty Room"),
                    new FacultySeed("Leah V. Barbaso", "leah.barbaso@cit.edu", "FAC-2024-0002",
                            AvailabilityStatus.IN_CLASS, "Class Ongoing — ITEC 312, Lab 3", "CSS Dept. Faculty Room"),
                    new FacultySeed("Jasmine A. Tulin", "jasmine.tulin@cit.edu", "FAC-2024-0003",
                            AvailabilityStatus.IN_CLASS, "Class Ongoing — CSIT122, RTL 302", "CSS Dept. Faculty Room"),
                    new FacultySeed("Roden J. Ugang", "roden.ugang@cit.edu", "FAC-2024-0004",
                            AvailabilityStatus.AVAILABLE, "In Office — NGE, CSS Department", "NGE Building, 3rd Floor"),
                    new FacultySeed("Von Alphonse L. Godinez", "von.godinez@cit.edu", "FAC-2024-0005",
                            AvailabilityStatus.AVAILABLE, "Available for consultation", "CSS Dept. Faculty Room"));

            for (FacultySeed seed : seeds) {
                UserAccountEntity faculty = users.save(new UserAccountEntity(seed.name(), seed.email(),
                        passwordEncoder.encode("password123"), UserRole.FACULTY, seed.idNumber(),
                        "College of Computer Studies", null, null));
                statuses.save(new FacultyStatusEntity(faculty, seed.status(), seed.description(), seed.room()));

                if (seed.email().equals("josemarie.amparo@cit.edu")) {
                    consultationSchedules.save(new ConsultationScheduleEntity(faculty, "Monday", "Face-to-Face", "09:00 AM", "11:00 AM", "CSS Dept. Faculty Room"));
                    consultationSchedules.save(new ConsultationScheduleEntity(faculty, "Wednesday", "Online", "09:00 AM", "11:00 AM", "CSS Dept. Faculty Room"));
                } else if (seed.email().equals("leah.barbaso@cit.edu")) {
                    consultationSchedules.save(new ConsultationScheduleEntity(faculty, "Tuesday", "Face-to-Face", "01:00 PM", "03:00 PM", "CSS Dept. Faculty Room"));
                    consultationSchedules.save(new ConsultationScheduleEntity(faculty, "Thursday", "Online", "10:00 AM", "12:00 PM", "MS Teams"));
                }
            }
        };
    }

    private record FacultySeed(String name, String email, String idNumber, AvailabilityStatus status,
                               String description, String room) {
    }
}
