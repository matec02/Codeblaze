import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ReviewCard.css';

const ReviewCard = () => {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useParams();

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const user = await response.json();
                setNickname(user.nickname);

                const reviewsResponse = await fetch(`/api/reviews/user/${userId}`);
                if (!reviewsResponse.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData);

                const avgRatingResponse = await fetch(`/api/reviews/average-rating/${userId}`);
                if (!avgRatingResponse.ok) {
                    throw new Error('Failed to fetch average rating');
                }
                const avgRatingData = await avgRatingResponse.json();
                setAvgRating(avgRatingData);
            } catch (error) {
                console.error("There was a problem with fetching data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [userId]);

    if (isLoading) {
        return <div className="loading">Učitavanje...</div>;
    }

    return (
        <div className="review-container">
            <div className="user-header">
                <h2 className="user-nickname">{nickname}</h2>
                {avgRating !== null && (
                    <span className="average-rating">Prosječna ocjena: {avgRating.toFixed(1)}</span>
                )}
            </div>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <div className="review-rating">Ocjena: {review.stars}</div>
                        <div className="review-comment">Komentar: {review.comment}</div>
                    </div>
                ))
            ) : (
                <div className="no-reviews">Nema recenzija</div>
            )}
        </div>
    );
};

export default ReviewCard;
