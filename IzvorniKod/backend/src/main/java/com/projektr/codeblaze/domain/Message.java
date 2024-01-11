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

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private MessageStatus status;

    @ManyToOne
    @JoinColumn(name = "chatSession", referencedColumnName = "chatSessionId", nullable = false)
    private ChatSession chatSession;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private MessageType messageType = MessageType.REGULAR;

    @Column(name = "listingId")
    private Long listingId = null;
}

