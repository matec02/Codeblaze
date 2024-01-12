import React, {useEffect, useState} from 'react';
import TransactionCard from './TransactionCard';
import './Transactions.css';
import {getNicknameFromToken} from "./RegisterScooterForm";

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


    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {
        if (user && user.userId) {
            if (activeTab === 'ownerTransactions') {
                handleViewOwnerTransactions()
            } else if (activeTab === 'clientTransactions') {
                handleViewClientTransactions(user);
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
                setOwnerTransaction(transactions);
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

    const orderedOwnerTransactions = ownerTransactions.sort((a, b) => {
       const statusOrder = {SEEN: 2, UNSEEN: 1};
       return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="my-transactions">
            <h2>Moje transakcije</h2>
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
                    {orderedOwnerTransactions.map(transaction => (
                        <div className={transaction.status}>
                            <TransactionCard key={transaction.transactionId} transaction={transaction}/>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'clientTransactions' && (
                <div className="transactions-tabs">
                    {clientTransactions.map(transaction => (
                        <TransactionCard key={transaction.transactionId} transaction={transaction}/>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Transactions;