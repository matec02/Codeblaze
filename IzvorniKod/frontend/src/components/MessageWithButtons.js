import React from 'react';
import "./MessageWithButtons.css";

function MessageWithButtons({ text, sender, isSeen }) {

    const renderSeenIndicator = () => {
        if (sender === 'mine' && isSeen == true) {
            return <span className="seen-indicator">Seen</span>;
        }
        return null;
    };

    function handleOnAccpet() {
        console.log("ACCEPTT");
    }

    function handleOnDecline() {
        console.log("REJECT");
    }

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
                        <button onClick={handleOnAccpet}>Prihvati</button>
                        <button onClick={handleOnDecline}>Odbij</button>
                    </div>
                }
                {renderSeenIndicator()}
            </div>
        </div>
    );
}


export default MessageWithButtons;
