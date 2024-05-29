// src/components/MessageInput.js
import React from 'react';
import '../css/MessageInput.css';

const MessageInput = ({ currentMessage, onMessageChange, onMessageSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onMessageSubmit(currentMessage);
    };

    return (
        <div className="message-input-container">
          <form onSubmit={handleSubmit} className="message-input-form">
              <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => onMessageChange(e.target.value)}
                  placeholder="Wiadomość dla asystenta..."
                  className="message-input"
              />
              <button type="submit" className="send-button">Wyślij</button>
          </form>
        </div>
    );
};

export default MessageInput;
