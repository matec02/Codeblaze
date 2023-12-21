package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUser1UserIdOrUser2UserId(Long user1Id, Long user2Id);
}