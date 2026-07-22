package com.appdev_crammers.cit_u.faculty.status.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.appdev_crammers.cit_u.faculty.status.board.dto.ConsultationScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.ConsultationScheduleResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;
import com.appdev_crammers.cit_u.faculty.status.board.service.ConsultationScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationScheduleController {

    private final ConsultationScheduleService consultationScheduleService;
    private final UserAccountRepository users;

    public ConsultationScheduleController(ConsultationScheduleService consultationScheduleService, UserAccountRepository users) {
        this.consultationScheduleService = consultationScheduleService;
        this.users = users;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultationScheduleResponse createSchedule(
            @RequestParam Long facultyId,
            @Valid @RequestBody ConsultationScheduleRequest request) {
        UserAccountEntity faculty = users.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found"));
        return consultationScheduleService.createSchedule(faculty, request);
    }

    @GetMapping("/faculty/{facultyId}")
    public List<ConsultationScheduleResponse> getSchedulesByFaculty(@PathVariable Long facultyId) {
        return consultationScheduleService.getSchedulesByFaculty(facultyId);
    }

    @PutMapping("/{id}")
    public ConsultationScheduleResponse updateSchedule(@PathVariable Long id,
                                                       @Valid @RequestBody ConsultationScheduleRequest request) {
        return consultationScheduleService.updateSchedule(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchedule(@PathVariable Long id) {
        consultationScheduleService.deleteSchedule(id);
    }
}
