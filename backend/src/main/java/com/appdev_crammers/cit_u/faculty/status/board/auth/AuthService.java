package com.appdev_crammers.cit_u.faculty.status.board.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.auth.dto.LoginRequest;
import com.appdev_crammers.cit_u.faculty.status.board.auth.dto.RegisterRequest;
import com.appdev_crammers.cit_u.faculty.status.board.auth.dto.UserResponse;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ConflictException;
import com.appdev_crammers.cit_u.faculty.status.board.exception.UnauthorizedException;
import com.appdev_crammers.cit_u.faculty.status.board.user.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.user.UserAccountRepository;
import com.appdev_crammers.cit_u.faculty.status.board.user.UserRole;

@Service
public class AuthService {

    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserAccountRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
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

        UserAccount user = new UserAccount(
                request.fullName().trim(), request.email(), passwordEncoder.encode(request.password()),
                UserRole.STUDENT, request.idNumber().trim(), null, request.yearCourse().trim());
        return UserResponse.from(users.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        UserAccount user = users.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return UserResponse.from(user);
    }
}
