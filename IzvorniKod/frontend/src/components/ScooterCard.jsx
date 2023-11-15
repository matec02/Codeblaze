import React from 'react';
import './ScooterCard.css'

function ScooterCard({ scooter }) {
    const { imagePath, model, maxSpeed, batteryCapacity } = scooter;



    return (
        <div className="scooter">
            <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"/>
            <h3 className="scooter-name">{model}</h3>
            <div className="scooter-details">
                <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
            </div>
            <button className="scooter-button">Prijavi</button>
        </div>
    );
}

export default ScooterCard;
