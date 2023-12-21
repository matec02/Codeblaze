import React from 'react';
import './ChatMessage.css';

function ChatMessage({text, sender, isSeen}) {
    const renderSeenIndicator = () => {
        if (sender === 'mine' && isSeen) {
            return <span className="seen-indicator">Seen</span>;
        }
        return null;
    };

    return (
        <div className={`message ${sender}`}>
            {text}
            {renderSeenIndicator()}
        </div>
    );
}

export default ChatMessage;
