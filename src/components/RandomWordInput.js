// src/components/RandomWordInput.js
import React, { useState, useContext } from 'react';
import LabeledCheckBox from './LabeledCheckBox';
import { AppContext, OutputTypes } from '../AppContext';
import { generateRandomWord, renderEnglishWord, translateToPolish } from '../utils/apiUtils';
import '../css/RandomWordInput.css';


const RandomWordInput = () => {
    const [value, setValue] = useState('');
    const [startsWith, setStartsWith] = useState(false);
    const [endsWith, setEndsWith] = useState(false);
    const { language, updateOutputContent } = useContext(AppContext);

    const handleKeyUp = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const data = await generateRandomWord(value, startsWith, endsWith, language);

            if (data.text) {
                if (language === 'en') {
                    let translation = await translateToPolish(data.text);
                    updateOutputContent(renderEnglishWord(data.text, translation), language, OutputTypes.WORDS);
                }
                else {
                    updateOutputContent(data.text, language, OutputTypes.WORDS);
                }
            }
            else {
                updateOutputContent("Nie znaleziono słów", language, OutputTypes.WORDS);
            }
        }
    };

    return (
        <div>
            <label htmlFor="randomWordInput">Losuj słowo zawierające znaki: </label>
            <input
                id="randomWordInput"
                type="text"
                placeholder="Wprowadź znaki..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyUp={handleKeyUp}
            />
            <LabeledCheckBox
                id="startsWithCheckbox"
                text="Na początku słowa"
                checked={startsWith}
                onChange={(e) => setStartsWith(e.target.checked)}
            />
            <LabeledCheckBox
                id="endsWithCheckbox"
                text="Na końcu słowa"
                checked={endsWith}
                onChange={(e) => setEndsWith(e.target.checked)}
            />
        </div>
    );
};

export default RandomWordInput;
