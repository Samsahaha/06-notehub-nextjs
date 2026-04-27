import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

const PER_PAGE = 12;

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? "1");
  const searchValue = params.search ?? "";
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, searchValue],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: searchValue,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={searchValue} />
    </HydrationBoundary>
  );
}
