import axios from "axios";
import { type Note, type NewNote, type NoteResponse } from "../types/note";

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
  perPage: number = 12
): Promise<NoteResponse> {
  const response = await instance.get<NoteResponse>("/notes", {
    params: { page, perPage },
  });
  return response.data;
}

export const createNote = async (data: NewNote): Promise<Note> => {
  const response = await instance.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
};
