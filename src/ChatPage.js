// src/ChatPage.js

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';
import Header from './components/Header';
import ChatWidget from './components/ChatWidget';
import RecordButton from './components/RecordButton';
import MessageInput from './components/MessageInput';

export const ChatPage = () => {
    const { user } = useContext(AppContext);
    // Initialize messages from localStorage if available
    const initialMessages = JSON.parse(localStorage.getItem('chatMessages')) || [{ sender: 'assistant', text: 'Cześć! Jak mogę Ci dzisiaj pomóc?' }];
    const [messages, setMessages] = useState(initialMessages);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Save messages to localStorage whenever they change
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const handleTextSubmit = async (text) => {
        if (!text.trim()) return;
        setIsProcessing(true);

        try {
            // Include previous messages as context for the model
            const previousMessages = messages.map(msg => ({ role: msg.sender, content: msg.text }));
            const response = await axios.post('http://127.0.0.1:5000/process_text', {
                text,
                username: user.username,
                previousMessages,  // Send previous messages as context
            });

            setMessages(messages => [...messages, { sender: 'user', text }, { sender: 'assistant', text: response.data.llm_response }]);
            setCurrentMessage('');
        } catch (error) {
            console.error('Error processing text message:', error);
            alert('Error processing text message: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to reset the conversation
    const resetConversation = () => {
        setMessages([{ sender: 'assistant', text: 'Cześć! Jak mogę Ci dzisiaj pomóc?' }]);
        // Clear current message and localStorage
        setCurrentMessage('');
        localStorage.removeItem('chatMessages');
    };

    // Adjust handleAudioUpload to only set transcription for editing
    const handleAudioUpload = async (audioBlob) => {
        if (!audioBlob) return;
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('username', user.username); // Append username here

        try {
            const response = await axios.post('http://127.0.0.1:5000/transcribe_audio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setCurrentMessage(response.data.transcribed_text); // Set transcribed text for editing, instead of sending it directly
        } catch (error) {
            console.error('Error uploading audio:', error);
            alert('Error uploading audio: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <Header title="Rozmowa z asystentem" />
            <ChatWidget messages={messages} isProcessing={isProcessing} />
            <MessageInput
                currentMessage={currentMessage}
                onMessageChange={setCurrentMessage}
                onMessageSubmit={handleTextSubmit}
            />
            <RecordButton onRecord={handleAudioUpload} isProcessing={isProcessing} />
            <button onClick={resetConversation} className="reset-conversation-button">
                Zrestartuj rozmowę
            </button>
        </div>
    );
};

export default ChatPage;
