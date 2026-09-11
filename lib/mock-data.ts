import type { EtapaNombre } from "./stage-requirements";
import { normalize } from "./stage-requirements";

export type ItemTipo = "documento" | "hito_proceso";
export type EstadoDocumento = "pendiente" | "aprobado" | "rechazado";
export type EstadoItem = EstadoDocumento | string;

export interface ParticipantItem {
  tipo: ItemTipo;
  nombre: string;
  estado: EstadoItem;
  motivo_rechazo: string | null;
}

export interface Participant {
  id: string;
  nombre: string;
  etapa_actual: EtapaNombre;
  items: ParticipantItem[];
}

export const PARTICIPANTS: Participant[] = [
  {
    id: "maria",
    nombre: "María",
    etapa_actual: "Carga y validación de documentación personal y universitaria",
    items: [
      {
        tipo: "documento",
        nombre: "Certificado de alumno regular",
        estado: "rechazado",
        motivo_rechazo: "vencido, hay que pedir uno con fecha de emisión de los últimos 30 días",
      },
      { tipo: "documento", nombre: "DNI", estado: "aprobado", motivo_rechazo: null },
    ],
  },
  {
    id: "juan",
    nombre: "Juan",
    etapa_actual: "Carga y validación de documentación personal y universitaria",
    items: [
      { tipo: "documento", nombre: "Curriculum Vitae/Resume", estado: "pendiente", motivo_rechazo: null },
      { tipo: "documento", nombre: "Certificado de alumno regular", estado: "aprobado", motivo_rechazo: null },
    ],
  },
  {
    id: "lucia",
    nombre: "Lucía",
    etapa_actual: "Presentación de documentación ante el sponsor",
    items: [{ tipo: "documento", nombre: "Formulario DS-2019", estado: "pendiente", motivo_rechazo: null }],
  },
];

export function findParticipantByName(input: string): Participant | undefined {
  const normalizedInput = normalize(input);
  return PARTICIPANTS.find((p) => normalize(p.nombre) === normalizedInput);
}

export function getParticipantById(id: string): Participant | undefined {
  return PARTICIPANTS.find((p) => p.id === id.toLowerCase());
}
