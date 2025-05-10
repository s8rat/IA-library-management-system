import React, { useState, useRef, useEffect } from "react";
import {
  startConnection,
  sendMessage,
  stopConnection,
  ChatHistoryMessage,
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
        if (isMounted) setMessages((prev) => [...prev, msg]);
      },
      // On history
      (msgs) => {
        console.log("Received chat history:", msgs);
        if (isMounted) setMessages(msgs.reverse());
      }
    );

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
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent max-h-[60vh] min-h-[300px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-xl ${
                  msg.User === user ? "ml-auto items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-gray-500 mb-1">
                  {msg.User || "Unknown"} •{" "}
                  {msg.Timestamp
                    ? new Date(msg.Timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
                <div
                  className={`px-4 py-2 rounded-2xl shadow ${
                    msg.User === user
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.Message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="bg-white flex items-center gap-2 px-4 py-3 border-t"
          >
            <input
              type="text"
              className="flex-1 rounded-full border text-black bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 caret-black"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatePage;
