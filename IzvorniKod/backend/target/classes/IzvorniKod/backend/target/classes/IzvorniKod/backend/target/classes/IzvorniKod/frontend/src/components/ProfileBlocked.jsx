import React from 'react';
import './ProfileBlocked.css';

const ProfileBlocked = () => {
    return (
        <div className="blocked-user-container">
            <div className="blocked-user-content">
                <h1>Access Restricted</h1>
                <p>We're sorry, but your account has been temporarily blocked due to violation of our policies. If you believe this is a mistake, please contact our support team.</p>
            </div>
        </div>
    );
}

export default ProfileBlocked;
