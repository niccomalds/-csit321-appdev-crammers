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

import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.ClassScheduleResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;
import com.appdev_crammers.cit_u.faculty.status.board.service.ClassScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/schedules")
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;
    private final UserAccountRepository users;

    public ClassScheduleController(ClassScheduleService classScheduleService, UserAccountRepository users) {
        this.classScheduleService = classScheduleService;
        this.users = users;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClassScheduleResponse createSchedule(
            @RequestParam Long facultyId,
            @Valid @RequestBody ClassScheduleRequest request) {
        UserAccount faculty = users.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member not found"));
        return classScheduleService.createSchedule(faculty, request);
    }

    @GetMapping("/faculty/{facultyId}")
    public List<ClassScheduleResponse> getSchedulesByFaculty(@PathVariable Long facultyId) {
        return classScheduleService.getSchedulesByFaculty(facultyId);
    }

    @PutMapping("/{id}")
    public ClassScheduleResponse updateSchedule(@PathVariable Long id,
                                               @Valid @RequestBody ClassScheduleRequest request) {
        return classScheduleService.updateSchedule(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchedule(@PathVariable Long id) {
        classScheduleService.deleteSchedule(id);
    }
}
