import React from 'react';
import './ProhibitedReview.css';

const ProhibitedReview = () => {
    return (
        <div className="prohibited-review-container">
            <div className="prohibited-review-content">
                <h2>Nije moguće postaviti recenziju</h2>
                <p>Nažalost, trenutno nije moguće ostaviti recenziju za korisnika.</p>
            </div>
        </div>
    );
};

export default ProhibitedReview;
