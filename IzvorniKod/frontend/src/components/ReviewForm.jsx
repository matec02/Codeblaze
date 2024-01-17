import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from 'react';
import StarRating from "./StarRating";
import { getTransactionById } from "../utils/TransactionUtils";
import './ReviewForm.css';

const ReviewForm = () => {
    const { transactionId } = useParams();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        let transaction;
        try {
            transaction = await getTransactionById(transactionId);
        } catch (error) {
            console.error('Error fetching transaction:', error);
            return;
        }

        const dateTimeString = (new Date()).toISOString();
        const reviewData = {
            transaction: { transactionId: transactionId },
            stars: rating,
            comment: review,
            reviewTime: dateTimeString,
            reviewerUsername: transaction.owner,
            renterUsername: transaction.client
        };


        try {
            const formData = new FormData();
            formData.append('review', new Blob([JSON.stringify(reviewData)], {type: "application/json"}));
            const response = await fetch('/api/reviews/save', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const createdReview = await response.json();
                console.log('Review created successfully:', createdReview);
            } else {
                console.error('Failed to create review');
                // Handle error (e.g., show error message to the user)
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            // Handle error (e.g., show error message to the user)
        }
        window.close();
    };

    return (
        <div className="review-form">
            <h2>Submit Your Review</h2>
            <form onSubmit={handleSubmit}>
                <div className="star-rating">
                    <StarRating onChange={setRating} />
                </div>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your comment here"
                />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
