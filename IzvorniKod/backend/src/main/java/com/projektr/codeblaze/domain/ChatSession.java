package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chatSession")
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatSessionId;

    @Column(name = "startCommunicationTime")
    private LocalDateTime startCommunicationTime;
    public Timestamp getStartCommunicationTime() {
        if (startCommunicationTime != null) {
            return Timestamp.valueOf(startCommunicationTime);
        }
        return null;
    }

    @Column(name = "lastMessageTime")
    private LocalDateTime lastMessageTime;
    public Timestamp getLastMessageTime() {
        if (lastMessageTime != null) {
            return Timestamp.valueOf(lastMessageTime);
        }
        return null;
    }

    @ManyToOne
    @JoinColumn(name = "user1", referencedColumnName = "userId")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2", referencedColumnName = "userId")
    private User user2;
}
