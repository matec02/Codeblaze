import React, {useEffect, useState} from 'react';
import TransactionCard from './TransactionCard';
import './Transactions.css';
import {getNicknameFromToken} from "./RegisterScooterForm";
import ScooterCard from "./ScooterCard";
import Invoice from '../assets/racun.jpg';

export const startTransaction = async (owner, client, listingPricePerKm, returnByTime, penaltyFee, listingId) => {
    console.log(listingId);
    const kilometersTraveled = (Math.random() * 100).toFixed(2);
    const paymentTime = new Date().toISOString().split('.')[0];
    const returnTimeDate = new Date(returnByTime);
    var totalPrice = listingPricePerKm*kilometersTraveled;

    if (returnTimeDate > returnByTime) {
        totalPrice = totalPrice + penaltyFee;
    }

    const formData = new FormData();
    formData.append('kilometersTraveled', new Blob([JSON.stringify(parseFloat(kilometersTraveled))], { type: "application/json" }));
    formData.append('totalPrice', new Blob([JSON.stringify(parseFloat(totalPrice))], { type: "application/json" }));
    formData.append('paymentTime', new Blob([JSON.stringify(paymentTime)], { type: "application/json" }));
    formData.append('owner', new Blob([JSON.stringify(owner)], { type: "application/json" }));
    formData.append('client', new Blob([JSON.stringify(client)], { type: "application/json" }));
    formData.append('listingId', new Blob([JSON.stringify(listingId)], { type: "application/json" }));

    try {
        const response = await fetch('/api/transactions/send', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const savedTransaction = await response.json();
        return savedTransaction.transactionId;
    } catch (error) {
        console.error('Error sending transaction:', error);
        return null;
    }
};

function Transactions() {

    const [user, setUSer] = useState('');
    const [ownerTransactions, setOwnerTransaction] = useState([]);
    const [clientTransactions, setClientTransaction] = useState([]);
    const [activeTab, setActiveTab] = useState('ownerTransactions');
    const [listings, setListings] = useState([]);
    const textBeforeBreakOwner = "Trenutno nemate zaprimljenih transakcija"
    const textAfterBreakOwner = "Postavite svoj romobil na oglašavanje te tako zaradite!"
    const textBeforeBreakClient = "Trenutno nemate naplaćenih transakcija"
    const textAfterBreakClient = "Unajmi oglašeni romobil te će Vam se transakcija prikazati!"


    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {
        if (user && user.userId) {
            handleViewListings();
            if (activeTab === 'ownerTransactions') {
                handleViewOwnerTransactions();
            } else if (activeTab === 'clientTransactions') {
                handleViewClientTransactions();
            }
        }
    }, [user, activeTab]);

    const handleUser = async (event) => {
        try {
            const response = await fetch(`/api/users/by-nickname/${getNicknameFromToken()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUSer(userData);

            } else {
                throw new Error(`Error: ${response.status}`);
            }

        } catch (error) {
            console.error("Failed to get users: ", error);
        }
    };

    const handleViewListings = async (event) => {
        try {
            const response = await fetch(`/api/listing/get-listings/RENTED`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const listings = await response.json();
                setListings(listings);
            }
            else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const handleViewOwnerTransactions = async (event) => {
        try {
            //dohvacanje transakcija iznajmljivaca
            const response = await fetch(`/api/transactions/owner/${user.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const transactions = await response.json();

                // Sort transactions based on status, with 'UNSEEN' first
                const sortedTransactions = transactions.sort((a, b) => {
                    if (a.status === 'UNSEEN' && b.status !== 'UNSEEN') {
                        return -1; // 'UNSEEN' comes first
                    } else if (a.status !== 'UNSEEN' && b.status === 'UNSEEN') {
                        return 1; // 'UNSEEN' comes second
                    } else {
                        // If both have the same status or neither is 'UNSEEN', maintain their current order
                        return 0;
                    }
                });

                setOwnerTransaction(sortedTransactions);
            }
            else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const handleViewClientTransactions = async (event) => {
        try {
            //dohvacanje transakcija klijenta
            const response = await fetch(`/api/transactions/client/${user.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const transactions = await response.json();
                setClientTransaction(transactions);
            }
            else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };


    return (
        <div className="my-transactions">
            <h3>Moje transakcije</h3>
            {listings.filter(listing => (listing.scooter.user.userId === user.userId)).length > 0 && (
                <div className="rented-scooters">
                    <h3>Romobili na iznajmljivanju:</h3>
                    <div className="rented-scooters-tabs">
                        {listings.map((listing, index) => (
                            <ScooterCard key={index} listing={listing} />
                        ))}
                    </div>
                </div>
            )}

            <div className="transaction-buttons">
                <button onClick={() => setActiveTab('ownerTransactions')}
                        className={activeTab === "ownerTransactions" ? 'active' : ''}>
                    Zaprimljene transakcije
                </button>
                <button onClick={() => setActiveTab('clientTransactions')}
                        className={activeTab === "clientTransactions" ? 'active' : ''}>
                    Naplaćene transakcije
                </button>
            </div>

            {activeTab === 'ownerTransactions' && (
                ownerTransactions.length > 0 ? (
                    <div className="transactions-tabs">
                        {ownerTransactions.map(transaction => (
                            <TransactionCard key={transaction.transactionId} transaction={transaction} type={transaction.status}/>
                        ))}
                    </div>
                ) : (
                    <div className="welcome-page">
                        <div className="welcome-container">
                            <h5>{textBeforeBreakOwner}<br/>{textAfterBreakOwner}</h5>
                        </div>
                        <div className="welcomeImageContainer">
                            <img src={Invoice} alt="Scooter Adventure" />
                        </div>
                    </div>
                )
            )}

            {activeTab === 'clientTransactions' && (
                clientTransactions.length > 0 ? (
                    <div className="transactions-tabs">
                        {clientTransactions.map(transaction => (
                            <TransactionCard key={transaction.transactionId} transaction={transaction} type="SEEN"/>
                        ))}
                    </div>
                ) : (
                    <div className="welcome-page">
                        <div className="welcome-container">
                            <h5>{textBeforeBreakClient}<br/>{textAfterBreakClient}</h5>
                        </div>
                        <div className="welcomeImageContainer">
                            <img src={Invoice} alt="Scooter Adventure" />
                        </div>
                    </div>
                )
            )}
        </div>
    );

}
export default Transactions;