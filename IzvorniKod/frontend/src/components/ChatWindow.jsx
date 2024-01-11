import React, { useState, useEffect } from 'react';
import "./ChatWindow.css";
import { useParams } from "react-router-dom";
import {getNicknameFromToken, getUserFromToken} from "../utils/authService";
import ChatMessage from "./ChatMessage";
import {getChatSessionById} from "../utils/MessageUtils";
import MessageWithButtons from "./MessageWithButtons";

function ChatWindow() {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]); // State to store messages from the server
    const { chatSessionId } = useParams();
    const currentNickname = getNicknameFromToken()

    const lastSentMessageId = (messages) => {
        if (!Array.isArray(messages) || messages.length === 0) {
            return null;
        }
        const sortedMessages = [...messages]
            .filter(message => message.senderUsername === currentNickname)
            .sort((a, b) => b.messageId - a.messageId);

        if (sortedMessages.length === 0) {
            return null;
        }

        return sortedMessages[0].messageId;
    };
    // console.log(lastSentMessageId);

    useEffect(() => {
        console.log(messages);
        const markMessagesAsRead = async () => {
            try {
                const responseSeen = fetch(`/api/messages/session/${chatSessionId}/mark-read`, {
                    method: "POST",
                    body: currentNickname
                });
                if (!responseSeen.ok) {
                    throw new Error("Failed to mark messages as read");
                }
                console.log("Messages marked as read")
            } catch (error) {
                console.error("Error marking messages as read", error);
            }
        }

        markMessagesAsRead();
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
        const senderNickname = await getNicknameFromToken();
        const senderUser = await getUserFromToken();
        const chatSession = await getChatSessionById(chatSessionId);
        const messageToSend = {
            senderUsername: senderNickname,
            chatSession: chatSession,
            text: newMessage,
            sentTime: new Date().toISOString().split('.')[0],
            status: 'UNREAD',
            user: senderUser
        };

        try {
            const formData = new FormData();
            formData.append('msgToBeSent', new Blob([JSON.stringify(messageToSend)], {type: "application/json"}));
            const response = await fetch('/api/messages/send', { // The URL should match your backend endpoint
                method: 'POST',
                body: formData
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

    function printLOL() {
        console.log("ACTION")
    }

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map(message => {
                    const messageSenderClass = message.senderUsername === currentNickname ? 'mine' : 'theirs';
                    const isLastSentMessage = message.messageId === lastSentMessageId(messages);
                    //console.log(message.listingId) tu je undefined
                    //console.log(message.text) ovaj je dobar

                    if (message.messageType === "ACTION") {
                        return (
                            <MessageWithButtons
                                key={message.messageId}
                                senderUsername={message.senderUsername}
                                listingId={message.listingId}
                                text={message.text}
                                sender={messageSenderClass}
                                isSeen={
                                    messageSenderClass === 'mine' &&
                                    isLastSentMessage &&
                                    message.status === 'READ'
                                }
                            />
                        );
                    } else {
                        return (
                            <ChatMessage
                                key={message.messageId}
                                text={message.text}
                                sender={messageSenderClass}
                                isSeen={
                                    messageSenderClass === 'mine' &&
                                    isLastSentMessage &&
                                    message.status === 'READ'
                                }
                            />
                        );
                    }
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
