package com.appdev_crammers.cit_u.faculty.status.board.faculty;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev_crammers.cit_u.faculty.status.board.faculty.dto.FacultyResponse;
import com.appdev_crammers.cit_u.faculty.status.board.status.dto.UpdateStatusRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    List<FacultyResponse> findAll() {
        return facultyService.findAll();
    }

    @GetMapping("/{id}")
    FacultyResponse findById(@PathVariable Long id) {
        return facultyService.findById(id);
    }

    @PutMapping("/{id}/status")
    FacultyResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        return facultyService.updateStatus(id, request);
    }
}
