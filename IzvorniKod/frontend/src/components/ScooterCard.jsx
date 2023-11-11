import React from 'react';
import './ScooterCard.css'

function ScooterCard( { scooter }) {

    const { imageUrl, model, maxSpeed, batteryCapacity } = scooter;

    return (
        <div className="scooter">
            <img src={imageUrl} alt="Scooter_image" className="scooter-image"/>
            <h3 className="scooter-name">{model}</h3>
            <div className="scooter-details">
                <p><strong>Top Speed:</strong> {maxSpeed} km/h</p>
                <p><strong>Capacity:</strong> {batteryCapacity} kWh</p>
            </div>
            <button className="scooter-button">Prijavi</button>
        </div>
    );
}

export default ScooterCard;
