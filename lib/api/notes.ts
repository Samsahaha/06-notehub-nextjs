import type { AxiosResponse } from "axios";
import { ensureToken, notesClient } from "./client";
import type { Note, NoteTag } from "@/types/note";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  note: Note;
  message: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  ensureToken();

  const params: { page: number; perPage: number; search?: string; tag?: NoteTag } = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const response: AxiosResponse<FetchNotesResponse> = await notesClient.get("/notes", {
    params,
  });

  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  ensureToken();

  const response: AxiosResponse<Note> = await notesClient.post("/notes", payload);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<DeleteNoteResponse> => {
  ensureToken();

  const response: AxiosResponse<DeleteNoteResponse> = await notesClient.delete(
    `/notes/${noteId}`,
  );

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  ensureToken();

  const response: AxiosResponse<Note> = await notesClient.get(`/notes/${noteId}`);
  return response.data;
};
