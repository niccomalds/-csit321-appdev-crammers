package com.appdev_crammers.cit_u.faculty.status.board.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.appdev_crammers.cit_u.faculty.status.board.entity.NotificationEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserAccountEntity;
import com.appdev_crammers.cit_u.faculty.status.board.entity.UserRole;
import com.appdev_crammers.cit_u.faculty.status.board.repository.NotificationRepository;
import com.appdev_crammers.cit_u.faculty.status.board.repository.UserAccountRepository;
import com.appdev_crammers.cit_u.faculty.status.board.dto.NotificationResponse;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserAccountRepository userAccountRepository;

    public NotificationService(NotificationRepository notificationRepository, UserAccountRepository userAccountRepository) {
        this.notificationRepository = notificationRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long id) {
        NotificationEntity notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setUnread(false);
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<NotificationEntity> unread = notificationRepository.findByUserIdAndUnreadTrue(userId);
        for (NotificationEntity notification : unread) {
            notification.setUnread(false);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void createNotification(UserAccountEntity user, String message, String type) {
        NotificationEntity notification = new NotificationEntity(user, message, type);
        notificationRepository.save(notification);
    }

    @Transactional
    public void createNotificationsForRole(UserRole role, String message, String type) {
        List<UserAccountEntity> users = userAccountRepository.findAllByRoleOrderByFullNameAsc(role);
        List<NotificationEntity> notifications = users.stream()
                .map(user -> new NotificationEntity(user, message, type))
                .toList();
        notificationRepository.saveAll(notifications);
    }
}
