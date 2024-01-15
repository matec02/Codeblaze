import React, {useEffect, useState} from 'react';
import TransactionCard from './TransactionCard';
import './Transactions.css';
import {getNicknameFromToken} from "./RegisterScooterForm";
import ScooterCard from "./ScooterCard";

export const startTransaction = async (owner, client, listingPricePerKm, returnByTime, penaltyFee) => {

    const kilometersTraveled = (Math.random() * 100).toFixed(2);
    const paymentTime = new Date().toISOString().split('.')[0];
    const returnTimeDate = new Date(returnByTime);
    var totalPrice = listingPricePerKm*kilometersTraveled;

    if (returnTimeDate > returnByTime) {
        totalPrice = totalPrice + penaltyFee;
    }

    const transactionToSend = {
        kilometersTraveled: parseFloat(kilometersTraveled),
        totalPrice: totalPrice,
        paymentTime: paymentTime,
        owner: owner,
        client: client
    };

    try {
        const formData = new FormData();
        formData.append('transaction', new Blob([JSON.stringify(transactionToSend)], {type: "application/json"}));
        const response = await fetch('/api/transactions/send', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};

function Transactions() {

    const [user, setUSer] = useState('');
    const [ownerTransactions, setOwnerTransaction] = useState([]);
    const [clientTransactions, setClientTransaction] = useState([]);
    const [activeTab, setActiveTab] = useState('ownerTransactions');
    const [listings, setListings] = useState([]);

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
            <h2>Moje transakcije</h2>
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
                <div className="transactions-tabs">
                    {ownerTransactions.map(transaction => (
                            <TransactionCard key={transaction.transactionId} transaction={transaction} type={transaction.status}/>
                    ))}
                </div>
            )}

            {activeTab === 'clientTransactions' && (
                <div className="transactions-tabs">
                    {clientTransactions.map(transaction => (
                            <TransactionCard key={transaction.transactionId} transaction={transaction} type="SEEN"/>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Transactions;