import type { Note } from "./note";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}
