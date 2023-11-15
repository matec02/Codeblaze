package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Review;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, User> {
    // Queries TODO
}
