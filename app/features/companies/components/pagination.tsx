"use client";

import {
  HStack,
  ButtonGroup,
  IconButton,
  Pagination as ChakraPagination,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Calculate total count assuming 12 items per page (matching the limit in companies.tsx)
  const itemsPerPage = 12;
  const totalCount = totalPages * itemsPerPage;

  return (
    <HStack justify="center" py={4} px={6}>
      <ChakraPagination.Root
        count={totalCount}
        pageSize={itemsPerPage}
        page={currentPage}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant="outline" size="sm">
          <ChakraPagination.PrevTrigger asChild>
            <IconButton disabled={isLoading}>
              <LuChevronLeft />
            </IconButton>
          </ChakraPagination.PrevTrigger>

          <ChakraPagination.Items
            render={(page) => (
              <IconButton
                variant={{ base: "outline", _selected: "solid" }}
                disabled={isLoading}
              >
                {page.value}
              </IconButton>
            )}
          />

          <ChakraPagination.NextTrigger asChild>
            <IconButton disabled={isLoading}>
              <LuChevronRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </HStack>
  );
};
