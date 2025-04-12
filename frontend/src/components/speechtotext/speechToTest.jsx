import React, { useState, useRef } from 'react';

const SpeechToText = ({ setQuery }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null); // Store the recognition instance

  // Start Recording function
  const startRecording = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log('Voice recognition started...');
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let newTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript;
      }

      setQuery(newTranscript); // update text input value in Chat component
    };

    recognition.onerror = (event) => {
      console.error('Recognition Error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="speech-to-text">
      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        type="button"
        onClick={handleToggleRecording}
      >
        <i className={`fa ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
      </button>
    </div>
  );
};

export default SpeechToText;
