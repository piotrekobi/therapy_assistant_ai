// src/components/Button.js
import React, { useContext } from 'react';
import { AppContext, OutputTypes } from '../AppContext';
import { generateVowels, generateWords, translateToPolish, renderEnglishWords } from '../utils/apiUtils';
import { copyToClipboard } from '../utils/clipboardUtils';
import '../css/Button.css';

const Button = ({ text }) => {
    const { user, language, showNotification, updateOutputContent, setOutputText } = useContext(AppContext);


    const handleClick = async () => {
        let data;
        let type;

        if (text === "Losuj samogłoski") {
            data = await generateVowels(user.username);
            type = OutputTypes.VOWELS;

        } else if (text === "Losuj słowa") {
            data = await generateWords(user.username, language);
            type = OutputTypes.WORDS;

        }

        if (data && data.text) {
            setOutputText(data.text);
            if (language === 'en' && type === OutputTypes.WORDS) {
                let translations = [];
                const lines = data.text.split('\n');
                for (const line of lines) {
                    const word = line.split(' ')[0];
                    const translation = await translateToPolish(word);
                    translations.push(translation);
                }
                updateOutputContent(renderEnglishWords(data.text, translations), language, type);
            } else {
                updateOutputContent(data.text, language, type);
            }
            await copyToClipboard(data.text);
            showNotification("Skopiowano do schowka");
        }
    };
    

    // Disable the button if the text is "Losuj samogłoski" and language is English
    const isDisabled = language === 'en' && text === "Losuj samogłoski";

    return (
        <button onClick={handleClick} disabled={isDisabled}>{text}</button>
    );
};

export default Button;
