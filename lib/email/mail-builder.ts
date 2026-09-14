export interface StaffEmailData {
  para: string;
  asunto: string;
  remitente: string;
  remitente_email: string;
  nombre_participante: string;
  etapa_actual: string;
  motivo: string;
}

export function buildStaffEmail({
  nombre_participante,
  etapa_actual,
  motivo,
}: {
  nombre_participante: string;
  etapa_actual: string;
  motivo: string;
}): StaffEmailData {
  return {
    para: "support@gru-agent.local",
    asunto: `URGENTE: contactar a ${nombre_participante}`,
    remitente: "Gru",
    remitente_email: "noreply@gru-agent.local",
    nombre_participante,
    etapa_actual,
    motivo,
  };
}
