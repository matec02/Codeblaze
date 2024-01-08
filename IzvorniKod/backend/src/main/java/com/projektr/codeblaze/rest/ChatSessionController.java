package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.domain.ChatSession;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.ChatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
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

    @PostMapping(value = "/start", consumes = "multipart/form-data")
    public ResponseEntity<ChatSession> startChatSession(
            @RequestPart("user1") String user1JSON,
            @RequestPart("user2") String user2JSON
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        User user1 = objectMapper.readValue(user1JSON, User.class);
        User user2 = objectMapper.readValue(user2JSON, User.class);

        if (user1 == null || user2 == null || user1 == user2) {
            return ResponseEntity.badRequest().build();
        }
        ChatSession chatSession = chatSessionService.startConversation(user1, user2);
        if (chatSession != null) {
            return ResponseEntity.ok(chatSession);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{chatSessionId}")
    public ResponseEntity<ChatSession> getChatSession(@PathVariable Long chatSessionId) {
        return chatSessionService.findById(chatSessionId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{chatSessionId}/update-last-message-time")
    public ResponseEntity<?> updateLastMessageTime(@PathVariable Long chatSessionId,
                                                   @RequestBody LocalDateTime lastMessageTime) {
        chatSessionService.updateLastMessageTime(chatSessionId, lastMessageTime);
        return ResponseEntity.ok().build();
    }
}
