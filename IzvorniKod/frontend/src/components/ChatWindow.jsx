import React, { useState, useEffect } from 'react';
import "./ChatWindow.css";
import { useParams } from "react-router-dom";
import {getNicknameFromToken} from "../utils/authService";
import ChatMessage from "./ChatMessage";

function ChatWindow() {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]); // State to store messages from the server
    const { chatSessionId } = useParams();
    const currentNickname = getNicknameFromToken()

    useEffect(() => {
        // Fetch messages when the component mounts or when chatSessionId changes
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages/session/${chatSessionId}`);
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                setMessages(data); // Store the messages in state
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchMessages();
    }, [chatSessionId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const senderNickname = getNicknameFromToken()
        const messageToSend = {
            senderUsername: senderNickname, // This should be the current user's username
            sessionId: chatSessionId,          // The chat session ID from the URL params
            text: newMessage,                  // The message text from the state
            sentTime: new Date().toISOString(), // The current timestamp
            status: 'UNREAD'                    // default status
        };

        try {
            const response = await fetch('/api/messages/send', { // The URL should match your backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageToSend)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const sentMessage = await response.json();
            setMessages([...messages, sentMessage]);
            setNewMessage('');

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map(message => {
                    const messageSenderClass = message.senderUsername === currentNickname ? 'mine' : 'theirs';
                    const isSeen = message.status
                    return (
                        <ChatMessage
                            key={message.messageId}
                            text={message.text}
                            sender={messageSenderClass ? 'mine' : 'theirs'}
                            isSeen={isSeen}
                        />
                    );
                    // return (
                    //     <div key={message.messageId} className={`message ${messageSenderClass}`}>
                    //         {message.text}
                    //     </div>
                    // );
                })}
            </div>
            <div className="send-message-container">
                <input
                    type="text"
                    className="send-message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Napiši poruku..."
                />
                <button
                    className="send-message-button"
                    onClick={sendMessage}
                >
                    Pošalji
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;
