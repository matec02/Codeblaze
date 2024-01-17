import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ onChange }) => {
    const [rating, setRating] = useState(0);

    const handleClick = (value) => {
        setRating(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((index) => (
                <span key={index} onClick={() => handleClick(index)}>
                    {index <= rating ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
};

export default StarRating;