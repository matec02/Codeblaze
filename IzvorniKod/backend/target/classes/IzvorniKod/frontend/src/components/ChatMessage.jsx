import React from 'react';
import './ChatMessage.css';

function ChatMessage({text, sender}) {
    // Klasa 'mine' ako je poruka od ulogiranog korisnika
    const messageClass = sender === 'user' ? 'mine' : 'theirs';

    return (
        <div className={`message ${messageClass}`}>
            {text}
        </div>
    );
}

export default ChatMessage;
