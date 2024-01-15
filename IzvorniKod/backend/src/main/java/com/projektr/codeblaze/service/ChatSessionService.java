package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ChatSessionRepository;
import com.projektr.codeblaze.domain.ChatSession;
import com.projektr.codeblaze.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

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

    public ChatSession startConversation(User user1, User user2) {
        Long lowerUserId = Math.min(user1.getUserId(), user2.getUserId());
        Long higherUserId = Math.max(user1.getUserId(), user2.getUserId());

        Optional<ChatSession> existingSession = chatSessionRepository.findExistingChatSession(lowerUserId, higherUserId);
        if (existingSession.isPresent()) {
            return existingSession.get();
        }
        ChatSession chatSession = new ChatSession();
        chatSession.setUser1(user1);
        chatSession.setUser2(user2);
        chatSession.setStartCommunicationTime(OffsetDateTime.now());

        return chatSessionRepository.save(chatSession);
    }

    @Transactional
    public void updateLastMessageTime(Long chatSessionId, LocalDateTime lastMessageTime) {
        chatSessionRepository.updateLastMessageTime(chatSessionId, lastMessageTime);
    }

    @Transactional
    public ChatSession update(ChatSession chatSession) {
        return chatSessionRepository.save(chatSession);
    }

    public Optional<ChatSession> findById(Long chatSessionId) {
        return chatSessionRepository.findById(chatSessionId);
    }

    public Optional<ChatSession> findChatSessionBetweenUsers(Long user1Id, Long user2Id) {
        return chatSessionRepository.findExistingChatSession(user1Id, user2Id);
    }

}
