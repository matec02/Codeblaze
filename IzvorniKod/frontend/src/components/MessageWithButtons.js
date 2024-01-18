import React, {useEffect, useState} from 'react';
import "./MessageWithButtons.css";
import {fetchListingById, sendMessageResponse} from "../utils/MessageUtils";


function MessageWithButtons({messageId, chatSessionId, senderUsername, listingId, text, sender, isSeen}) {
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            const data = await fetchListingById(listingId);
            setListing(data);
        };

        fetchListing();

    }, [listingId]);

    const renderSeenIndicator = () => {
        if (sender === 'mine' && isSeen == true) {
            return <span className="seen-indicator">Seen</span>;
        }
        return null;
    };

    const handleOnAccept = async () => {
        try {
            const formData = new FormData();
            formData.append('status', new Blob([JSON.stringify("RENTED")], {type: "application/json"}));
            formData.append('clientUsername', new Blob([JSON.stringify(senderUsername)], {type: "application/json"}));

            const response = await fetch(`/api/listing/update-listing/${listingId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update listing');
            }

            await deleteAfterResponse();

            if (listing) {
                const date = new Date(listing.returnByTime)
                const formattedDate = date.getFullYear() + '-' +
                    String(date.getMonth() + 1).padStart(2, '0') + '-' + // Months are 0-based
                    String(date.getDate()).padStart(2, '0') + ' ' +
                    String(date.getHours()).padStart(2, '0') + ':' +
                    String(date.getMinutes()).padStart(2, '0') + ':' +
                    String(date.getSeconds()).padStart(2, '0');
                let listingDetails = `Trenutna adresa: ${listing.currentAddress}\n Povratak na adresu: ${listing.returnAddress}\n VRATI DO: ${formattedDate}\n`;
                if (listing.notes) {
                    listingDetails += "Dodatne napomene: ${listing.notes}"
                }
                await sendMessageResponse(`Dogovoreno! Poštuj sljedeće uvjete oglasa i želim ti sretnu i sigurnu vožnju\n\n ${listingDetails}`, chatSessionId);
            } else {
                await sendMessageResponse("Dogovoreno! Molim te da paziš na romobil i punkcionalnost te želim ti sretnu i sigurnu vožnju.", chatSessionId);
            }
            window.location.reload();
        } catch (error) {
            console.error('Error updating listing:', error);
        }
    };

    const handleOnDecline = async () => {
        try {
            const formData = new FormData();
            formData.append('status', new Blob([JSON.stringify("AVAILABLE")], {type: "application/json"}));
            formData.append('clientUsername', new Blob([JSON.stringify(null)], {type: "application/json"}));

            const response = await fetch(`/api/listing/update-listing/${listingId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update listing status');
            }
            await deleteAfterResponse();

            await sendMessageResponse("Nažalost, moram odbiti Vaš zahtjev za najmom romobila.", chatSessionId);
            window.location.reload();
        } catch (error) {
            console.error('Error updating listing status:', error);
        }
    };

    const deleteAfterResponse = async () => {
        try {
            const response = await fetch(`/api/messages/delete-message/${messageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete message with ID: ${messageId}`);
            }
        } catch (error) {
            console.error(`Error deleting message with ID: ${messageId}:`, error);
        }
    };


    return (
        <div className={`message ${sender}`}>
            <div className="message-with-buttons">
                <p className="message-text">
                    {text.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br/>
                        </span>
                    ))}
                </p>
                {(sender === "theirs") &&
                    <div className="message-buttons">
                        <button onClick={handleOnAccept} className="accept-button">Prihvati</button>
                        <button onClick={handleOnDecline} className="decline-button">Odbij</button>
                    </div>
                }
                {renderSeenIndicator()}
            </div>
        </div>
    );
}


export default MessageWithButtons;
