import {getCodeblazeUser, getNicknameFromToken, getUserFromToken, getUserIdFromToken} from "./authService";


export const chatHistory = function fetchChatHistory(userId) {
    fetch(`/api/messages/history/${userId}`)
        .then(response => response.json())
        .then(messages => {
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
        return null;
    }
};

export const sendMessageFromCodeblaze = async (messageText, user2) => {
    const user1 = await getCodeblazeUser();

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
        senderUsername: "Codeblaze",
        chatSession: chatSession,
        text: messageText,
        sentTime: new Date().toISOString().split('.')[0],
        status: 'UNREAD',
        user: user1
    };

    try {
        const formData = new FormData();
        formData.append('msgToBeSent', new Blob([JSON.stringify(messageToSend)], {type: "application/json"}));
        const response = await fetch('/api/messages/send', {
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


export const sendMessageWithAction = async (owner, listingId, manufacturer, model, yearOfManufacture) => {
    const senderNickname = await getNicknameFromToken();
    const senderUser = await getUserFromToken();
    const chatSession = await startConversation(owner);

    const messageText = `Hej ${owner.nickname},\n ${senderNickname} želi iznajmiti tvoj ${manufacturer} ${model} proizveden ${yearOfManufacture}! Pristaješ li na najam?`;

    const messageToSend = {
        senderUsername: senderNickname,
        chatSession: chatSession,
        text: messageText,
        sentTime: new Date().toISOString().split('.')[0],
        status: 'UNREAD',
        messageType: 'ACTION',
        user: senderUser,
        listingId: listingId
    };

    try {
        const formData = new FormData();
        formData.append('msgToBeSent', new Blob([JSON.stringify(messageToSend)], {type: "application/json"}));
        const response = await fetch('/api/messages/send', {
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

export const sendMessageResponse = async (text, chatSessionId) => {
    const senderUser = await getUserFromToken();
    const chatSession = await getChatSessionById(chatSessionId);
    const messageToSend = {
        senderUsername: senderUser.nickname,
        chatSession: chatSession,
        text: text,
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
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export const fetchListingById = async (listingId) => {
    try {
        const response = await fetch(`/api/listing/get-listing-by-id/${listingId}`);

        if (!response.ok) {

            console.error('Failed to fetch listing with ID:', listingId);
            return null;
        }

        return await response.json();
    } catch (error) {

        console.error('Network error when fetching listing:', error);
        return null;
    }
};

export const getChatSessionBetweenUsers = async (user1Id, user2Id) => {
    try {
        const response = await fetch(`/api/chat-session/${user1Id}/${user2Id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch chat session');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching chat session:', error);
        return null;
    }
};

export const handleEndOfTransactionMessage = async (user1Id, user2Id, transactionId) => {
    const chatSession = await getChatSessionBetweenUsers(user1Id, user2Id);
    if (chatSession) {
        const reviewPageUrl = `/leave-review/${transactionId}`; // Replace with your actual domain and route
        const messageWithLink = `Vožnja je gotova i Vaš romobil je vraćen! Hvala na izboru mog romobila.\nMolimo Vas da ostavite <a href="${reviewPageUrl}" target="_blank">osvrt</a> na mene kao klijenta.`;
        await sendMessageResponse(messageWithLink, chatSession.chatSessionId);
    }
};


export const sendMessageFromCodeblazeWithAction = async (owner, listing, comments) => {
    const user1 = await getCodeblazeUser();

    const formData = new FormData();
    formData.append('user1', new Blob([JSON.stringify(user1)], { type: 'application/json' }));
    formData.append('user2', new Blob([JSON.stringify(listing.scooter.user)], { type: 'application/json' }));

    const response = await fetch('/api/chat-session/start', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const chatSession = await response.json();

    let messageText = `Slika vašega romobila ${listing.scooter.model} je zamjenjena. 
                    Klijent koji je zamjenio sliku je ${getNicknameFromToken()}.`
    messageText += ` Njegov razlog za zamjenu je ${comments}.`;

    const messageToSend = {
        senderUsername: "Codeblaze",
        chatSession: chatSession,
        text: messageText,
        sentTime: new Date().toISOString().split('.')[0],
        status: 'UNREAD',
        messageType: 'REQUEST',
        user: user1,
        listingId: listing.listingId
    };

    try {
        const formData = new FormData();
        formData.append('msgToBeSent', new Blob([JSON.stringify(messageToSend)], {type: "application/json"}));
        const response = await fetch('/api/messages/send', {
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