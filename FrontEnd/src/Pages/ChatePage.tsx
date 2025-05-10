import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
}

const dummyMessages: Message[] = [
  { id: 1, user: "Alice", content: "Hello everyone! 👋", timestamp: "10:00" },
  { id: 2, user: "Bob", content: "Hi Alice!", timestamp: "10:01" },
];

export const ChatePage = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        user: "You",
        content: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Remove header here if you have a global header */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Optional: User List Sidebar */}
        {/* <aside className="hidden md:block w-64 bg-white border-r p-4"> ... </aside> */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-xl ${
                  msg.user === "You" ? "ml-auto items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-gray-500 mb-1">
                  {msg.user} • {msg.timestamp}
                </span>
                <div
                  className={`px-4 py-2 rounded-2xl shadow ${
                    msg.user === "You"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.content}
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
              className="flex-1 rounded-full border bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 caret-black"
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
      {/* Remove footer here if you have a global footer */}
    </div>
  );
};

export default ChatePage;
