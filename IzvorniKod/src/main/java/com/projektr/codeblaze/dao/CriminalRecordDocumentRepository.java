package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.CriminalRecordDocument;
import com.projektr.codeblaze.domain.IdentificationDocument;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CriminalRecordDocumentRepository extends JpaRepository<IdentificationDocument, Long> {
    CriminalRecordDocument findByUser(User user);
}
