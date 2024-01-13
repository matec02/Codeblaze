import React from "react";
import {useNavigate} from "react-router-dom";

function MessageRequestWithButton({text, sender, isSeen }) {
    const navigate = useNavigate();
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
                        <button onClick={() => navigate("/scooters")}>Pregledaj oglas</button>
                    </div>
                }
                {renderSeenIndicator()}
            </div>
        </div>
    );
}


export default MessageRequestWithButton;