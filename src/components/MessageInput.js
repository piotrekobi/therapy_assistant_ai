// src/components/MessageInput.js
import React from 'react';

const MessageInput = ({ currentMessage, onMessageChange, onMessageSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onMessageSubmit(currentMessage);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Wiadomość dla asystenta..."
            />
            <button type="submit">Wyślij</button>
        </form>
    );
};

export default MessageInput;
