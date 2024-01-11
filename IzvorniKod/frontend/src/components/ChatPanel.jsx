import React, {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import './ChatPanel.css';
import {getNicknameFromToken, getUserIdFromToken} from "../utils/authService";
import UnreadMessagesContext from "./UnreadMessagesContext";

function  ChatPanel() {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const { setUnreadCount } = useContext(UnreadMessagesContext);
    const receiverNickname = getNicknameFromToken();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userId = await getUserIdFromToken();
                if (userId != null) {
                    const response = await fetch(`/api/chat-session/user/${userId}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    let chatsData = await response.json();

                    const chatMessagesPromises = chatsData.map(chat =>
                        fetch(`/api/messages/session/${chat.chatSessionId}`)
                            .then(response => response.json())
                    );

                    const chatMessagesArray = await Promise.all(chatMessagesPromises);

                    const totalUnreadMessages = chatsData.reduce((total, chat) => {
                        return total + chat.unreadCount
                    }, 0)

                    setUnreadCount(totalUnreadMessages);

                    chatsData = chatsData.map((chat, index) => {
                        const chatMessages = chatMessagesArray[index];
                        let lastMessage = chatMessages.sort((a, b) => new Date(b.sentTime) - new Date(a.sentTime));
                        lastMessage = lastMessage[0];
                        const unreadMessagesCount = chatMessages.reduce((count, message) => {
                            return count + (message.status === "UNREAD" && message.senderUsername !== receiverNickname ? 1 : 0);
                        }, 0);
                        return { ...chat, unreadCount: unreadMessagesCount, lastMessage: lastMessage.text };
                    });
                    chatsData.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                    setChats(chatsData);
                }
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
                        <div className="other-user-name">{chat.user1.nickname === receiverNickname ? chat.user2.nickname : chat.user1.nickname}</div>
                        <div className="item-inside">
                            <div className="last-message">{chat.lastMessage}</div>
                            {chat.unreadCount > 0 && <div className="unread-count">{chat.unreadCount}</div>}
                        </div>
                    </div>
                ))
            ) : (
                <div>No chat sessions available.</div>
            )}
        </div>
    );
}

export default ChatPanel;
