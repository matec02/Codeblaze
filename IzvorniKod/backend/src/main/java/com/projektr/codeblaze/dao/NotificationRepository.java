package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Queries! TODO
}
