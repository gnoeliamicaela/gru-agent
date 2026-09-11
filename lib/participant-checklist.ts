import type { Participant, ItemTipo } from "@/lib/mock-data";
import { getStageRequirements, normalize } from "@/lib/stage-requirements";
import type { EtapaNombre, StageRequirements } from "@/lib/stage-requirements";

export type ChecklistState = "completo" | "pendiente" | "rechazado" | "falta";

export interface ChecklistItem {
  tipo: ItemTipo;
  nombre: string;
  orden: number;
  estado: ChecklistState;
  motivo_rechazo: string | null;
}

export type NextStep =
  | { kind: "item"; tipo: ItemTipo; nombre: string }
  | { kind: "next-stage"; etapa: EtapaNombre; tipo: ItemTipo; nombre: string }
  | { kind: "all-done" };

export function getParticipantChecklist(
  participant: Participant,
): ChecklistItem[] {
  const currentStage = getStageRequirements(participant.etapa_actual);

  if (!currentStage || Array.isArray(currentStage)) {
    return [];
  }

  const participantItemsByNormalizedName = new Map(
    participant.items.map((item) => [normalize(item.nombre), item]),
  );

  return currentStage.items.map((catalogItem) => {
    const participantItem = participantItemsByNormalizedName.get(
      normalize(catalogItem.nombre),
    );

    if (!participantItem) {
      return {
        tipo: catalogItem.tipo,
        nombre: catalogItem.nombre,
        orden: catalogItem.orden,
        estado: "pendiente" as const,
        motivo_rechazo: null,
      };
    }

    if (participantItem.estado === "aprobado") {
      return {
        tipo: catalogItem.tipo,
        nombre: catalogItem.nombre,
        orden: catalogItem.orden,
        estado: "completo" as const,
        motivo_rechazo: null,
      };
    }

    if (participantItem.estado === "rechazado") {
      return {
        tipo: catalogItem.tipo,
        nombre: catalogItem.nombre,
        orden: catalogItem.orden,
        estado: "rechazado" as const,
        motivo_rechazo: participantItem.motivo_rechazo,
      };
    }

    if (participantItem.estado === "pendiente") {
      return {
        tipo: catalogItem.tipo,
        nombre: catalogItem.nombre,
        orden: catalogItem.orden,
        estado: "pendiente" as const,
        motivo_rechazo: null,
      };
    }

    return {
      tipo: catalogItem.tipo,
      nombre: catalogItem.nombre,
      orden: catalogItem.orden,
      estado: "falta" as const,
      motivo_rechazo: participantItem.motivo_rechazo,
    };
  });
}

export function getNextStep(participant: Participant): NextStep {
  const checklist = getParticipantChecklist(participant);
  const firstIncomplete = checklist.find((item) => item.estado !== "completo");

  if (firstIncomplete) {
    return {
      kind: "item",
      tipo: firstIncomplete.tipo,
      nombre: firstIncomplete.nombre,
    };
  }

  const allStages = getStageRequirements();
  if (!Array.isArray(allStages)) {
    return { kind: "all-done" };
  }

  const currentStageIndex = allStages.findIndex(
    (stage) => stage.etapa === participant.etapa_actual,
  );

  if (currentStageIndex === -1 || currentStageIndex === allStages.length - 1) {
    return { kind: "all-done" };
  }

  const nextStage = allStages[currentStageIndex + 1];
  const firstItemOfNextStage = nextStage.items[0];

  return {
    kind: "next-stage",
    etapa: nextStage.etapa,
    tipo: firstItemOfNextStage.tipo,
    nombre: firstItemOfNextStage.nombre,
  };
}
