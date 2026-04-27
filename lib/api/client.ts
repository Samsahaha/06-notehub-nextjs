import axios from "axios";

const BASE_URL = "https://notehub-public.goit.study/api";
const noteHubToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const isServer = typeof window === "undefined";

export const notesClient = axios.create({
  baseURL: isServer ? BASE_URL : "/api",
});

notesClient.interceptors.request.use((config) => {
  if (isServer && noteHubToken) {
    config.headers.Authorization = `Bearer ${noteHubToken}`;
  }

  return config;
});

export const ensureToken = (): void => {
  if (!noteHubToken) {
    throw new Error("Missing NEXT_PUBLIC_NOTEHUB_TOKEN in environment variables");
  }
};
