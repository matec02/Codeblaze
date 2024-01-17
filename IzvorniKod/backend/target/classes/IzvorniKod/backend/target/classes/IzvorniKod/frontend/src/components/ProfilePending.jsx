import React from 'react';
import './ProfilePending.css';
import {useNavigate} from 'react-router-dom';

const ProfilePending = () => {
    const navigate = useNavigate()
    const handleExploreClick = () => {
        navigate('/');
    }
    return (
        <div className="profile-pending-container">
            <div className="profile-pending-content">
                <h1>Profile Pending</h1>
                <p>Your profile is currently pending review. We appreciate your patience,  in couple of hours review will be completed. In the meantime, feel free to browse our offers.</p>
                <button onClick={handleExploreClick} className="explore-button">Explore Our Offers</button>
            </div>
        </div>
    );
}

export default ProfilePending;
