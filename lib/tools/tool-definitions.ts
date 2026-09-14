import type Anthropic from "@anthropic-ai/sdk";

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "get_participant_status",
    description:
      "Devuelve el estado actual del participante: etapa actual y la lista de items " +
      "(documentos e hitos) con su estado y motivo de rechazo si corresponde. " +
      "Llamar siempre antes de responder cualquier pregunta sobre el estado o avance del participante; " +
      "nunca asumir o inventar el estado.",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: "get_stage_requirements",
    description:
      "Devuelve la lista completa y ordenada de documentos/hitos que corresponden a una etapa del proceso, " +
      "independientemente del avance real del participante. Si no se pasa 'etapa', devuelve el catálogo " +
      "completo de las 6 etapas en orden (útil para saber qué etapa sigue después de la actual). " +
      "Llamar cuando se necesite el conjunto completo o el orden de una etapa; nunca asumirlo de memoria.",
    input_schema: {
      type: "object",
      properties: {
        etapa: {
          type: "string",
          description: "Nombre exacto de la etapa. Omitir para traer el catálogo completo.",
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: "get_faq",
    description:
      "Devuelve el instructivo de un documento o hito puntual: para qué sirve, qué implica completarlo, " +
      "y dudas comunes. Llamar siempre que haya que explicar cómo hacer o corregir algo, en vez de inventar instrucciones.",
    input_schema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "Nombre del documento o hito, ej: 'Certificado de alumno regular', 'Formulario DS-2019'.",
        },
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    name: "escalate_to_staff",
    description:
      "Crea una previsualización de mail simulado y lo registra para escalar a un asesor humano. " +
      "Usar cuando el participante quiere ser contactado por insatisfacción con la respuesta, " +
      "o cuando la consulta requiere intervención humana. El mail simulado aparecerá en el chat.",
    input_schema: {
      type: "object",
      properties: {
        motivo: {
          type: "string",
          description:
            "El motivo de la consulta/insatisfacción, en palabras del participante. " +
            "Esto irá destacado en el cuerpo del mail.",
        },
      },
      required: ["motivo"],
      additionalProperties: false,
    },
  },
];
