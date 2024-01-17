import React from 'react';
import './ChatMessage.css';

function ChatMessage({text, sender, isSeen}) {
    const renderSeenIndicator = () => {
        if (sender === 'mine' && isSeen == true) {
            return <span className="seen-indicator">Seen</span>;
        }
        return null;
    };

    const containsLink = (text) => {
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/i;
        return linkRegex.test(text);
    };

    return (
        <div className={`message ${sender}`}>
            {text.split('\n').map((line, index) => (
                <span key={index}>
                    {containsLink(line) ? (
                        <div dangerouslySetInnerHTML={{ __html: line }} />
                    ) : (
                        <span>{line}</span>
                    )}
                    <br />
                </span>
            ))}
            {renderSeenIndicator()}
        </div>
    );
}

export default ChatMessage;
