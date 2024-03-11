import React, { useContext, useState } from 'react';
import { AppContext, OutputTypes } from '../AppContext';
import { generateSentence, regenerateSentence, renderEnglishSentence, translateToPolish } from '../utils/apiUtils';
import '../css/WidgetContainer.css';
import '../css/Checkbox.css';
import '../css/Tempo.css';



const wordCountLabels = [
    "1-5", "5-10", "10-15", "15-20", "20-25", "25-30",
    "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100", "100+"
];

const WidgetContainer = () => {
    const [tempo, setTempo] = useState('1');
    const [wordCountIndex, setWordCountIndex] = useState(2);
    const { language, showNotification, updateOutputContent, setOutputText, sourceInfo, user } = useContext(AppContext);

    const handleSentenceClick = async () => {
        createSentence(false);
    };

    const createSentence = async (regenerate, newTempo = tempo) => {
        const rangeLabel = wordCountLabels[wordCountIndex - 1];
        let data;
        if (regenerate) {
            data = await regenerateSentence(newTempo, sourceInfo.sentence, sourceInfo.source);
        } else {
            data = await generateSentence(user.username, rangeLabel, newTempo, language)
        }
        setOutputText(data.text);
        if (language === 'en') {
            const translation = await translateToPolish(data.sentence);
            updateOutputContent(renderEnglishSentence(data.text, translation), language, OutputTypes.SENTENCES, data.source, data.sentence, newTempo);
        } else {
            updateOutputContent(data.text, language, OutputTypes.SENTENCES, data.source, data.sentence, newTempo);
        }
        showNotification("Skopiowano do schowka");
    };


    const handleWordCountChange = (event) => {
        setWordCountIndex(parseInt(event.target.value));
    };

    const handleTempoChange = async (event) => {
        const newTempo = event.target.value;
        setTempo(newTempo);

        if (sourceInfo.sentence) {
            createSentence(true, newTempo);
        }
    };

    return (
        <div className="widget-container">
            <div className="widget-row">
                <button onClick={handleSentenceClick} id="buttonSentence">Losuj zdanie</button>
                <div className="slider-container">
                    <label htmlFor="wordCount">Liczba słów: </label>
                    <input type="range" id="wordCount" name="wordCount" min="1" max="14" value={wordCountIndex} onChange={handleWordCountChange} />
                    <span id="sliderLabel">{wordCountLabels[wordCountIndex - 1]}</span>
                </div>
                <div className="tempo-container">
                    <label htmlFor="tempo">Tempo: </label>
                    <select id="tempo" name="tempo" value={tempo} onChange={handleTempoChange}>
                        <option value="1">Pierwsze</option>
                        <option value="2">Drugie wolne</option>
                        <option value="3">Drugie średnie</option>
                        <option value="4">Drugie szybkie</option>
                        <option value="5">Trzecie wolne</option>
                        <option value="6">Trzecie średnie</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default WidgetContainer;
