import React, { useContext} from 'react';
import { AppContext } from '../AppContext';
import '../css/Output.css';


const Output = () => {
    const { outputContent, outputVisible,sourceInfo } = useContext(AppContext);

    if (!outputVisible) return null;

    return (
        <div className="output-container">
            <pre>{outputContent}</pre>
            <div className="source-label">
                <span>{sourceInfo.source}</span>
            </div>
        </div>
    );
};

export default Output;
