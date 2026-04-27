import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import FilterNotesClient from "./FilterNotes.client";
import { fetchNotes } from "@/lib/api";
import { NOTE_TAGS, NoteTag } from "@/types/note";

interface FilterNotesPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

const PER_PAGE = 12;

const resolveTag = (slug?: string[]): NoteTag | undefined => {
  const rawTag = slug?.[0];

  if (!rawTag || rawTag === "all") {
    return undefined;
  }

  if (NOTE_TAGS.includes(rawTag as NoteTag)) {
    return rawTag as NoteTag;
  }

  notFound();
};

export default async function FilterNotesPage({
  params,
  searchParams,
}: FilterNotesPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const currentPage = Number(queryParams.page ?? "1");
  const searchValue = queryParams.search ?? "";
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const tag = resolveTag(routeParams.slug);
  const tagSlug = tag ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, searchValue, tagSlug],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: searchValue,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilterNotesClient initialPage={page} initialSearch={searchValue} tag={tag} />
    </HydrationBoundary>
  );
}
