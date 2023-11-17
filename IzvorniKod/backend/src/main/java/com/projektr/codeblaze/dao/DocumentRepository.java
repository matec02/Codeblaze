package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    Optional<Document> findByUserId(Long UserId);

    // Queries! TODO
}