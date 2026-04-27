import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import type { NoteTag } from "@/types/note";

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

export async function GET(request: NextRequest) {
  try {
    ensureToken();

    const page = request.nextUrl.searchParams.get("page") ?? "1";
    const perPage = request.nextUrl.searchParams.get("perPage") ?? "12";
    const search = request.nextUrl.searchParams.get("search") ?? "";
    const tag = request.nextUrl.searchParams.get("tag") ?? "";

    const params: {
      page: number;
      perPage: number;
      search?: string;
      tag?: NoteTag;
    } = {
      page: Number(page),
      perPage: Number(perPage),
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (tag.trim()) {
      params.tag = tag.trim() as NoteTag;
    }

    const response = await notesServerClient.get("/notes", { params });
    return NextResponse.json(response.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureToken();

    const body = await request.json();
    const response = await notesServerClient.post("/notes", body);

    return NextResponse.json(response.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
