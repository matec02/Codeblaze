package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Message;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatSessionChatSessionIdOrderBySentTimeAsc(Long chatSessionId);
}