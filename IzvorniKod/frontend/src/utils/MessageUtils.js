import {getUserFromToken, getUserIdFromToken} from "./authService";


export const chatHistory = function fetchChatHistory(userId) {
    fetch(`/api/messages/history/${userId}`)
        .then(response => response.json())
        .then(messages => {
            console.log('Chat history:', messages);
            // Update your state or context with these messages to display in the UI
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export const messageSent = function sendMessage(text, sender, receiver) {
    const messageData = {
        senderUsername: sender,
        receiverUsername: receiver,
        text: text,
        // Include other necessary fields
    };

    fetch('/api/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent:', data);
            // Optionally update the chat UI here
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export const startConversation = async function initializeChatSession(user2) {
    const user1 = await getUserFromToken();
    const formData = new FormData();
    formData.append('user1', new Blob([JSON.stringify(user1)], {type: "application/json"}));
    formData.append('user2', new Blob([JSON.stringify(user2)], {type: "application/json"}));
    console.log("USER1: ", user1);
    console.log("USER2: ", user2);
    try {
        const response = await fetch("/api/chat-session/start", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during starting a conversation:', error);
    }
}

export const getChatSessionById = async (chatSessionId) => {
    try {
        const response = await fetch(`/api/chat-session/${chatSessionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch chat session:', error);
        return null; // Or handle the error as appropriate for your application
    }
};
