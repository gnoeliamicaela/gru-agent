"use client";

import { useState, useRef, useEffect } from "react";
import type { Participant } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/chat/types";
import MessageBubble from "./MessageBubble";
import StatusPanel from "./StatusPanel";

interface ChatWindowProps {
  participant: Participant;
}

export default function ChatWindow({ participant }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    // Optimistic UI: add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: participant.id,
          message: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + (error.error || "Unknown error") },
        ]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      if (data.escalated) {
        setEscalated(true);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Perdón, no pude conectarme con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-900">
          Hola, {participant.nombre}
        </h2>
      </div>

      {/* Escalation banner */}
      {escalated && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Esta conversación fue derivada a un asesor humano. Te van a contactar pronto.
          </p>
        </div>
      )}

      {/* Main layout: status panel + chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Status panel - visible on all sizes */}
        <StatusPanel participant={participant} />

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-sm">¿Qué dudas tenés sobre tu proceso?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí tu pregunta..."
                disabled={loading || escalated}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-700"
              />
              <button
                type="submit"
                disabled={loading || escalated || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
              >
                {loading ? "..." : "Enviar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
