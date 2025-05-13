import React, { useState, useRef, useEffect } from "react";
import {
  startConnection,
  sendMessage,
  stopConnection,
  ChatHistoryMessage,
  connection
} from "../Services/signalR";

export const ChatePage = () => {
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Replace with your actual user name logic
  const user = localStorage.getItem("username") || "You";
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    let isMounted = true;

    // Start SignalR connection
    startConnection(
      // On single message
      (msg) => {
        console.log("Received message:", msg);
        if (isMounted) {
          setMessages((prev) => {
            const newMessages = [...prev, msg];
            console.log("Updated messages:", newMessages);
            return newMessages;
          });
        }
      },
      // On history
      (msgs) => {
        console.log("Received chat history:", msgs);
        if (isMounted) {
          const reversedMessages = [...msgs].reverse();
          console.log("Reversed messages:", reversedMessages);
          setMessages(reversedMessages);
        }
      }
    ).then(() => {
      // Request chat history after connection is established
      if (connection) {
        connection.invoke("GetChatHistory");
      }
    });

    return () => {
      isMounted = false;
      stopConnection();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(userId, input);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-10">
      <main className="w-full max-w-2xl flex flex-col flex-1 bg-white rounded-3xl shadow-2xl border border-blue-100 mt-12 mb-12 overflow-hidden">
        <header className="px-8 py-7 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-t-3xl shadow flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-white drop-shadow"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
              />
            </svg>
            <h2 className="text-2xl font-extrabold tracking-tight drop-shadow">
              Library Chat
            </h2>
          </div>
          <span className="text-sm opacity-90 font-medium bg-blue-600/70 px-4 py-1 rounded-full shadow">
            Welcome, {user}
          </span>
          <div className="absolute left-0 top-0 w-full h-3 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-blue-500 rounded-t-3xl animate-marquee" style={{backgroundSize: '200% 100%', animation: 'marquee 4s linear infinite'}} />
          <style>{`
            @keyframes marquee {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
          `}</style>
        </header>
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4 bg-blue-50 max-h-[60vh] min-h-[300px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 italic py-12">
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-xl ${
                msg.user === user ? "ml-auto items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-gray-500 mb-1">
                {msg.user} •{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div
                className={`px-5 py-3 rounded-2xl shadow-md text-base font-medium break-words ${
                  msg.user === user
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-blue-100"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="bg-white flex items-center gap-2 px-6 py-4 border-t rounded-b-3xl"
        >
          <input
            type="text"
            className="flex-1 rounded-full border border-blue-200 text-black bg-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 caret-blue-600 text-base shadow-sm"
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            maxLength={500}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full font-semibold transition text-base shadow-md disabled:opacity-60"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatePage;
