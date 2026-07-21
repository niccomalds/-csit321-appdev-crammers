package com.appdev_crammers.cit_u.faculty.status.board.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.auth.dto.LoginRequest;
import com.appdev_crammers.cit_u.faculty.status.board.auth.dto.RegisterRequest;
import com.appdev_crammers.cit_u.faculty.status.board.auth.dto.UserResponse;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ConflictException;
import com.appdev_crammers.cit_u.faculty.status.board.user.UserRole;

@SpringBootTest
@Transactional
class AuthServiceTests {

    @Autowired
    private AuthService authService;

    @Test
    void registersAndAuthenticatesStudent() {
        RegisterRequest request = new RegisterRequest(
                "Test Student", "3rd Year - BSIT", "student.test@cit.edu",
                "22-1234-567", "password123");

        UserResponse registered = authService.register(request);
        UserResponse loggedIn = authService.login(new LoginRequest(request.email(), request.password()));

        assertThat(registered.role()).isEqualTo(UserRole.STUDENT);
        assertThat(loggedIn.id()).isEqualTo(registered.id());
    }

    @Test
    void rejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "Test Student", "3rd Year - BSIT", "duplicate@cit.edu",
                "22-1234-568", "password123");
        authService.register(request);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ConflictException.class);
    }
}
