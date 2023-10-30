package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.IdentificationDocument;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdentificationDocumentRepository extends JpaRepository<IdentificationDocument, Long> {
    IdentificationDocument findByUser(User user);
}
