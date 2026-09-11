export type EtapaNombre =
  | "Pagos"
  | "Carga y validación de documentación personal y universitaria"
  | "Presentación de documentación ante el sponsor"
  | "Entrevista con empleadores estadounidenses"
  | "Entrevista consular"
  | "Preparación previa al viaje";

export interface StageRequirementItem {
  tipo: "documento" | "hito_proceso";
  nombre: string;
  orden: number;
}

export interface StageRequirements {
  etapa: EtapaNombre;
  orden_etapa: number;
  items: StageRequirementItem[];
}

export const STAGE_REQUIREMENTS: StageRequirements[] = [
  {
    etapa: "Pagos",
    orden_etapa: 1,
    items: [{ tipo: "documento", nombre: "Comprobante de pago de inscripción", orden: 1 }],
  },
  {
    etapa: "Carga y validación de documentación personal y universitaria",
    orden_etapa: 2,
    items: [
      { tipo: "documento", nombre: "DNI", orden: 1 },
      { tipo: "documento", nombre: "Pasaporte vigente", orden: 2 },
      { tipo: "documento", nombre: "Certificado de alumno regular", orden: 3 },
      { tipo: "documento", nombre: "Curriculum Vitae/Resume", orden: 4 },
    ],
  },
  {
    etapa: "Presentación de documentación ante el sponsor",
    orden_etapa: 3,
    items: [{ tipo: "documento", nombre: "Formulario DS-2019", orden: 1 }],
  },
  {
    etapa: "Entrevista con empleadores estadounidenses",
    orden_etapa: 4,
    items: [
      { tipo: "hito_proceso", nombre: "Esperando match con empleadores", orden: 1 },
      { tipo: "hito_proceso", nombre: "Esperando entrevista laboral", orden: 2 },
      { tipo: "hito_proceso", nombre: "Esperando resultado de entrevista laboral", orden: 3 },
      { tipo: "hito_proceso", nombre: "Confirmación de posición y paga", orden: 4 },
      { tipo: "hito_proceso", nombre: "Firma de oferta laboral", orden: 5 },
    ],
  },
  {
    etapa: "Entrevista consular",
    orden_etapa: 5,
    items: [
      { tipo: "documento", nombre: "Formulario DS-160", orden: 1 },
      { tipo: "documento", nombre: "Comprobante de pago de tasa SEVIS", orden: 2 },
      { tipo: "documento", nombre: "Pago del arancel consular", orden: 3 },
    ],
  },
  {
    etapa: "Preparación previa al viaje",
    orden_etapa: 6,
    items: [
      { tipo: "documento", nombre: "Pasaje aéreo", orden: 1 },
      { tipo: "documento", nombre: "Comprobante de alojamiento", orden: 2 },
    ],
  },
];

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function getStageRequirements(etapa?: string): StageRequirements[] | StageRequirements | undefined {
  if (!etapa) return STAGE_REQUIREMENTS;
  return STAGE_REQUIREMENTS.find((s) => normalize(s.etapa) === normalize(etapa));
}
