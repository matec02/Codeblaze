import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchListingById} from "../utils/MessageUtils";

function MessageRequestWithButton({text, sender, isSeen, listingId }) {
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);

    useEffect( () => {
        const fetchListing = async() => {
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
                        <button onClick={() => {
                            const destination = listing.status === 'RENTED' ? '/my-transactions' : '/home';
                            navigate(destination);
                        }}>
                            Pregledaj oglas
                        </button>
                    </div>
                }
                {renderSeenIndicator()}
            </div>
        </div>
    );
}


export default MessageRequestWithButton;