import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import { AppContext } from './AppContext';

export const Personalization = () => {
    const { user, setLanguage } = useContext(AppContext);

    // Initial state is set based on local storage or default values
    const [wordLength, setWordLength] = useState(localStorage.getItem('wordLength') || '5-8');
    const [defaultSentenceLength, setDefaultSentenceLength] = useState(localStorage.getItem('sentenceLength') || '1-5');
    const [defaultLanguage, setDefaultLanguage] = useState(localStorage.getItem('exerciseLanguage') || 'polski');
    const [assistantKnowledge, setAssistantKnowledge] = useState(localStorage.getItem('assistantKnowledge') || '');

    const wordCountLabels = [
        "1-5", "5-10", "10-15", "15-20", "20-25", "25-30",
        "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100", "100+"
    ];

    useEffect(() => {
        if (user && user.username) {
            const fetchUserSettings = async () => {
                try {
                    const response = await axios.post('http://127.0.0.1:5000/get_user_settings', { username: user.username }, { withCredentials: true });
                    const settings = response.data;

                    // Update local state and local storage with fetched settings
                    setWordLength(settings.wordLength);
                    setDefaultSentenceLength(settings.defaultSentenceLength);
                    setDefaultLanguage(settings.defaultLanguage);
                    setAssistantKnowledge(settings.assistantKnowledge);

                    // Update local storage
                    localStorage.setItem('wordLength', settings.wordLength);
                    localStorage.setItem('defaultSentenceLength', settings.defaultSentenceLength);
                    localStorage.setItem('defaultLanguage', settings.defaultLanguage);
                    localStorage.setItem('assistantKnowledge', settings.assistantKnowledge);

                    // Update global language setting
                    setLanguage(settings.exerciseLanguage === 'polski' ? 'pl' : 'en');
                } catch (error) {
                    console.error('Error fetching settings:', error);
                }
            };

            fetchUserSettings();
        }
    }, [user, setLanguage]); // Dependencies: user and setLanguage

    const handleSaveSettings = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/save_personalization_settings', {
                username: user.username,
                settings: {
                    wordLength,
                    defaultSentenceLength,
                    defaultLanguage,
                    assistantKnowledge
                }
            }, {
                withCredentials: true
            });

            // Also update local storage
            localStorage.setItem('wordLength', wordLength);
            localStorage.setItem('defaultSentenceLength', defaultSentenceLength);
            localStorage.setItem('defaultLanguage', defaultLanguage);
            localStorage.setItem('assistantKnowledge', assistantKnowledge);

            alert('Ustawienia zapisane!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Nie udało się zapisać ustawień.');
        }
    };

    return (
        <div>
        <Header title="Personalizacja" />
        <div className="personalization-settings">      
            <h2>Ustawienia generatora</h2>
            <label>
                Liczba generowanych słów:
                <input type="number" min="5" max="8" value={wordLength} onChange={(e) => setWordLength(e.target.value)} />
            </label>
            <label>
                Domyślna długość zdania:
                <select value={defaultSentenceLength} onChange={(e) => setDefaultSentenceLength(e.target.value)}>
                    {wordCountLabels.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
            </label>
            <label>
                Domyślny język ćwiczeń:
                <select value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)}>
                    <option value="pl">Polski</option>
                    <option value="en">Angielski</option>
                </select>
            </label>

            <h2>Ustawienia asystenta</h2>
            <label>
                Wiedza asystenta:
                <textarea value={assistantKnowledge} onChange={(e) => setAssistantKnowledge(e.target.value)} placeholder="Dodaj informacje, które asystent powinien wiedzieć o Tobie"></textarea>
            </label>

            <button onClick={handleSaveSettings}>Zapisz ustawienia</button>
        </div>
    </div>
    );
};

export default Personalization;
