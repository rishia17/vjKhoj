"use client"

import { useState, useEffect, useRef } from "react"
import "./Chat.css"
import SpeechToText from "../speechtotext/speechToTest"
import TypewriterText from "../TypewriterText"
import { IoSendSharp } from "react-icons/io5"
import { HiSparkles } from "react-icons/hi2"
import { BsChatDots } from "react-icons/bs"
import { Link } from "react-router-dom"

const Chat = () => {
  const API_KEY = "AIzaSyDIk40zZQB5XzuNGm8eVSU7vI3s3A2e5x8"
  const [messages, setMessages] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState("dark")
  const chatContainerRef = useRef(null)
  const [typingText, setTypingText] = useState(null)
  const textareaRef = useRef(null)

  const autoResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setMessages([...messages, { text: query, sender: "user" }])
    setQuery("")
    setLoading(true)
    setTypingText(null)
    setTimeout(() => autoResize(), 0)

    try {
      // Call your FastAPI backend instead of Gemini
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      })
      const data = await response.json()
      const aiResponse = data.response || "No response from RAG model."
      setTypingText(aiResponse)
    } catch (error) {
      console.error("Error:", error)
      setTypingText("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typingText !== null) {
      const timer = setTimeout(
        () => {
          setMessages((prev) => [...prev, { text: typingText, sender: "ai" }])
          setTypingText(null)
        },
        typingText.length * 25 + 100,
      )
      return () => clearTimeout(timer)
    }
  }, [typingText])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, typingText])

  return (
    <div className={`chat-wrapper ${theme}`}>
      {/* Enhanced Background */}
      <div className="chat-background">
        <div className="bg-gradient"></div>
        <div className="mesh-gradient"></div>
      </div>

      {/* Header */}
      <div className="chat-header p-1">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <div className="logo-section">
              <div className="logo-container">
                <HiSparkles className="logo-icon" />
              </div>
              <div className="title-section">
                <h2 className="chat-title">VJ KHOJ</h2>
                <span className="chat-subtitle">VNR VJIET</span>
              </div>
            </div>
          </Link>
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className="toggle-track">
              <div className="toggle-thumb"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-body" ref={chatContainerRef}>
        {messages.length === 0 && (
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-icon-container">
                <BsChatDots className="welcome-icon" />
              </div>
              <h3 className="welcome-title">How can I help you today?</h3>
              <p className="welcome-subtitle">Ask me anything - I'm here to assist with your questions and tasks</p>
              <div className="suggestion-chips">
                <button className="suggestion-chip">✨ Lab Assistance</button>
                <button className="suggestion-chip">🔍 Research help</button>
                <button className="suggestion-chip">💡 Faculty Assistance</button>
                <button className="suggestion-chip">📚 Learning support</button>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === "user" ? (
                <div className="user-avatar">You</div>
              ) : (
                <div className="ai-avatar">
                  <HiSparkles />
                </div>
              )}
            </div>
            <div className="message-bubble">
              {/* <div className="message-header">{msg.sender === "user" ? "You" : "VJ KHOJ"}</div> */}
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}

        {typingText && (
          <div className="message-container ai">
            <div className="message-avatar">
              <div className="ai-avatar">
                <HiSparkles />
              </div>
            </div>
            <div className="message-bubble typing-bubble">
              <div className="message-header">VJ KHOJ</div>
              <div className="message-content">
                <div className="message-text">
                  <TypewriterText text={typingText} />
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && !typingText && (
          <div className="message-container ai">
            <div className="message-avatar">
              <div className="ai-avatar">
                <HiSparkles />
              </div>
            </div>
            <div className="message-bubble">
              <div className="message-header">VJ KHOJ</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ChatGPT-style Input Dialog */}
      <div className="input-dialog-container">
        <div className="input-dialog">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-field-container">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  autoResize()
                }}
                placeholder="Message AI Assistant..."
                className="input-field"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <div className="input-actions">
                <SpeechToText setQuery={setQuery} />
                <button type="submit" className={`send-btn ${query.trim() ? "active" : ""}`} disabled={!query.trim()}>
                  <IoSendSharp />
                </button>
              </div>
            </div>
          </form>
          <div className="input-footer">
            <p className="input-disclaimer">AI can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
