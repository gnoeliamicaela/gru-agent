export interface ParticipantStatusResult {
  found: boolean;
  participant_id?: string;
  nombre?: string;
  etapa_actual?: string;
  items?: { tipo: string; nombre: string; estado: string; comentario: string | null }[];
}

export interface StageRequirementsResult {
  found: boolean;
  etapa?: string;
  orden_etapa?: number;
  items?: { tipo: string; nombre: string; orden: number }[];
  catalogo_completo?: {
    etapa: string;
    orden_etapa: number;
    items: { tipo: string; nombre: string; orden: number }[];
  }[];
}

export interface FaqResult {
  found: boolean;
  topic?: string;
  proposito?: string;
  que_implica?: string;
  dudas_comunes?: { pregunta: string; respuesta: string }[];
}

export interface EscalateResult {
  escalated: true;
  delivered: boolean;
  email?: {
    para: string;
    asunto: string;
    remitente: string;
    remitente_email: string;
    nombre_participante: string;
    etapa_actual: string;
    motivo: string;
  };
}
