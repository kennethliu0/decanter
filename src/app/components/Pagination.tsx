"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadPagination,
} from "@/components/ui/pagination";

const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

type Props = {
  totalPages: number;
} & React.ComponentProps<typeof ShadPagination>;

export default function Pagination({ totalPages, ...props }: Props) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  };

  return (
    <ShadPagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage <= 1 ? "#" : createPageURL(currentPage - 1)}
          />
        </PaginationItem>

        {allPages.map((page, index) => {
          return (
            <PaginationItem key={index}>
              {page === "..." ?
                <PaginationEllipsis />
              : <PaginationLink
                  href={createPageURL(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              }
            </PaginationItem>
          );
        })}

        <PaginationNext
          href={
            currentPage >= totalPages ? "#" : createPageURL(currentPage + 1)
          }
        />
      </PaginationContent>
    </ShadPagination>
  );
}
