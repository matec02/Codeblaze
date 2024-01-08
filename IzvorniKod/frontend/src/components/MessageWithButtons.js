import React from 'react';
import "./MessageWithButtons.css";

function MessageWithButtons({ nickname, onPrihvati, onOdbij }) {
    return (
        <div className="message-with-buttons">
            <p className="message-text">
                Hej, <strong>{nickname}</strong> je poslao/poslala zahtjev za najmom romobila.
            </p>
            <div className="message-buttons">
                <button onClick={onAccept}>Prihvati</button>
                <button onClick={onDecline}>Odbij</button>
            </div>
        </div>
    );
}


export default MessageWithButtons;
