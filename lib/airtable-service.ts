import type { EtapaNombre } from "./stage-requirements";
import type { Participant, ParticipantItem, EstadoItem } from "./mock-data";
import { normalize } from "./stage-requirements";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const API_BASE = "https://api.airtable.com/v0";

interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}

interface ParticipanteFields {
  Nombre: string;
  "Etapa Actual": EtapaNombre;
}

interface ItemFields {
  Participante: string[]; // Array of record IDs
  Tipo: "documento" | "hito_proceso";
  Nombre: string;
  Estado: EstadoItem;
  Comentarios?: string;
}

async function fetchAirtable<T>(
  table: string,
  params?: Record<string, string>,
): Promise<AirtableRecord<T>[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("Airtable credentials not configured");
    return [];
  }

  try {
    const url = new URL(`${API_BASE}/${AIRTABLE_BASE_ID}/${table}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Airtable error for table ${table}:`,
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error(`Failed to fetch from Airtable table ${table}:`, error);
    return [];
  }
}

async function getItemsByParticipantId(
  participantRecordId: string,
): Promise<ParticipantItem[]> {
  // Fetch all items and filter in memory by participant link
  const allItems = await fetchAirtable<ItemFields>("Items");

  const filtered = allItems.filter((item) => {
    const participantIds = item.fields.Participante || [];
    return participantIds.includes(participantRecordId);
  });

  return filtered.map((item) => ({
    tipo: item.fields.Tipo,
    nombre: item.fields.Nombre,
    estado: item.fields.Estado,
    comentario: item.fields.Comentarios || null,
  }));
}

export async function findParticipantByName(
  input: string,
): Promise<Participant | undefined> {
  const normalizedInput = normalize(input);

  const participants = await fetchAirtable<ParticipanteFields>("Participantes");

  const found = participants.find(
    (p) => normalize(p.fields.Nombre) === normalizedInput,
  );

  if (!found) {
    return undefined;
  }

  const items = await getItemsByParticipantId(found.id);

  return {
    id: found.id,
    nombre: found.fields.Nombre,
    etapa_actual: found.fields["Etapa Actual"],
    items,
  };
}

export async function getParticipantById(
  id: string,
): Promise<Participant | undefined> {
  const participants = await fetchAirtable<ParticipanteFields>("Participantes");

  const found = participants.find((p) => p.id === id);

  if (!found) {
    return undefined;
  }

  const items = await getItemsByParticipantId(found.id);

  return {
    id: found.id,
    nombre: found.fields.Nombre,
    etapa_actual: found.fields["Etapa Actual"],
    items,
  };
}
