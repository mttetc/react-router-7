"use client";

import {
  HStack,
  ButtonGroup,
  IconButton,
  Pagination as ChakraPagination,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useRef } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

// Custom pagination button using React Aria
const PaginationButton = ({
  children,
  onPress,
  isDisabled = false,
  isSelected = false,
  ariaLabel,
  ...props
}: {
  children: React.ReactNode;
  onPress: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  ariaLabel: string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton(
    {
      onPress,
      isDisabled,
      "aria-label": ariaLabel,
      "aria-current": isSelected ? "page" : undefined,
    },
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <IconButton
      ref={ref}
      {...buttonProps}
      {...focusProps}
      {...props}
      variant={isSelected ? "solid" : "outline"}
      disabled={isDisabled}
      _focus={{
        outline: isFocusVisible
          ? "2px solid var(--chakra-colors-purple-500)"
          : "none",
        outlineOffset: "2px",
      }}
      _active={{ bg: isPressed ? "purple.200" : undefined }}
      aria-current={isSelected ? "page" : undefined}
    >
      {children}
    </IconButton>
  );
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) => {
  // Always show pagination when there's data, even if only 1 page during loading
  if (totalPages <= 1 && !isLoading) return null;

  // Calculate total count assuming 12 items per page (matching the limit in companies.tsx)
  const itemsPerPage = 12;
  // Use fake count when loading to show pagination skeleton
  const totalCount = isLoading ? itemsPerPage * 5 : totalPages * itemsPerPage;

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
              ariaLabel={`Go to previous page${
                currentPage > 1 ? ` (page ${currentPage - 1})` : ""
              }`}
            >
              <LuChevronLeft />
            </PaginationButton>
          </ChakraPagination.PrevTrigger>

          <ChakraPagination.Items
            render={(page) => (
              <PaginationButton
                onPress={() => onPageChange(page.value)}
                isDisabled={isLoading}
                isSelected={page.value === currentPage}
                ariaLabel={`Go to page ${page.value}`}
              >
                {page.value}
              </PaginationButton>
            )}
          />

          <ChakraPagination.NextTrigger asChild>
            <PaginationButton
              onPress={() => onPageChange(currentPage + 1)}
              isDisabled={isLoading || currentPage >= totalPages}
              ariaLabel={`Go to next page${
                currentPage < totalPages ? ` (page ${currentPage + 1})` : ""
              }`}
            >
              <LuChevronRight />
            </PaginationButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </HStack>
  );
};
