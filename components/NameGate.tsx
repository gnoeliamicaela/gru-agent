"use client";

import { useState } from "react";
import { findParticipantByName, type Participant } from "@/lib/mock-data";

type GateStatus = "idle" | "error" | "locked";

interface NameGateProps {
  onValidated: (participant: Participant) => void;
}

export default function NameGate({ onValidated }: NameGateProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<GateStatus>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const participant = findParticipantByName(input);
    if (participant) {
      onValidated(participant);
    } else {
      setStatus((prev) => (prev === "error" ? "locked" : "error"));
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Grupolive</h1>
        <p className="text-gray-600 mb-6">Asistente de soporte para participantes</p>

        {status === "locked" ? (
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              No pudimos confirmar tu identidad. Por las dudas no sigas intentando acá — contactá directamente a tu asesor de My Grupolive para que te ayude a ingresar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es tu nombre?
              </label>
              <input
                id="name"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ingresá tu nombre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-700"
              />
            </div>

            {status === "error" && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                No te encontramos como participante registrado. Si creés que es un error, contactá a tu asesor.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Ingresar
            </button>
          </form>
        )}

        {status !== "locked" && (
          <p className="text-xs text-gray-500 mt-6 text-center">
            Participantes de prueba: María, Juan, Lucía
          </p>
        )}
      </div>
    </div>
  );
}
