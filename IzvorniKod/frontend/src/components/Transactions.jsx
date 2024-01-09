import React, {useEffect, useState} from 'react';
//import TransactionCard from '.TransactionCard';
import './Transactions.css';
import {getNicknameFromToken} from "./RegisterScooterForm";

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [user, setUSer] = useState('');

    //kod renderanja prvo nadi usera
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