// src/ChatPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import {AppContext} from './AppContext';
import Header from './components/Header';
import ChatWidget from './components/ChatWidget';
import RecordButton from './components/RecordButton';

export const ChatPage = () => {
    const { user } = useContext(AppContext);

    const [messages, setMessages] = useState([
        { sender: 'assistant', text: 'Cześć! Jak mogę Ci dzisiaj pomóc?' },
    ]);
    const [isProcessing, setIsProcessing] = useState(false);

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
            setMessages(messages => [...messages, { sender: 'user', text: response.data.transcribed_text }, { sender: 'assistant', text: response.data.llm_response }]);
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
            <RecordButton onRecord={handleAudioUpload} />
        </div>
    );
};

export default ChatPage;
