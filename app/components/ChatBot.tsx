"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Minus, Maximize2, Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const initialMessages: Message[] = [
  { role: "assistant", text: "Hi! I'm OmniLearn Assistant. How can I help you today? You can ask me about courses, billing, account issues, or anything else about the platform." },
];

async function sendMessages(messages: { role: string; content: string }[], onChunk: (text: string) => void) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");

    const userMsg: Message = { role: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    setIsTyping(true);
    const botMsg: Message = { role: "assistant", text: "" };
    setMessages((prev) => [...prev, botMsg]);

    const apiMessages = updatedMessages.map((m) => ({ role: m.role, content: m.text }));

    await sendMessages(apiMessages, (chunk) => {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.role === "assistant") {
          copy[copy.length - 1] = { ...last, text: last.text + chunk };
        }
        return copy;
      });
    });

    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Open Chat Bot"
      >
        <MessageCircle size={20} />
        <span>Chat with us</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-50 flex items-center gap-3 bg-indigo-600 text-white px-4 py-2.5 rounded-full shadow-lg">
        <Bot size={18} />
        <span className="text-sm font-medium">OmniLearn Assistant</span>
        <button onClick={() => setIsMinimized(false)} className="ml-1 hover:text-indigo-200 transition-colors" aria-label="Expand chat">
          <Maximize2 size={14} />
        </button>
        <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200 transition-colors" aria-label="Close chat">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 md:bg-transparent md:pointer-events-none" onClick={() => setIsOpen(false)} />

      <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden md:bottom-24 md:right-6" style={{ height: "min(600px, calc(100vh - 120px))" }}>
        {/* Header */}
        <div className="bg-indigo-600 text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">OmniLearn Assistant</div>
              <div className="text-[10px] text-indigo-200">Online · AI-powered</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Minimize chat">
              <Minus size={16} />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-indigo-600 text-white"}`}>
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-md" : "bg-white text-gray-700 border border-gray-100 rounded-tl-md shadow-xs"}`}>
                {msg.text || (i === messages.length - 1 && isTyping ? <span className="animate-pulse">▊</span> : "")}
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length - 1]?.text && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-xs">
                <Loader2 size={16} className="text-gray-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-4 py-3 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-400 text-gray-900"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">
            By chatting you agree to our Privacy Policy and Terms of Service
          </p>
        </div>
      </div>
    </>
  );
}
