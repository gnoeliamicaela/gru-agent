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
    para: "staff@mygrupolive.com",
    asunto: `URGENTE: contactar a ${nombre_participante}`,
    remitente: "My Grupolive Agent",
    remitente_email: "noreply@mygrupolive.com",
    nombre_participante,
    etapa_actual,
    motivo,
  };
}
