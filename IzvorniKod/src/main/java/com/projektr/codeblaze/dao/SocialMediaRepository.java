package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.SocialMedia;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialMediaRepository extends JpaRepository<SocialMedia, User> {
    // Queries! TODO
}
