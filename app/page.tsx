"use client";

import { useState } from "react";
import type { Participant } from "@/lib/mock-data";
import NameGate from "@/components/NameGate";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [participant, setParticipant] = useState<Participant | null>(null);

  return participant ? (
    <ChatWindow participant={participant} />
  ) : (
    <NameGate onValidated={setParticipant} />
  );
}
