package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notificationId", updatable = false, nullable = false)
    private Long notificationId;

    @Column(name = "content")
    private String content;

    @Column(name = "isRead")
    private boolean isRead;

    @Column(name = "sentTime")
    private LocalDateTime sentTime;
    public Timestamp getSentTime() {
        if (sentTime != null) {
            return Timestamp.valueOf(sentTime);
        }
        return null;
    }

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "requestingUser", referencedColumnName = "userId")
    private User requestingUser;

    @ManyToOne
    @JoinColumn(name = "decisionAdmin", referencedColumnName = "userId")
    private User adminId;
}
