import type { Participant } from "@/lib/mock-data";
import { getParticipantChecklist, getNextStep } from "@/lib/participant-checklist";
import DocumentChecklist from "./DocumentChecklist";

interface StatusPanelProps {
  participant: Participant;
}

export default function StatusPanel({ participant }: StatusPanelProps) {
  const checklist = getParticipantChecklist(participant);
  const nextStep = getNextStep(participant);

  const renderNextStepLine = () => {
    switch (nextStep.kind) {
      case "item":
        return `${nextStep.nombre}`;
      case "next-stage":
        return `Pasás a: ${nextStep.etapa} — ${nextStep.nombre}`;
      case "all-done":
        return "¡Completaste todos los pasos del proceso!";
    }
  };

  return (
    <div className="bg-white border-b md:border-b-0 md:border-r border-gray-200 md:w-80 shrink-0 overflow-y-auto p-4 space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Etapa actual
        </p>
        <p className="text-sm text-gray-900 mt-1">{participant.etapa_actual}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Próximo paso
        </p>
        <p className="text-sm text-gray-900 mt-1">{renderNextStepLine()}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Documentos
        </p>
        <DocumentChecklist items={checklist} />
      </div>
    </div>
  );
}
