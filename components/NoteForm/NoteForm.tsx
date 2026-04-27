"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { createNote, CreateNotePayload } from "@/lib/api";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: CreateNotePayload["tag"];
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  const handleSubmit = async (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>,
  ): Promise<void> => {
    try {
      await createNoteMutation.mutateAsync(values);
      helpers.resetForm();
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createNoteMutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
