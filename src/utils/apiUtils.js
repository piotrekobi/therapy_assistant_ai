// src/utils/apiUtils.js
const API_BASE_URL = 'http://127.0.0.1:5000'; // Adjust this as per your server's URL
const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single'; // Google Translate API Endpoint

export const generateVowels = async (username) => {
    const response = await fetch(`${API_BASE_URL}/generate_vowels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Send the username in the request body
    });
    return response.json();
};

export const generateWords = async (username, language) => {
    const response = await fetch(`${API_BASE_URL}/generate_words?lang=${language}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Send the username in the request body
    });
    return response.json();
};


export const generateSentence = async (username, range, tempo, language) => {
    range = range.replace('+', '%2B');
    const response = await fetch(`${API_BASE_URL}/generate_sentence`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&range=${range}&tempo=${tempo}&lang=${language}`,
    });
    return response.json();

};

export const regenerateSentence = async (tempo, sentence, source) => {
    const response = await fetch(`${API_BASE_URL}/generate_sentence`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `tempo=${tempo}&sentence=${sentence}&source=${source}`,
    });
    return response.json();

};

export const generateRandomWord = async (characters, startsWith, endsWith, language) => {
    const response = await fetch(`${API_BASE_URL}/generate_random_word?characters=${characters}&startsWith=${startsWith}&endsWith=${endsWith}&lang=${language}`, {
        method: 'GET',
    });
    return response.json();
};

export const translateToPolish = async (text) => {
    const response = await fetch(`${GOOGLE_TRANSLATE_API}?client=gtx&sl=en&tl=pl&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    const translatedSentences = data[0].map((item) => item[0]).filter(Boolean); // Extract and filter out null values
    const translatedText = translatedSentences.join(' ');
    return translatedText;
};

export const speakWordPronunciation = (word) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.5;
    speechSynthesis.speak(utterance);
};

export const renderEnglishWord = (text, translation, key) => {
    const [word, intonation] = text.split(' - ');
    return (
        <div key={key} className="line-container"> {/* Unique key added here */}
            <span className="ear-button" style={{ cursor: "pointer" }} onClick={() => speakWordPronunciation(word)}
                onMouseOver={e => (e.target.style.filter = 'brightness(80%)')}
                onMouseOut={e => (e.target.style.filter = 'brightness(100%)')}>👂</span>
            {' '}
            <span className="word">{word} ({translation}) {intonation ? `- ${intonation}` : ''}</span>
        </div>
    );
};


export const renderEnglishWords = (text, translations) => {
    return text.split('\n').map((line, lineIndex) => {
        return renderEnglishWord(line, translations[lineIndex], lineIndex);
    });
};


export const renderEnglishSentence = (text, translation) => {
    return (
        <div className="sentence-container">
            {text.split(' ').map((word, index) => {
                const isClickable = word !== "|";
                return (
                    <span
                        key={index}
                        onClick={isClickable ? () => speakWordPronunciation(word) : null}
                        style={{
                            cursor: isClickable ? 'pointer' : 'default',
                            color: isClickable ? 'black' : 'inherit'
                        }}
                        onMouseOver={e => isClickable && (e.target.style.color = 'red')}
                        onMouseOut={e => isClickable && (e.target.style.color = 'black')}
                    >
                        {word}{' '}
                    </span>
                );
            })}
            <div className="translation">
                Tłumaczenie: {translation}
            </div>
        </div>
    );
};
