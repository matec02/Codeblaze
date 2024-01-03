package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "messageId", updatable = false, nullable = false)
    private Long messageId;

    @Column(name = "senderUsername", nullable = false, length = 50)
    private String senderUsername;

    @Column(name = "text", nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "sentTime", nullable = false)
    private LocalDateTime sentTime;

    // Getter method for the paymentTimestamp property
    // If it's needed to get actual Timestamp, CHECK THIS!!!!
    public Timestamp getMessageTimestamp() {
        if (sentTime != null) {
            return Timestamp.valueOf(sentTime);
        }
        return null; // Handle the case when paymentTime is null, if needed
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private MessageStatus status;

    @ManyToOne
    @JoinColumn(name = "chatSession", referencedColumnName = "chatSessionId", nullable = false)
    private ChatSession chatSession;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    private User user;
}

