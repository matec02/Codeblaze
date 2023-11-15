import React from 'react';
import './ScooterCard.css'
function ScooterCard({ scooter }) {
    const { imagePath, model, maxSpeed, batteryCapacity } = scooter;

    const baseURL = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '') || 'http://localhost:8080';
    const imageURL = `${baseURL}/images/${imagePath}`;
    console.log(imageURL)

    return (
        <div className="scooter">
            <img src={imageURL} alt={`${model} Scooter`} className="scooter-image"/>
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
