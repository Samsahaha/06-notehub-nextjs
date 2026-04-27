import axios, { AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const noteHubToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const isServer = typeof window === "undefined";

const notesClient = axios.create({
  baseURL: isServer ? BASE_URL : "/api",
});

notesClient.interceptors.request.use((config) => {
  // Client-side requests go through Next.js route handlers at /api,
  // so auth header should be added only for direct server-to-API calls.
  if (isServer && noteHubToken) {
    config.headers.Authorization = `Bearer ${noteHubToken}`;
  }

  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
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

const ensureToken = (): void => {
  if (!noteHubToken) {
    throw new Error(
      "Missing NEXT_PUBLIC_NOTEHUB_TOKEN in environment variables",
    );
  }
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  ensureToken();

  const params: { page: number; perPage: number; search?: string } = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const response: AxiosResponse<FetchNotesResponse> = await notesClient.get(
    "/notes",
    {
      params,
    },
  );

  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  ensureToken();

  const response: AxiosResponse<Note> = await notesClient.post(
    "/notes",
    payload,
  );
  return response.data;
};

export const deleteNote = async (
  noteId: string,
): Promise<DeleteNoteResponse> => {
  ensureToken();

  const response: AxiosResponse<DeleteNoteResponse> = await notesClient.delete(
    `/notes/${noteId}`,
  );

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  ensureToken();

  const response: AxiosResponse<Note> = await notesClient.get(
    `/notes/${noteId}`,
  );
  return response.data;
};
