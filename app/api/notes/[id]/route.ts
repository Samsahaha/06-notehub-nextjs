import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://notehub-public.goit.study/api";
const noteHubToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const notesServerClient = axios.create({
  baseURL: BASE_URL,
});

notesServerClient.interceptors.request.use((config) => {
  if (noteHubToken) {
    config.headers.Authorization = `Bearer ${noteHubToken}`;
  }

  return config;
});

const ensureToken = (): void => {
  if (!noteHubToken) {
    throw new Error("Missing NEXT_PUBLIC_NOTEHUB_TOKEN in environment variables");
  }
};

interface NoteByIdRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: NoteByIdRouteContext,
) {
  try {
    ensureToken();

    const { id } = await context.params;
    const response = await notesServerClient.get(`/notes/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: NoteByIdRouteContext,
) {
  try {
    ensureToken();

    const { id } = await context.params;
    const response = await notesServerClient.delete(`/notes/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
