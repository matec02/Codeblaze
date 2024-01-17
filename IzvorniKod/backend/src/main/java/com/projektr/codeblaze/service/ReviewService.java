package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ReviewRepository;
import com.projektr.codeblaze.dao.TransactionRepository;
import com.projektr.codeblaze.domain.Review;
import com.projektr.codeblaze.domain.Transaction;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    ReviewRepository reviewRepository;
    TransactionRepository transactionRepository;

    @Autowired
    ReviewService(ReviewRepository reviewRepository, TransactionRepository transactionRepository) {
        this.reviewRepository = reviewRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findReviewsByUserId(userId);
    }

    public Review createReview(Review review) {
        Long transactionId = review.getTransaction().getTransactionId();
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
        review.setTransaction(transaction);
        return reviewRepository.save(review);
    }


    public Review getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public boolean deleteReview(Long id) {
        int feedback = reviewRepository.deleteById(id);
        return feedback > 0;
    }


    public Double getAverageRating(Long userId) {
        return reviewRepository.getAverageRating(userId);
    }

    public Boolean getReviewsByTransaction(Long transactionId) {
        return reviewRepository.existsByTransactionId(transactionId);
    }
}
