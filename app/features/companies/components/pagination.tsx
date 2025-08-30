import {
  HStack,
  Button,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <HStack
      spacing={2}
      justify="center"
      py={4}
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      borderRadius="md"
    >
      <IconButton
        aria-label="Previous page"
        icon={<ChevronLeftIcon />}
        size="sm"
        variant="ghost"
        isDisabled={currentPage === 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {getVisiblePages().map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? "solid" : "ghost"}
          colorScheme={page === currentPage ? "blue" : "gray"}
          isDisabled={isLoading}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <IconButton
        aria-label="Next page"
        icon={<ChevronRightIcon />}
        size="sm"
        variant="ghost"
        isDisabled={currentPage === totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
      />

      <Text fontSize="sm" color="gray.500" ml={4}>
        Page {currentPage} of {totalPages}
      </Text>
    </HStack>
  );
};
