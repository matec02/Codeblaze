package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.ImageChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ImageChangeRequestRepository extends JpaRepository<ImageChangeRequest, Long> {
    // Queries! TODO
}