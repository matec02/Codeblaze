import React from 'react';
import './ProfileBlocked.css';
import {useNavigate} from "react-router-dom";

const ProfileBlocked = () => {
    const navigate = useNavigate()
    return (
        <div className="blocked-user-container">
            <div className="blocked-user-content">
                <h1>Pristup ograničen</h1>
                <p>Žao nam je, Vaš račun je privremeno blokiran zbog kršenja naših pravila. Ako smatrate da je došlo do pogreške, molimo Vas da kontaktirate naš tim za podršku.</p>
                <button onClick={()=> navigate("/")} className="explore-button">Istraži ponude</button>
            </div>
        </div>
    );
}

export default ProfileBlocked;