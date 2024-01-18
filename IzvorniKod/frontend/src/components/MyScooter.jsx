import React, {useEffect, useState} from 'react';
import ScooterCardHome from './ScooterCardHome';
import ScooterCard from './ScooterCard';
import RegisterScooterForm from './RegisterScooterForm';
import './MyScooter.css';
import MyScooter1 from '../assets/scooters.png';
import {getNicknameFromToken} from "./RegisterScooterForm";
import Listing1 from "../assets/exampleListing1.png";
import WelcomePage from "./WelcomePage";


function MyScooter() {
    const [scooters, setScooters] = useState([]);
    const [listings, setListings] = useState([]);
    const [activeTab, setActiveTab] = useState('viewScooters'); // 'viewScooters' or 'addScooter' or 'viewListings'
    const [user, setUser] = useState('');
    const textBeforeBreakScooter = "Trenutačno nemate registriranih romobila"
    const textAfterBreakScooter = "Odaberite opciju dodavanja romobila i započnite iznajmljivati!"
    const textBeforeBreakListing = "Trenutačno nemate postavljenih oglasa"
    const textAfterBreakListing = "Stavite i Vi svoj oglas te započnite zarađivati!"

    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {
        if (user && user.userId) {
            if (activeTab === 'viewScooters') {
                handleViewScooters(user);
            } else if (activeTab === 'viewListings') {
                handleViewListings(user);
            }
        }
    }, [user, activeTab]);

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
    const handleViewListings = async () => {
        try {
            const response = await fetch(`/api/listing/get-listings/AVAILABLE`, {
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
            console.error("Failed to fetch listings: ", error);
        }
    };

    return (
        <div className="my-scooter-container">
            <h3>Moji romobili</h3>
            <div className="tabs">
                <button onClick={() => setActiveTab('viewScooters')}
                        className={activeTab === 'viewScooters' ? 'active' : ''}>
                    Prikaži vlastite romobile
                </button>
                <button onClick={() => setActiveTab('addScooter')}
                        className={activeTab === 'addScooter' ? 'active' : ''}>
                    Dodaj romobil
                </button>
                <button onClick={() => setActiveTab('viewListings')}
                        className={activeTab === 'viewListings' ? 'active' : ''}>
                    Moji oglasi
                </button>
            </div>

            {activeTab === 'viewScooters' && (
                <>
                    <div className="scooter-list">
                        {scooters.filter(scooter => !scooter.deleted).map(scooter => (
                            <ScooterCardHome key={scooter.id} scooter={scooter} />
                        ))}
                    </div>
                    {scooters.filter(scooter => !scooter.deleted).length === 0 && (
                        <WelcomePage

                            textBeforeBreak={textBeforeBreakScooter}
                            textAfterBreak={textAfterBreakScooter}
                        />
                    )}
                </>
            )}


            {activeTab === 'addScooter' && (
                <RegisterScooterForm addScooter={addScooter}/>
            )}

            {activeTab === 'viewListings' && (
                listings.filter(listing => listing.scooter.user.userId === user.userId).length > 0 ? (
                    <div className="scooter-list">
                        {listings.filter(listing => listing.scooter.user.userId === user.userId)
                            .map(listing => (
                                <ScooterCard key={listing.id} listing={listing} />
                            ))
                        }
                    </div>
                ) : (
                    <WelcomePage

                        textBeforeBreak={textBeforeBreakListing}
                        textAfterBreak={textAfterBreakListing}
                    />
                )
            )}
        </div>
    );
}

export default MyScooter;
