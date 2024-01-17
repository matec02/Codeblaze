package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.projektr.codeblaze.domain.Review;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.ReviewService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    ReviewService reviewService;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping(value = "/save", consumes="multipart/form-data")
    public ResponseEntity<Review> createReview(@RequestPart("review") String reviewJSON) {
        logger.info("Received review data for saving: {}", reviewJSON);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            logger.info("Attempting to parse received JSON to Review object");
            Review review = objectMapper.readValue(reviewJSON, Review.class);
            logger.info("Parsed Review object: {}", review);

            logger.info("Attempting to save Review object: {}", review);
            Review createdReview = reviewService.createReview(review);
            logger.info("Review saved successfully: {}", createdReview);

            return ResponseEntity.ok(createdReview);
        } catch (Exception e) {
            logger.error("An error occurred during saving review", e);
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        if (reviews != null && !reviews.isEmpty()) {
            return ResponseEntity.ok(reviews);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/average-rating/{userId}")
    public ResponseEntity<Double> getAverageRatingOfUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getAverageRating(userId));
    }

    @GetMapping("/review-exists-for-transaction/{transactionId}")
    public ResponseEntity<Boolean> checkIfReviewExistsForTransaction(@PathVariable Long transactionId) {
        Boolean reviewExists = reviewService.getReviewsByTransaction(transactionId);
        return ResponseEntity.ok(reviewExists);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        boolean isDeleted = reviewService.deleteReview(id);
        return ResponseEntity.ok(isDeleted);
    }
}
