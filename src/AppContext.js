// src/AppContext.js

import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export const OutputTypes = {
    VOWELS: 'vowels',
    WORDS: 'words',
    SENTENCES: 'sentences',
};

export const AppProvider = ({ children }) => {
    const [language, setLanguage] = useState('pl');
    const [outputLanguage, setOutputLanguage] = useState('pl');
    const [notification, setNotification] = useState({ visible: false, text: '' });
    const [outputType, setOutputType] = useState(null);
    const [outputContent, setOutputContent] = useState('');
    const [outputText, setOutputText] = useState('');
    const [outputVisible, setOutputVisible] = useState(false);
    const [sourceInfo, setSourceInfo] = useState({ source: null, sentence: null, tempo: null, translation: null });
    const [user, setUser] = useState(null); // State to manage logged-in user

    const showNotification = useCallback((text) => {
        setNotification({ visible: true, text });
    }, []);

    const memoizedSetLanguage = useCallback((lang) => {
        setLanguage(lang);
    }, []);

    const memoizedUpdateOutputContent = useCallback((content, lang, type, source = '', sentence = '', tempo = '') => {
        setSourceInfo({ source, sentence, tempo });
        setOutputLanguage(lang);
        setOutputContent(content);
        setOutputType(type);
        setOutputVisible(true);
    }, []);

    const login = useCallback((userData) => {
        setUser(userData); // Set logged-in user data
    }, []);

    const logout = useCallback(() => {
        setUser(null); // Clear logged-in user data
    }, []);

    return (
        <AppContext.Provider value={{
            language,
            setLanguage: memoizedSetLanguage,
            notification,
            showNotification,
            outputContent,
            outputType,
            outputText,
            outputLanguage,
            setOutputLanguage,
            setOutputText,
            updateOutputContent: memoizedUpdateOutputContent,
            outputVisible,
            sourceInfo,
            user,
            login,
            logout,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;

