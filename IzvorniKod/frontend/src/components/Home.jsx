import React, {useState, useEffect} from 'react';
import ScooterCardHome from "./ScooterCardHome";
import './Home.css';

function Home() {
    const [scooters, setScooters] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        handleHome();
    }, []);

    const handleHome = async (event) => {

        setErrorMessage(''); // Assuming setErrorMessage is defined elsewhere in your component

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

            setScooters(data);

        } catch (error) {
            console.error("Failed to fetch scooters: ", error);
            setErrorMessage(error.message);
        }
    }


    return (
        <div className="scooter-grid">
            {scooters.map((scooter, index) => (
                <ScooterCardHome key={index} scooter={scooter}/>
            ))}
        </div>
    );
}
export default Home;