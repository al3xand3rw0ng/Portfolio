import { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

export default function ChatBot() {
  const [showBubble, setShowBubble] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth - 375,
    y: window.innerHeight - 515,
  });
  const [dragged, setDragged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([
    {
      text: "Welcome to my AI chatbot assistant! Select an option below or enter your question for more details.",
      sender: "bot",
    },
  ]);
  const [showOptions, setShowOptions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: import.meta.env.VITE_GEMINI_MODEL_NAME,
  });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const options = [
    "What is this website about?",
    "Can I see Alexander's projects?",
    "Tell me about Alexander's experience.",
    "Something else.",
  ];

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragged(true);
    setRel({ x: e.pageX - position.x, y: e.pageY - position.y });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: globalThis.MouseEvent) => {
    if (!dragging || !rel) return;
    setPosition({ x: e.pageX - rel.x, y: e.pageY - rel.y });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    if (!dragged) {
      const updatePosition = () => {
        setPosition({
          x: window.innerWidth - 375,
          y: window.innerHeight - 515,
        });
      };
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }
  }, [dragged]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isLoading && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading]);

  const getBotResponse = async (userText: string) => {
    setIsLoading(true);
    switch (userText) {
      case "What is this website about?":
        setIsLoading(false);
        return "Alexander built this website using React to showcase his projects, provide biographical details, and highlight his creativity.";

      case "Can I see Alexander's projects?":
        setIsLoading(false);
        return "Sure! You can find Alexander's projects under the 'Projects' section.";

      case "Tell me about Alexander's experience.":
        setIsLoading(false);
        return "Alexander has experience in full-stack development, specializing in React, TypeScript, and backend APIs.";

      case "Something else.":
        setIsLoading(false);
        return "Feel free to ask me anything, and I'll do my best to help!";

      default:
        try {
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userText }] }],
            generationConfig,
            safetySettings,
          });

          const response = await result.response;
          return response.text();
        } catch {
          return "Error generating response. Please try again.";
        } finally {
          setIsLoading(false);
        }
    }
  };
  const handleSendMessage = async (message: string) => {
    if (message.trim() === "") return;

    const userMessage = { text: message, sender: "user" };
    const botResponseText = await getBotResponse(message);
    const botMessage = { text: botResponseText, sender: "bot" };

    setMessages((prev: any) => [
      ...prev,
      userMessage,
      botMessage,
      {
        text: "Select an option below or enter your question for more details.",
        sender: "bot",
      },
    ]);

    setShowOptions(true);
    setInputValue("");
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        {showBubble && !showChat && (
          <div className="chatbot-bubble position-relative p-2">
            <div className="d-flex justify-content-between align-items-start">
              <span className="chatbot-bubble-text flex-grow-1">
                Hello there! Need help finding information? Ask my AI chatbot
                assistant a question ☺️.
              </span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowBubble(false)}
                aria-label="close"
              ></button>
            </div>
            <div className="chatbot-tail"></div>
          </div>
        )}

        {!showChat && (
          <img
            className="chatbot-image"
            src="./images/headshot.jpg"
            alt="Chatbot"
            onClick={() => {
              setShowBubble(false);
              setShowChat(true);
            }}
          />
        )}

        {showChat && (
          <div
            className="chat-window card shadow"
            style={{
              width: "325px",
              height: "475px",
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            <div
              className="chat-header card-header d-flex justify-content-between align-items-center"
              onMouseDown={onMouseDown}
              style={{ cursor: dragging ? "grabbing" : "grab" }}
            >
              <h5 className="m-0">Alexander's Chatbot</h5>
              <button
                type="button"
                className="btn-close chat-close-btn"
                onClick={() => {
                  setPosition({
                    x: window.innerWidth - 375,
                    y: window.innerHeight - 515,
                  });
                  setShowChat(false);
                  setDragged(false);
                }}
                aria-label="close"
              ></button>
            </div>

            <div
              className="chat-messages p-3"
              style={{
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message card p-2 mb-2 shadow ${
                    msg.sender === "user"
                      ? "user-message text-end"
                      : "chatbot-message text-start"
                  }`}
                  style={{
                    maxWidth: "70%",
                    width: "fit-content",
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    marginLeft: msg.sender === "user" ? "auto" : "0",
                  }}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}

              {showOptions && (
                <div className="chat-options d-flex flex-wrap gap-2">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="chat-option card p-2 mb-2 shadow"
                      onClick={() => handleSendMessage(option)}
                      style={{ cursor: "pointer" }}
                    >
                      <p className="m-0">{option}</p>
                    </div>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="loading-animation d-flex align-items-center gap-2 mt-2">
                  <img
                    src="./images/headshot.jpg"
                    alt="Thinking..."
                    className="loading-image"
                  />
                  <span className="loading-text">Thinking...</span>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            <div className="chat-input-section mt-0">
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  className="form-control chat-input p-2 shadow"
                  placeholder="Type your question..."
                  value={inputValue}
                  disabled={isLoading}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendMessage(inputValue)
                  }
                />
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className={`send-btn ${isLoading ? "disabled" : ""}`}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(inputValue)}
                >
                  <img
                    src="./images/send.png"
                    className="send-img"
                    alt="send"
                  />
                </button>
              </div>
              <div className="text-center p-2 disclaimer-text">
                <b>DISCLAIMER</b>: While I strive to provide accurate
                information, some details may not be factually correct. Please
                verify all information on my{" "}
                <a
                  href="https://www.linkedin.com/in/a13xanderw0ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn page
                </a>{" "}
                for accuracy.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
