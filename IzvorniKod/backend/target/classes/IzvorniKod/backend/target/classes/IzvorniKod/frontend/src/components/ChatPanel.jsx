import React from 'react';
import {useNavigate} from 'react-router-dom';
import './ChatPanel.css';

function ChatPanel() {
    const navigate = useNavigate();
    const chats = [
        {id: 1, otherUserName: "Korisnik A", lastMessage: "Zadnja poruka u chatu A"},
        {id: 2, otherUserName: "Korisnik B", lastMessage: "Zadnja poruka u chatu B"},
        // Dodajte ostale chatove ovdje
    ];
    const handleChatClick = () => {
        navigate('/chat-window'); // Preusmjeravanje na chat window
    };


    return (
        <div className="chat-panel">
            {chats.map(chat => (
                <div key={chat.id} className="chat-item" onClick={handleChatClick}>
                    <div className="other-user-name">{chat.otherUserName}</div>
                    <div className="last-message">{chat.lastMessage}</div>
                </div>
            ))}
        </div>
    );
}

export default ChatPanel;
