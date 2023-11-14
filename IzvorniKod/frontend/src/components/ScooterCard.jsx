import React from 'react';
import './ScooterCard.css'
import {useLocation} from 'react-router-dom';

function ScooterCard({scooter}) {
    const location = useLocation();
    const {imageUrl, model, maxSpeed, batteryCapacity} = scooter;

    const buttonText = location.pathname === '/home' ? 'Iznajmi' : 'Prijavi';
    return (
        <div className="scooter">
            <img src={imageUrl} alt="Scooter_image" className="scooter-image"/>
            <div className="scooter-name">{model}</div>
            <div className="scooter-details">
                <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
            </div>
            <button className="scooter-button">{buttonText}</button>
        </div>
    );
}

export default ScooterCard;
