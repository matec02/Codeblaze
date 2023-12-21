import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './ChatPanel.css';
import {getUserIdFromToken} from "../utils/authService";

function ChatPanel() {
    const navigate = useNavigate();
    const userId = getUserIdFromToken();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Make sure the userId is not null
        if (userId) {
            fetch(`/api/chat-session/user/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setChats(data);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        }
    }, [userId]);

    const handleChatClick = (chatId) => {
        navigate(`/chat-window/${chatId}`);
    };


    return (
        <div className="chat-panel">
            {chats.length > 0 ? (
                chats.map(chat => (
                    <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat.id)}>
                        <div className="other-user-name">{chat.otherUserName}</div>
                        <div className="last-message">{chat.lastMessage}</div>
                    </div>
                ))
            ) : (
                <div>No chat sessions available.</div>
            )}
        </div>
    );
}

export default ChatPanel;
