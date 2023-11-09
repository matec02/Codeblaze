import React from 'react';
import './ScooterCard.css'

function ScooterCard() {

    return (
        <div className="scooter">
            <img src="#" alt="Scooter_image" className="scooter-image"/>
            <h3 className="scooter-name">Scooter_name</h3>
            <div className="scooter-details">
                <p><strong>Top Speed:</strong> 10 km/h</p>
                <p><strong>Capacity:</strong> 20 kWh</p>
            </div>
            <button className="scooter-button">Prijavi</button>
        </div>
    );
}

export default ScooterCard;
