import { HStack, Text, Pagination as ChakraPagination } from "@chakra-ui/react";

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

  // Calculate total count assuming 10 items per page
  const itemsPerPage = 10;
  const totalCount = totalPages * itemsPerPage;

  return (
    <HStack
      justify="center"
      py={4}
      px={6}
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
    >
      <ChakraPagination.Root
        count={totalCount}
        pageSize={itemsPerPage}
        page={currentPage}
        onPageChange={(details: any) => onPageChange(details.page)}
      >
        <ChakraPagination.PrevTrigger disabled={isLoading} />
        <ChakraPagination.Items
          render={(page) => (
            <ChakraPagination.Item {...page} disabled={isLoading}>
              {page.value}
            </ChakraPagination.Item>
          )}
        />
        <ChakraPagination.NextTrigger disabled={isLoading} />
      </ChakraPagination.Root>

      <Text fontSize="xs" color="gray.500" ml={3}>
        {totalPages > 1
          ? `${currentPage} of ${totalPages}`
          : `Page ${currentPage}`}
      </Text>
    </HStack>
  );
};
