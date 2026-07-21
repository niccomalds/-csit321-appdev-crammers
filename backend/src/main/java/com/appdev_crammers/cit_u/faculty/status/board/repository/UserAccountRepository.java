package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccount;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByIdNumberIgnoreCase(String idNumber);
    List<UserAccount> findAllByRoleOrderByFullNameAsc(UserRole role);
}
