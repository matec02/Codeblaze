package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    // Queries TODO
}
