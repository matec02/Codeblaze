import React from 'react';
import ScooterCard from "./ScooterCard";
import './Home.css';

function Home() {
    // Manually added 8 instances for now
    const scooters = new Array(8).fill(null);

    return (
        <div className="scooter-grid">
            {scooters.map((_, index) => (
                <ScooterCard key={index}/>
            ))}
        </div>
    );
}

export default Home;