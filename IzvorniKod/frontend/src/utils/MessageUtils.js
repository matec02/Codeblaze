import {getCodeblazeFromToken, getNicknameFromToken, getUserFromToken, getUserIdFromToken} from "./authService";


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

export const sendMessageFromCodeblaze = async (messageText, user2) => {
    const user1 = await getCodeblazeFromToken();

    const formData = new FormData();
    formData.append('user1', new Blob([JSON.stringify(user1)], { type: 'application/json' }));
    formData.append('user2', new Blob([JSON.stringify(user2)], { type: 'application/json' }));

    const response = await fetch('/api/chat-session/start', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const chatSession = await response.json();


    const messageToSend = {
        senderUsername: "Codeblaze", // This should be the current user's username
        chatSession: chatSession,          // The chat session ID from the URL params
        text: messageText,                  // The message text from the state
        sentTime: new Date().toISOString().split('.')[0], // The current timestamp
        status: 'UNREAD',                    // default status
        user: user1
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
    } catch (error) {
        console.error('Error sending message:', error);
    }
};
