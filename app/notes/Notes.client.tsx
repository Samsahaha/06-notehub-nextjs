"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
}

const PER_PAGE = 12;

export default function NotesClient({
  initialPage,
  initialSearch,
}: NotesClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [searchValue, setSearchValue] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const nextSearch = value.trim();
    setSearchValue(nextSearch);
    setCurrentPage(1);
    router.replace(nextSearch ? `/notes?search=${nextSearch}` : "/notes");
  }, 400);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["notes", currentPage, searchValue],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: searchValue,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue = event.target.value;
    setSearchInput(nextValue);
    debouncedSearch(nextValue);
  };

  const handlePageChange = (selectedPage: number): void => {
    setCurrentPage(selectedPage);
    const searchQuery = searchValue ? `&search=${searchValue}` : "";
    router.replace(`/notes?page=${selectedPage}${searchQuery}`);
  };

  const headerStatusText = useMemo(() => {
    if (isFetching && !isLoading) {
      return "Updating notes...";
    }

    return null;
  }, [isFetching, isLoading]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={effectiveCurrentPage}
            onPageChange={handlePageChange}
          />
        )}
        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {headerStatusText && <p>{headerStatusText}</p>}
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              setCurrentPage(1);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
