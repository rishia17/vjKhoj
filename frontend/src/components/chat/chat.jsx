import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SpeechToText from '../speechtotext/speechToTest';

const Chat = () => {
  const API_KEY = 'AIzaSyDIk40zZQB5XzuNGm8eVSU7vI3s3A2e5x8';
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark'); // ⬅️ New theme state
  const chatContainerRef = useRef(null);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages([...messages, { text: query, sender: 'user' }]);
    setQuery('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(query);
      const aiResponse = result.response.text();

      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: 'An error occurred.', sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setQuery(e.target.value);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chat-container ${theme} pt-2 rounded`}>
  {/* Header */}
  <div className="chat-header">
    <h2 className="chat-title">Chat with AI</h2>
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  </div>

  {/* Chat Messages */}
  <div className="chat-box " ref={chatContainerRef}>
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`message-wrapper ${msg.sender === 'user' ? 'align-right' : 'align-left'}`}
      >
        <div className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
          <div className="message-text">{msg.text}</div>
        </div>
      </div>
    ))}
    {loading && (
      <div className="message-wrapper align-left">
        <div className="message ai-message">
          <div className="message-text">...AI is typing...</div>
        </div>
      </div>
    )}
  </div>

  {/* Footer */}
  <form onSubmit={handleSubmit} className="chat-form">
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
