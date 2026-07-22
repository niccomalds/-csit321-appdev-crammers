package com.appdev_crammers.cit_u.faculty.status.board.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.LoginRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.RegisterRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.UserResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ConflictException;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ResourceNotFoundException;
import com.appdev_crammers.cit_u.faculty.status.board.exception.UnauthorizedException;
import com.appdev_crammers.cit_u.faculty.status.board.repository.FacultyStatusRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;

@Service
public class UserAccountService {

    private final UserAccountRepository users;
    private final FacultyStatusRepository facultyStatuses;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository users, FacultyStatusRepository facultyStatuses, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.facultyStatuses = facultyStatuses;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("An account with this email already exists");
        }
        if (users.existsByIdNumberIgnoreCase(request.idNumber())) {
            throw new ConflictException("An account with this ID number already exists");
        }

        UserAccountEntity user = new UserAccountEntity(
                request.fullName().trim(),
                request.email(),
                passwordEncoder.encode(request.password()),
                UserRole.STUDENT,
                request.idNumber().trim(),
                request.department().trim(),
                request.course().trim(),
                request.year().trim()
        );
        return UserResponse.from(users.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        UserAccountEntity user = users.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return UserResponse.from(user);
    }

    @Transactional
    public void delete(Long id) {
        UserAccountEntity user = users.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));
        
        if (user.getRole() == UserRole.FACULTY) {
            facultyStatuses.findByFacultyId(id).ifPresent(facultyStatuses::delete);
        }
        
        users.delete(user);
    }
}
