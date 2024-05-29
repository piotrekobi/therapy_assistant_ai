// src/components/ChatWidget.js

import React from 'react';
import '../css/ChatWidget.css';

const ChatWidget = ({ messages, isProcessing }) => {
    return (
        <div className="chat-widget">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender === 'assistant' ? 'left' : 'right'}`}>
                    {message.text}
                </div>
            ))}
            {isProcessing && <div class="loader"></div>}
        </div>
    );
};

export default ChatWidget;
