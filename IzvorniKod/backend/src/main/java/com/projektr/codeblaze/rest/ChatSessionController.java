package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.ChatSession;
import com.projektr.codeblaze.service.ChatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat-session")
public class ChatSessionController {
    private final ChatSessionService chatSessionService;

    @Autowired
    public ChatSessionController(ChatSessionService chatSessionService) {
        this.chatSessionService = chatSessionService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatSession>> getChatSessionsForUser(@PathVariable Long userId) {
        List<ChatSession> sessions = chatSessionService.getChatSessionsForUser(userId);
        if (sessions.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(sessions);
        }
    }
}
