"use server";

import {
  findParticipantByName as findFromAirtable,
  findParticipantByFullName,
  findParticipantsByFirstName,
} from "./airtable-service";
import type { Participant } from "./mock-data";

interface IdentificationResult {
  status: "identified" | "ambiguous" | "not_found";
  participant?: Participant;
  candidates?: Participant[];
}

export async function findParticipantAction(
  name: string,
): Promise<Participant | undefined> {
  return findFromAirtable(name);
}

export async function identifyParticipantWithLastName(
  nombre: string,
  apellido: string | null,
): Promise<IdentificationResult> {
  const hasApellido = apellido && apellido.trim().length > 0;

  if (hasApellido) {
    // User provided both name and last name: strict match, no fallback
    const exactMatch = await findParticipantByFullName(nombre, apellido!);
    if (exactMatch) {
      return { status: "identified", participant: exactMatch };
    }
    // No match with provided last name = real failure, not a fallback case
    return { status: "not_found" };
  } else {
    // User provided only first name: allow fallback to first-name-only search
    const candidates = await findParticipantsByFirstName(nombre);

    if (candidates.length === 0) {
      return { status: "not_found" };
    }

    if (candidates.length === 1) {
      // Only one match by first name, identify directly
      return { status: "identified", participant: candidates[0] };
    }

    // Multiple matches by first name, ambiguous
    return { status: "ambiguous", candidates };
  }
}
