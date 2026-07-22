package com.appdev_crammers.cit_u.faculty.status.board.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.appdev_crammers.cit_u.faculty.status.board.dto.LoginRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.RegisterRequest;
import com.appdev_crammers.cit_u.faculty.status.board.dto.UserResponse;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.exception.ConflictException;

@SpringBootTest
@Transactional
class UserAccountServiceTests {

    @Autowired
    private UserAccountService userAccountService;

    @Test
    void registersAndAuthenticatesStudent() {
        RegisterRequest request = new RegisterRequest(
                "Test Student", "College of Computer Studies", "BSIT", "3rd Year", "student.test@cit.edu",
                "22-1234-567", "password123");

        UserResponse registered = userAccountService.register(request);
        UserResponse loggedIn = userAccountService.login(new LoginRequest(request.email(), request.password()));

        assertThat(registered.role()).isEqualTo(UserRole.STUDENT);
        assertThat(loggedIn.id()).isEqualTo(registered.id());
    }

    @Test
    void rejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "Test Student", "College of Computer Studies", "BSIT", "3rd Year", "duplicate@cit.edu",
                "22-1234-568", "password123");
        userAccountService.register(request);

        assertThatThrownBy(() -> userAccountService.register(request))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void deletesRegisteredUser() {
        RegisterRequest request = new RegisterRequest(
                "Deletable Student", "College of Computer Studies", "BSIT", "3rd Year", "delete.me@cit.edu",
                "22-9999-999", "password123");
        UserResponse registered = userAccountService.register(request);

        userAccountService.delete(registered.id());

        assertThatThrownBy(() -> userAccountService.login(new LoginRequest("delete.me@cit.edu", "password123")))
                .isInstanceOf(com.appdev_crammers.cit_u.faculty.status.board.exception.UnauthorizedException.class);
    }
}
