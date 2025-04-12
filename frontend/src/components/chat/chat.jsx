import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';  // You can style the chat here
import { GoogleGenerativeAI } from '@google/generative-ai';
import SpeechToText from '../speechtotext/speechToTest'; // Import SpeechToText component

const Chat = () => {
  const API_KEY = 'AIzaSyDIk40zZQB5XzuNGm8eVSU7vI3s3A2e5x8';
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [query, setQuery] = useState(''); // Current query input
  const [loading, setLoading] = useState(false); // State to show loading indicator

  const chatContainerRef = useRef(null); // Reference to the chat container to auto-scroll

  // Function to send the query to Gemini API and get the response
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if query is empty
    if (!query.trim()) {
      return;
    }

    // Add user query to the chat
    setMessages([...messages, { text: query, sender: 'user' }]);
    setQuery('');
    setLoading(true); // Show loading state while waiting for the response

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(query);
      const aiResponse = result.response.text();

      // Add AI response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: aiResponse, sender: 'ai' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'An error occurred. Please try again later.', sender: 'ai' },
      ]);
    } finally {
      setLoading(false); // Hide loading after receiving response
    }
  };

  // Handle input change (when the user types in the text box)
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat with AI</h2>

      <div className="chat-box" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-text">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message ai-message">
            <div className="message-text">...AI is typing...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        {/* Speech-to-Text button to the left of Send button */}
        <div className="speech-to-text">
          <SpeechToText setQuery={setQuery} />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Ask a question"
          className="chat-input"
        />

        <button type="submit" className="chat-submit-btn">Send</button>
      </form>

    </div>
  );
};

export default Chat;
