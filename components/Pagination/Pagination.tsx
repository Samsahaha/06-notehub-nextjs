"use client";

import type { ComponentType } from "react";
import ReactPaginateModule, { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = ({ selected }: { selected: number }): void => {
    onPageChange(selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
    />
  );
}
