package com.appdev_crammers.cit_u.faculty.status.board.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev_crammers.cit_u.faculty.status.board.entity.NotificationEntity;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<NotificationEntity> findByUserIdAndUnreadTrue(Long userId);
}
