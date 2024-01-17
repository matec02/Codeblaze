import React from 'react';
import './ProfileBlocked.css';
import {useNavigate} from "react-router-dom";

const ProfileRejected = () => {
    const navigate = useNavigate()

    return (
        <div className="blocked-user-container">
            <div className="blocked-user-content">
                <h1>Onemogućen pristup</h1>
                <p>Vaša registracija je odbijena radi neispravne slike osobne iskaznice ili potvrde o nekažnjavanju.
                Pokušajte se ponovno registrirati s drugačijim podatcima.</p>
                <button onClick={()=>navigate("/register")} className="explore-button">Ponovno se registrirajte</button>
            </div>
        </div>
    );
}

export default ProfileRejected;
