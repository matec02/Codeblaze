package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ChatSessionRepository;
import com.projektr.codeblaze.domain.ChatSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatSessionService {

    private final ChatSessionRepository chatSessionRepository;

    @Autowired
    public ChatSessionService(ChatSessionRepository chatSessionRepository) {
        this.chatSessionRepository = chatSessionRepository;
    }

    public List<ChatSession> getChatSessionsForUser(Long userId) {
        return chatSessionRepository.findByUser1UserIdOrUser2UserId(userId, userId);
    }
}
