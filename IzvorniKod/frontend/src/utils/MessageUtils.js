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