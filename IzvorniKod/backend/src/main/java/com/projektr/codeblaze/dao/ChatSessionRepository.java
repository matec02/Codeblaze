package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUser1UserIdOrUser2UserId(Long user1Id, Long user2Id);

    @Query("SELECT cs FROM ChatSession cs WHERE (cs.user1.userId = :user1Id AND cs.user2.userId = :user2Id) OR (cs.user1.userId = :user2Id AND cs.user2.userId = :user1Id)")
    Optional<ChatSession> findExistingChatSession(Long user1Id, Long user2Id);

    @Modifying
    @Query("update ChatSession cs SET cs.lastMessageTime = :lastMessageTime WHERE cs.chatSessionId = :chatSessionId")
    void updateLastMessageTime(Long chatSessionId, LocalDateTime lastMessageTime);

}