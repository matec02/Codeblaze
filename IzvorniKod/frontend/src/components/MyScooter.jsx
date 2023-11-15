import React, {useEffect, useState} from 'react';
import ScooterCard from './ScooterCard';
import RegisterScooterForm from './RegisterScooterForm';
import './MyScooter.css';

function MyScooter() {
    const [scooters, setScooters] = useState([]);
    const [activeTab, setActiveTab] = useState('viewScooters'); // 'viewScooters' or 'addScooter'

    useEffect(() => {
        handleViewScooters();
    }, []);

    const addScooter = (newScooter) => {
        setScooters([...scooters, newScooter]);
        setActiveTab('viewScooters'); // Switch back to the view tab after adding
    };

    const handleViewScooters = async (event) => {
        try {
            const response = await fetch("http://localhost:8080/api/scooters/get-all-scooters", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setScooters(data);

        } catch (error) {
            console.error("Failed to fetch scooters: ", error);
        }
    };

    return (
        <div className="my-scooter-container">
            <h2>My Scooters</h2>
            <div className="tabs">
                <button onClick={() => setActiveTab('viewScooters')}
                        className={activeTab === 'viewScooters' ? 'active' : ''}>
                    View Scooters
                </button>
                <button onClick={() => setActiveTab('addScooter')}
                        className={activeTab === 'addScooter' ? 'active' : ''}>
                    Add Scooter
                </button>
            </div>

            {activeTab === 'viewScooters' && (
                <div className="scooter-list">
                    {scooters.map((scooter, index) => (
                        <div onClick={() => handleViewScooters(scooter)}>
                            <ScooterCard key={index} scooter={scooter}/>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'addScooter' && (
                <RegisterScooterForm addScooter={addScooter}/>
            )}
        </div>
    );
}

export default MyScooter;
