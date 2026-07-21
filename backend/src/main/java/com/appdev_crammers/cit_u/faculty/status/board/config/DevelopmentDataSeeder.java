package com.appdev_crammers.cit_u.faculty.status.board.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.appdev_crammers.cit_u.faculty.status.board.entity.AvailabilityStatus;
import com.appdev_crammers.cit_u.faculty.status.board.entity.FacultyStatus;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.repository.FacultyStatusRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@Configuration
public class DevelopmentDataSeeder {

    @Bean
    CommandLineRunner seedFaculty(UserAccountRepository users, FacultyStatusRepository statuses,
                                  PasswordEncoder passwordEncoder) {
        return args -> {
            if (users.findByEmailIgnoreCase("teacher@cit.edu").isPresent()) return;

            List<FacultySeed> seeds = List.of(
                    new FacultySeed("Josemarie C. Amparo", "teacher@cit.edu", "FAC-2024-0001",
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
                UserAccount faculty = users.save(new UserAccount(seed.name(), seed.email(),
                        passwordEncoder.encode("password123"), UserRole.FACULTY, seed.idNumber(),
                        "College of Computer Studies", null));
                statuses.save(new FacultyStatus(faculty, seed.status(), seed.description(), seed.room()));
            }
        };
    }

    private record FacultySeed(String name, String email, String idNumber, AvailabilityStatus status,
                               String description, String room) {
    }
}
