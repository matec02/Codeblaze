import React, {useState} from 'react';
import "./ChatWindow.css"

function ChatWindow() {
    const [newMessage, setNewMessage] = useState('');

    // Implementirati logiku za slanje poruke
    const sendMessage = () => {
        if (!newMessage.trim()) return;
        console.log('Poruka poslana:', newMessage);
        // Resetiranje input polja
        setNewMessage('');
    };

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    // Primjer poruka
    const messages = [
        {id: 1, text: "Pozdrav! Želim iznajmiti romobil.", sender: "mine"},
        {id: 2, text: "Pozdrav!", sender: "theirs"},
        {id: 3, text: "...", sender: "theirs"},
        {id: 4, text: "...", sender: "mine"},
        {id: 5, text: "....", sender: "theirs"},
        {id: 6, text: "..", sender: "mine"},
        {id: 7, text: "....", sender: "theirs"},
        {id: 8, text: "...", sender: "mine"},


        {id: 9, text: "Može, cijena je...", sender: "theirs"},
        {id: 10, text: "Odlično, pokupiti ću ga u 2", sender: "mine"},
    ];

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map(message => (
                    <div key={message.id} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
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
