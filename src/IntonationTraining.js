import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import RecordButton from './components/RecordButton'; // Załóżmy, że masz już gotowy komponent do nagrywania

export const IntonationTraining = () => {
    const [currentWord, setCurrentWord] = useState('');
    const [intonation, setIntonation] = useState('');
    const [feedback, setFeedback] = useState('');

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
            setFeedback(response.data.feedback);
        } catch (error) {
            console.error('Błąd podczas wysyłania nagrania:', error);
            setFeedback('Nie udało się ocenić intonacji.');
        }
    };

    return (
        <div>
            <Header title="Trening intonacji" />
            <div style={{ margin: '20px' }}>
                <h2>Słowo do powtórzenia: {currentWord}</h2>
                <p>Intonacja: {intonation}</p>
                <RecordButton onRecord={handleAudioUpload} />
                {feedback && <p>Ocena intonacji: {feedback}</p>}
                <button onClick={fetchWord}>Następne słowo</button>
            </div>
        </div>
    );
};

export default IntonationTraining;
