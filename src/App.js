import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // We'll move background styles here

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isApiConfigured = () => {
    return (
      process.env.REACT_APP_GOOGLE_AI_API_KEY &&
      process.env.REACT_APP_GOOGLE_AI_API_KEY !==
        "your_google_ai_api_key_here"
    );
  };

  const getAIResponse = async (userMessage) => {
    if (!isApiConfigured()) {
      return "❌ Please configure your Google Gemini API key in the .env file to use AI features!";
    }

    setIsTyping(true);
    setError("");

    try {
      const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Answer the following question in clear, concise, numbered bullet points:\n\n${userMessage}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setIsTyping(false);

      if (data?.candidates?.length > 0) {
        const parts = data.candidates[0].content.parts;
        let text =
          parts && parts.length > 0
            ? parts[0].text
            : "Sorry, I could not generate a response.";

        text = text.replace(/\n\s*(\d+\.|-)/g, "\n$1").trim();
        return text;
      } else if (data?.error) {
        setError(data.error.message || "API error");
        return `❌ API Error: ${data.error.message || "Unknown error"}`;
      } else {
        return "Sorry, I could not generate a response.";
      }
    } catch {
      setIsTyping(false);
      setError("Failed to get AI response.");
      return "❌ Sorry, I encountered an error. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setInput("");

    const aiResponse = await getAIResponse(userMessage);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: isApiConfigured()
          ? "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?"
          : "Hello! I'm in demo mode. Add your Google Gemini API key to enable AI responses.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setError("");
  };

  const themeStyles = {
    background: isDarkMode ? "#121212" : "#f7f9fc",
    color: isDarkMode ? "#f5f5f5" : "#222",
    bubbleUser: isDarkMode
      ? "linear-gradient(90deg,#4f8cff,#38c6fa)"
      : "linear-gradient(90deg,#38c6fa,#4f8cff)",
    bubbleBot: isDarkMode ? "#2a2a2a" : "#e3e8ee",
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      {/* Blurred Shapes Background */}
      <div className="bg-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
      </div>

      {/* Chatbot Card */}
      <div
        style={{
          maxWidth: 480,
          margin: "40px auto",
          borderRadius: 16,
          overflow: "hidden",
          background: themeStyles.background,
          color: themeStyles.color,
          fontFamily: "Segoe UI, Arial, sans-serif",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "linear-gradient(90deg,#4f8cff,#38c6fa)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>💬 AI Chatbot</h2>
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </div>

        {/* MESSAGES */}
        <div
          style={{
            minHeight: 320,
            maxHeight: 400,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                margin: "10px 0",
              }}
            >
              <span
                style={{
                  background:
                    msg.sender === "user"
                      ? themeStyles.bubbleUser
                      : themeStyles.bubbleBot,
                  color: msg.sender === "user" ? "#fff" : themeStyles.color,
                  padding: "10px 16px",
                  borderRadius: 18,
                  maxWidth: "75%",
                  fontSize: 15,
                  whiteSpace: "pre-line",
                  boxShadow:
                    msg.sender === "user"
                      ? "0 2px 8px rgba(80,180,255,0.2)"
                      : "none",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {isTyping && (
            <div style={{ margin: "10px 0", color: "#4f8cff" }}>
              <em>Bot is typing...</em>
            </div>
          )}
          {error && (
            <div style={{ color: "#e74c3c", marginBottom: 8 }}>{error}</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "16px 20px",
            borderTop: `1px solid ${isDarkMode ? "#333" : "#e3e8ee"}`,
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #aaa",
              background: isDarkMode ? "#1f1f1f" : "#fff",
              color: themeStyles.color,
              fontSize: 15,
            }}
            disabled={isTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            style={{
              background: "linear-gradient(90deg,#4f8cff,#38c6fa)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0 18px",
              fontWeight: 600,
              fontSize: 15,
              cursor: isTyping || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            Send
          </button>
          <button
            onClick={clearChat}
            disabled={isTyping}
            style={{
              background: themeStyles.bubbleBot,
              color: themeStyles.color,
              border: "none",
              borderRadius: 8,
              padding: "0 14px",
              fontWeight: 500,
              fontSize: 15,
              cursor: isTyping ? "not-allowed" : "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
