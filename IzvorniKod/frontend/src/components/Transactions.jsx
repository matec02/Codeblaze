import React, {useEffect, useState} from 'react';
//import TransactionCard from '.TransactionCard';
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

    const [transactions, setTransactions] = useState([]);
    const [user, setUSer] = useState('');

    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {
        if (user && user.userId) {
            handleViewTransactions(user);
        }
    }, [user]);

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

    const handleViewTransactions = async (event) => {
        try {
            //dohvacanje transakcija iznajmljivaca
            const response = await fetch(`/api/transactions/${user.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const transactions = await response.json();
                setTransactions(transactions);
            }
            else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const orderedTransactions = transactions.sort((a, b) => {
       const statusOrder = {UNSEEN: 1, SEEN: 2};
       return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="my-transactions">
            <h2>Moje transakcije</h2>
            <div className="transactions-tabs">
                {orderedTransactions.map(item => (
                    <div key={item.id} className={item.status}>
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Transactions;