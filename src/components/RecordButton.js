// src/components/RecordButton.js
import React, { useState } from 'react';

const RecordButton = ({ onRecord }) => {
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            let audioChunks = [];

            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            recorder.start();

            // Update the stopRecording function to utilize closure scope
            // This ensures access to the current audioChunks array and recorder instance
            const stopRecording = () => {
                recorder.stop();
                recorder.stream.getTracks().forEach(track => track.stop()); // Stop the media stream
                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    onRecord(audioBlob); // Pass the audio blob to the parent component
                };
            };

            // Overwrite the setIsRecording function to include stopRecording logic
            setIsRecording(() => stopRecording);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const handleRecordClick = () => {
        if (!isRecording) {
            startRecording();
        } else {
            // Execute the stopRecording if it's a function
            // This conditionally handles the initial state and the functional update
            typeof isRecording === 'function' && isRecording();
            setIsRecording(false);
        }
    };

    return (
        <button onClick={handleRecordClick}>
            {isRecording ? 'Zatrzymaj nagrywanie' : 'Nagraj wiadomość'}
        </button>
    );
};

export default RecordButton;

