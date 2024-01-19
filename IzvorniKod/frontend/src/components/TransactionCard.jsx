import React, { useState, useRef, useEffect } from 'react';
import './TransactionCard.css';
import {format} from "date-fns";

function TransactionCard({transaction, type}) {
    const [isExpanded, setExpanded] = useState(false);
    const [localType, setLocalType] = useState(type);

    const handleCardClick = () => {
        setExpanded(true);
        setLocalType("SEEN");
    };

    function addOneHourToDate(dateString) {
        let date = new Date(dateString)
        date.setHours(date.getHours() + 1);
        return date;
    }

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
                <p><strong>Romobil:</strong> {transaction.listing.scooter.manufacturer
                    + " " + transaction.listing.scooter.model}</p>
                <p><strong>Klijent:</strong> {transaction.client.nickname} </p>
                <p><strong>Prijeđeni kilometri:</strong> {transaction.kilometersTraveled.toFixed(2) + " km"}  </p>
                <p><strong>Cijena po kilometru:</strong> {transaction.listing.pricePerKilometer + " €/km"}  </p>
                <p><strong>Iznos:</strong> {parseFloat(transaction.totalPrice).toFixed(2)}€</p>
                <p><strong>Datum i vrijeme plaćanja:<br/></strong> {format(addOneHourToDate(transaction.paymentTime),
                    'dd.MM.yyyy., HH:mm')}</p>
                {isExpanded && (
                    <button onClick={handleZatvoriClick}>Zatvori</button>
                )}
            </div>
        </div>
    );
}
export default TransactionCard;
