import React from 'react';
import "./MessageWithButtons.css";

function MessageWithButtons({ senderUsername, listingId, text, sender, isSeen }) {

    const renderSeenIndicator = () => {
        if (sender === 'mine' && isSeen == true) {
            return <span className="seen-indicator">Seen</span>;
        }
        return null;
    };

    const handleOnAccept = async () => {
        try {
            const formData = new FormData();
            formData.append('status', new Blob([JSON.stringify("RENTED")], { type: "application/json" }));
            formData.append('clientUsername', new Blob([JSON.stringify(senderUsername)], { type: "application/json" }));

            const response = await fetch(`/api/listing/update-listing/${listingId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update listing');
            }

        } catch (error) {
            console.error('Error updating listing:', error);
        }
    };

    const handleOnDecline = async () => {
        try {
            const data = [{status:"ACTIVE"}]

            const response = await fetch(`/update-listing-status/${listingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update listing status');
            }

        } catch (error) {
            console.error('Error updating listing status:', error);
        }
    };

    return (
        <div className={`message ${sender}`}>
            <div className="message-with-buttons">
                <p className="message-text">
                    {text.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
                { (sender === "theirs") &&
                    <div className="message-buttons">
                        <button onClick={handleOnAccept}>Prihvati</button>
                        <button onClick={handleOnDecline}>Odbij</button>
                    </div>
                }
                {renderSeenIndicator()}
            </div>
        </div>
    );
}


export default MessageWithButtons;
