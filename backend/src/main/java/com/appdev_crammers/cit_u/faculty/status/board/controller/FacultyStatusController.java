package com.appdev_crammers.cit_u.faculty.status.board.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev_crammers.cit_u.faculty.status.board.dto.FacultyResponse;
import com.appdev_crammers.cit_u.faculty.status.board.dto.UpdateStatusRequest;
import com.appdev_crammers.cit_u.faculty.status.board.service.FacultyStatusService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/faculty")
public class FacultyStatusController {

    private final FacultyStatusService facultyStatusService;

    public FacultyStatusController(FacultyStatusService facultyStatusService) {
        this.facultyStatusService = facultyStatusService;
    }

    @GetMapping
    public List<FacultyResponse> findAll() {
        return facultyStatusService.findAll();
    }

    @GetMapping("/{id}")
    public FacultyResponse findById(@PathVariable Long id) {
        return facultyStatusService.findById(id);
    }

    @PutMapping("/{id}/status")
    public FacultyResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        return facultyStatusService.updateStatus(id, request);
    }
}
