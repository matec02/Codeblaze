package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Review;
import com.projektr.codeblaze.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, User> {
    @Query("SELECT r FROM Review r WHERE (r.renterUsername.userId = :userId)")
    List<Review> findReviewsByUserId(Long userId);

    @Query("SELECT r FROM Review r WHERE r.reviewId = :id")
    Review findById(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Review r WHERE r.reviewId = :id")
    int deleteById(Long id);

    @Query("SELECT AVG(r.stars) FROM Review r WHERE (r.renterUsername.userId = :userId)")
    Double getAverageRating(Long userId);

    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.transaction.transactionId = :transactionId")
    boolean existsByTransactionId(Long transactionId);

}
