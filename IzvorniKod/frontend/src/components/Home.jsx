import React, {useState, useEffect} from 'react';
import ScooterCardHome from "./ScooterCardHome";
import './Home.css';

function Home() {
    const [listings, setListings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        handleHome();
    }, []);

    const handleHome = async () => {
        setErrorMessage('');
        try {
            const response = await fetch("/api/scooters/get-all-scooters", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setListings(data);

        } catch (error) {
            console.error("Failed to fetch scooters: ", error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="scooter-grid">
            {listings.map((listing, index) => (
                <ScooterCardHome key={index} listing={listing} />
            ))}
        </div>
    );
}

export default Home;