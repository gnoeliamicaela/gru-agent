"use client";

import { useState } from "react";
import { findParticipantAction, identifyParticipantWithLastName } from "@/lib/actions";
import type { Participant } from "@/lib/mock-data";

type GateStatus = "idle" | "error" | "locked" | "loading" | "ambiguous";

interface NameGateProps {
  onValidated: (participant: Participant) => void;
}

export default function NameGate({ onValidated }: NameGateProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<GateStatus>("idle");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [pendingFirstName, setPendingFirstName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    if (pendingFirstName === null) {
      // First attempt: parse input (1 word or 2+ words)
      const parts = input.trim().split(/\s+/);
      const nombre = parts[0];
      const apellido = parts.length >= 2 ? parts.slice(1).join(" ") : null;

      // Require both name and last name
      if (!apellido) {
        setStatus("error");
        setInput("");
        return;
      }

      const result = await identifyParticipantWithLastName(nombre, apellido);

      if (result.status === "identified" && result.participant) {
        onValidated(result.participant);
      } else if (result.status === "ambiguous") {
        // Multiple candidates with same first name
        setPendingFirstName(nombre);
        setStatus("ambiguous");
        setInput("");
      } else {
        // Not found: increment failed attempts
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            setStatus("locked");
          } else {
            setStatus("error");
          }
          return newCount;
        });
        setInput("");
      }
    } else {
      // Second attempt: input is the last name for disambiguation
      const apellido = input.trim();
      if (!apellido) {
        setStatus("error");
        setInput("");
        return;
      }

      const result = await identifyParticipantWithLastName(pendingFirstName, apellido);

      if (result.status === "identified" && result.participant) {
        onValidated(result.participant);
        setPendingFirstName(null);
      } else {
        // Failed even with last name provided: increment failed attempts
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            setStatus("locked");
          } else {
            setStatus("error");
          }
          return newCount;
        });
        setPendingFirstName(null);
        setInput("");
      }
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
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                {pendingFirstName === null
                  ? "¡Hola! 👋 Soy Gru, tu asistente de My Grupolive. Estoy acá para acompañarte en cada paso de tu proceso."
                  : "Necesito también tu apellido para identificarte bien."}
              </label>
              <input
                id="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  pendingFirstName === null
                    ? "Por favor ingresá tu nombre y apellido"
                    : "Ingresá tu apellido..."
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-700"
              />
            </div>

            {status === "error" && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {pendingFirstName === null
                  ? input.trim().split(/\s+/).length < 2
                    ? "Por favor ingresá tu nombre Y apellido."
                    : "No encontramos ese nombre registrado. Verificá y probá de nuevo."
                  : "No encontramos esa combinación de nombre y apellido. Intentá de nuevo."}
              </div>
            )}

            {status === "ambiguous" && (
              <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded">
                Hay varios participantes con ese nombre. Ingresá tu apellido para confirmarte.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Buscando..." : "Ingresar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
