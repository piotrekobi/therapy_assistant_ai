// src/IntonationTraining.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import RecordButton from './components/RecordButton'; // Załóżmy, że masz już gotowy komponent do nagrywania
import './css/IntonationTraining.css';

export const IntonationTraining = () => {
    const [currentWord, setCurrentWord] = useState('');
    const [intonation, setIntonation] = useState('');
    const [detectedEmotion, setDetectedEmotion] = useState('');
    const [distances, setDistances] = useState('');


    useEffect(() => {
        fetchWord();
    }, []);

    const fetchWord = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_intonation_word');
            if (response.data) {
                setCurrentWord(response.data.word);
                setIntonation(response.data.intonation);
            }
        } catch (error) {
            console.error('Błąd podczas pobierania słowa:', error);
        }
    };

    const handleAudioUpload = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('word', currentWord);

        try {
            const response = await axios.post('http://127.0.0.1:5000/evaluate_intonation', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDetectedEmotion(response.data.emotion);
            setDistances(JSON.stringify(response.data.distances));

        } catch (error) {
            console.error('Błąd podczas wysyłania nagrania:', error);
        }
    };

    return (
        <div>
            <Header title="Trening intonacji" />
            <div className="intonation-container">
                <h2>Słowo do powtórzenia: {currentWord}</h2>
                <p>Intonacja: {intonation}</p>
                <div className="record-section">
                    <RecordButton onRecord={handleAudioUpload} />
                </div>
                {detectedEmotion && <p className="feedback-message">Wykryta intonacja: {detectedEmotion}</p>}
                {distances && <p className="feedback-message">Odległości: {distances}</p>}
                <button className="fetch-word" onClick={fetchWord}>Następne słowo</button>
            </div>
        </div>
    );
};


export default IntonationTraining;
