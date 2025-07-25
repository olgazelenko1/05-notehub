import axios from "axios";
import { type Note, type NewNote } from "../types/note";
import type { NoteResponse } from "../types/api";

const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});
export async function fetchNotes(
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<NoteResponse> {
  try {
    const params: Record<string, string | number> = {
      page,
      perPage,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    const { data } = await instance.get<NoteResponse>("/notes", { params });
    console.log("fetchNotes data:", data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", newNote);
  return data;
};

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await instance.delete<Note>(`/notes/${noteId}`);
  return data;
}
