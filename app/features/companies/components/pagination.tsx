"use client";

import {
  HStack,
  ButtonGroup,
  Pagination as ChakraPagination,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
  calculateTotalCount,
  generateMobilePaginationPages,
  shouldShowPagination,
  generatePaginationAriaLabel,
} from "../utils/pagination-utils";
import { PaginationButton } from "./pagination-button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  isMobile = false,
}: PaginationProps) => {
  // Always show pagination when there's data, even if only 1 page during loading
  if (!shouldShowPagination(totalPages, isLoading)) return null;

  // Calculate total count assuming 12 items per page (matching the limit in companies.tsx)
  const itemsPerPage = 12;
  // Use fake count when loading to show pagination skeleton
  const totalCount = isLoading
    ? itemsPerPage * 5
    : calculateTotalCount(totalPages, itemsPerPage);

  // Mobile pagination logic: show 1, 2, ..., last page
  const renderMobilePagination = (): React.ReactNode[] => {
    const pageNumbers = generateMobilePaginationPages(totalPages);
    const pages: React.ReactNode[] = [];

    pageNumbers.forEach((pageNumber, index) => {
      // Add ellipsis before the last page if we have more than 2 pages
      if (index === pageNumbers.length - 1 && totalPages > 2) {
        pages.push(
          <Text key="ellipsis" color="gray.500" px={2}>
            ...
          </Text>
        );
      }

      pages.push(
        <PaginationButton
          key={pageNumber}
          onPress={() => onPageChange(pageNumber)}
          isDisabled={isLoading}
          isSelected={currentPage === pageNumber}
          ariaLabel={generatePaginationAriaLabel("page", pageNumber)}
        >
          {pageNumber}
        </PaginationButton>
      );
    });

    return pages;
  };

  return (
    <HStack
      justify="center"
      py={2}
      px={6}
      role="navigation"
      aria-label="Pagination"
    >
      <ChakraPagination.Root
        count={totalCount}
        pageSize={itemsPerPage}
        page={currentPage}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup
          variant="outline"
          size="sm"
          colorPalette={isLoading ? "gray" : "purple"}
        >
          <ChakraPagination.PrevTrigger asChild>
            <PaginationButton
              onPress={() => onPageChange(currentPage - 1)}
              isDisabled={isLoading || currentPage <= 1}
              ariaLabel={generatePaginationAriaLabel(
                "previous",
                undefined,
                currentPage
              )}
            >
              <LuChevronLeft />
            </PaginationButton>
          </ChakraPagination.PrevTrigger>

          {isMobile ? (
            renderMobilePagination()
          ) : (
            <ChakraPagination.Items
              render={(page) => (
                <PaginationButton
                  onPress={() => onPageChange(page.value)}
                  isDisabled={isLoading}
                  isSelected={page.value === currentPage}
                  ariaLabel={generatePaginationAriaLabel("page", page.value)}
                >
                  {page.value}
                </PaginationButton>
              )}
            />
          )}

          <ChakraPagination.NextTrigger asChild>
            <PaginationButton
              onPress={() => onPageChange(currentPage + 1)}
              isDisabled={isLoading || currentPage >= totalPages}
              ariaLabel={generatePaginationAriaLabel(
                "next",
                totalPages,
                currentPage
              )}
            >
              <LuChevronRight />
            </PaginationButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </HStack>
  );
};
