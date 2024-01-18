import React, {useState, useEffect} from 'react';
import "./ChatWindow.css";
import {useParams} from "react-router-dom";
import {getNicknameFromToken, getUserFromToken} from "../utils/authService";
import ChatMessage from "./ChatMessage";
import {getChatSessionById} from "../utils/MessageUtils";
import MessageWithButtons from "./MessageWithButtons";
import {ProfileModal} from "./ScooterCard";
import MessageRequestWithButton from "./MessageRequestWithButton";

function ChatWindow() {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const {chatSessionId} = useParams();
    const currentNickname = getNicknameFromToken()
    const [otherUser, setOtherUser] = useState(null);
    const [userProfile, setUserProfile] = useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleViewProfile = async (event) => {
        event.stopPropagation();
        try {
            const response = await fetch(`/api/users/by-nickname/${otherUser}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const profileData = await response.json();
            setUserProfile(profileData);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

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

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages/session/${chatSessionId}`);
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                setMessages(data); // Spremanje poruka u state
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchChatSession = async () => {
            try {
                const response = await fetch(`/api/chat-session/${chatSessionId}`);
                if (!response.ok) throw new Error('Failed to fetch chat session');
                const chatSessionData = await response.json();

                const currentNickname = getNicknameFromToken();
                // Pretpostavljamo da chatSessionData sadrži objekte user1 i user2 s nadimcima
                const otherUserNickname = chatSessionData.user1.nickname === currentNickname
                    ? chatSessionData.user2.nickname
                    : chatSessionData.user1.nickname;

                setOtherUser(otherUserNickname);
            } catch (error) {
                console.error('Error fetching chat session:', error);
            }
        };

        const markMessagesAsRead = async () => {
            try {
                const responseSeen = await fetch(`/api/messages/session/${chatSessionId}/mark-read`, {
                    method: "POST",
                    body: currentNickname
                });
                if (!responseSeen.ok) {
                    throw new Error("Failed to mark messages as read");
                }
            } catch (error) {
                console.error("Error marking messages as read", error);
            }
        };

        fetchMessages();
        fetchChatSession();
        markMessagesAsRead();
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

    return (
        <div className="chat-container">
            {otherUser && (
                <div className="other-user-header">
                    <div onClick={(e) => handleViewProfile(e)}
                         style={{cursor: 'pointer'}}>{otherUser}</div>
                </div>
            )}
            <div className="messages-container">
                {messages.map(message => {
                    const messageSenderClass = message.senderUsername === currentNickname ? 'mine' : 'theirs';
                    const isLastSentMessage = message.messageId === lastSentMessageId(messages);

                    //console.log(message.text)

                    if (message.messageType === "ACTION") {
                        return (
                            <MessageWithButtons
                                key={message.messageId}
                                messageId={message.messageId}
                                chatSessionId={chatSessionId}
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
                    } else if (message.messageType === "REQUEST"){
                        return (
                        <MessageRequestWithButton
                            key={message.messageId}
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
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={userProfile}
            />
        </div>

    );

}

export default ChatWindow;
