import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { copyToClipboard } from '../utils/clipboardUtils';
import '../css/ShareButton.css';



const ShareButton = () => {
    const { tempo, outputLanguage, outputText, outputVisible, sourceInfo, outputType, showNotification} = useContext(AppContext);

    if (!outputVisible) return null;

    const handleShareClick = async () => {
        const contentToShare = {
            tempo: tempo,
            lang: outputLanguage,
            output: outputText,
            source: sourceInfo.source,
            sentence: sourceInfo.sentence,
            outputType: outputType
        };

        const contentToShareStr = encodeURIComponent(JSON.stringify(contentToShare));
        const shareableURL = `${window.location.origin}?share=${contentToShareStr}`;
        await copyToClipboard(shareableURL);
        showNotification("Skopiowano link do udostępnienia");
    };

    return <button id="shareButton" onClick={handleShareClick}>Udostępnij</button>;
};

export default ShareButton;
