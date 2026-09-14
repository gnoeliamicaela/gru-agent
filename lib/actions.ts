"use server";

import { findParticipantByName as findFromAirtable } from "./airtable-service";
import type { Participant } from "./mock-data";

export async function findParticipantAction(
  name: string,
): Promise<Participant | undefined> {
  return findFromAirtable(name);
}
