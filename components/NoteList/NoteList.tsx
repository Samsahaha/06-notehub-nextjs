"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const noteId = event.currentTarget.dataset.noteid;

    if (noteId) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>
            <button
              className={css.button}
              type="button"
              data-noteid={note.id}
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
