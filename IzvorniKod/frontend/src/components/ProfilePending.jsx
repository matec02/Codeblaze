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
                <h1>Vaš profil je na čekanju</h1>
                <p>Vaš profil trenutno prolazi postupak provjere. Provjera će biti završena u roku od nekoliko sati. U međuvremenu, slobodno istražite naše ponude. Zahvaljujemo na strpljenju. </p>
                <button onClick={handleExploreClick} className="explore-button">Istraži ponude</button>
            </div>
        </div>
    );
}

export default ProfilePending;
