import React, {useEffect, useState} from 'react';
import ScooterCard from './ScooterCard';
import RegisterScooterForm from './RegisterScooterForm';
import './MyScooter.css';
import {getNicknameFromToken} from "./RegisterScooterForm";

function MyScooter() {
    const [scooters, setScooters] = useState([]);
    const [activeTab, setActiveTab] = useState('viewScooters'); // 'viewScooters' or 'addScooter'
    const [user, setUser] = useState('');

    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {
        if (user && user.userId) {
            handleViewScooters(user);
        }
    }, [user]);

    const addScooter = (newScooter) => {
        setScooters([...scooters, newScooter]);
        setActiveTab('viewScooters'); // Switch back to the view tab after adding
    };

    const handleUser = async (event) => {
        try {
            const response = await fetch(`/api/users/by-nickname/${getNicknameFromToken()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            //console.log(data);
            setUser(data);

        } catch (error) {
            console.error("Failed to get users: ", error);
        }
    };

    const handleViewScooters = async (event) => {
        try {
            const response = await fetch(`/api/scooters/owner/${user.userId}`, {
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
            <h2>Moji romobili</h2>
            <div className="tabs">
                <button onClick={() => setActiveTab('viewScooters')}
                        className={activeTab === 'viewScooters' ? 'active' : ''}>
                    Prikaži vlastite romobile
                </button>
                <button onClick={() => setActiveTab('addScooter')}
                        className={activeTab === 'addScooter' ? 'active' : ''}>
                    Dodaj romobil
                </button>
            </div>

            {activeTab === 'viewScooters' && (
                <div className="scooter-list">
                    {scooters.map(scooter => (
                        <ScooterCard key={scooter.id} scooter={scooter}/>
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
