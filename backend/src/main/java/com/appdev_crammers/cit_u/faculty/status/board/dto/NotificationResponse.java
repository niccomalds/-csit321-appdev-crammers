package com.appdev_crammers.cit_u.faculty.status.board.dto;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import com.appdev_crammers.cit_u.faculty.status.board.entity.NotificationEntity;

public record NotificationResponse(
        Long id,
        String message,
        String timestamp,
        String date,
        String type,
        boolean unread) {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a")
            .withZone(ZoneId.of("Asia/Manila"));
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            .withZone(ZoneId.of("Asia/Manila"));

    public static NotificationResponse from(NotificationEntity entity) {
        Instant created = entity.getCreatedAt();
        String formattedTime = TIME_FORMATTER.format(created);
        
        String formattedDate = DATE_FORMATTER.format(created);
        String today = DATE_FORMATTER.format(Instant.now());
        String yesterday = DATE_FORMATTER.format(Instant.now().minus(java.time.Duration.ofDays(1)));
        
        String relativeDate;
        if (formattedDate.equals(today)) {
            relativeDate = "Today";
        } else if (formattedDate.equals(yesterday)) {
            relativeDate = "Yesterday";
        } else {
            relativeDate = formattedDate;
        }

        return new NotificationResponse(
                entity.getId(),
                entity.getMessage(),
                formattedTime,
                relativeDate,
                entity.getType(),
                entity.isUnread()
        );
    }
}
