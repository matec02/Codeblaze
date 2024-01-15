import React, { useState, useRef, useEffect } from 'react';
import './TransactionCard.css';

function TransactionCard({transaction, type}) {
    const formattedPaymentTime = transaction.paymentTime instanceof Date
            ? transaction.paymentTime.toLocaleString()
            : transaction.paymentTime;
    const date = formattedPaymentTime.split('T')[0];
    const day = date.split("-")[2];
    const month = date.split("-")[1];
    const year = date.split("-")[0];

    const [isExpanded, setExpanded] = useState(false);
    const [localType, setLocalType] = useState(type);

    const handleCardClick = () => {
        setExpanded(true);
        setLocalType("SEEN");
    };

    const handleZatvoriClick = async (e) => {
        e.stopPropagation();
        setExpanded(false);
        if (type === "UNSEEN") {
            setLocalType("SEEN");
            try {
                const data = {status: "SEEN"}

                const response = await fetch(`/api/transactions/update-transaction-status/${transaction.transactionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Failed to update transaction status');
                }

                setExpanded(!isExpanded);

            } catch (error) {
                console.error('Error updating listing status:', error);
            }
        }
    };

    return (
        <div className={`transaction-card ${isExpanded ? 'expanded' : ''} ${localType}`} onClick={handleCardClick}>
            <p className="box-title">Broj transakcije: {transaction.transactionId}</p>
            <div className="transaction-details">
                <p><strong>Vlasnik romobila:</strong> {transaction.owner.nickname} </p>
                <p><strong>Klijent:</strong> {transaction.client.nickname} </p>
                <p><strong>Iznos:</strong> {parseFloat(transaction.totalPrice).toFixed(2)}€</p>
                <p><strong>Datum plaćanja:</strong> {day}. {month}. {year}. </p>
                {isExpanded && (
                    <button onClick={handleZatvoriClick}>Zatvori</button>
                )}
            </div>
        </div>
    );
}
export default TransactionCard;
