import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './ChatPanel.css';
import {getUserIdFromToken} from "../utils/authService";

function ChatPanel() {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userId = await getUserIdFromToken();
                if (userId != null) {
                    const response = await fetch(`/api/chat-session/user/${userId}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setChats(data);
                    console.log(data)
                }
                console.log(chats);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };
        fetchChats();
    }, []);

    const handleChatClick = (chatId) => {
        navigate(`/chat-window/${chatId}`);
    };


    return (
        <div className="chat-panel">
            {chats.length > 0 ? (
                chats.map(chat => (
                    <div key={chat.chatSessionId} className="chat-item" onClick={() => handleChatClick(chat.chatSessionId)}>
                        <div className="other-user-name">{chat.user2.nickname}</div>
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
