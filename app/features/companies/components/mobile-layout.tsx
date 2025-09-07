import { Box, Container, ScrollArea, Text, VStack } from "@chakra-ui/react";
import type { Company } from "@/types/companies";
import { CompanyCard } from "./company-card";
import { Pagination } from "./pagination";

interface MobileLayoutProps {
  companies: Company[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function MobileLayout({
  companies,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}: MobileLayoutProps) {
  if (isLoading) {
    return (
      <Container p={4} h="100%" minH={0}>
        <VStack gap={4} align="stretch">
          {/* Loading skeleton cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <Box
              key={index}
              bg="white"
              borderRadius="lg"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={4}
              h="200px"
              bgGradient="linear(to-r, gray.100, gray.200)"
            />
          ))}
        </VStack>
      </Container>
    );
  }

  if (companies.length === 0) {
    return (
      <Container p={4} h="100%" minH={0}>
        <Box
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px solid"
          borderColor="gray.200"
          p={8}
          textAlign="center"
        >
          <VStack gap={4}>
            <Text fontSize="lg" color="gray.600">
              Aucune entreprise trouvée
            </Text>
            <Text fontSize="sm" color="gray.500">
              Essayez de modifier vos critères de recherche
            </Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container p={4} h="100%" minH={0}>
      <VStack gap={4} align="stretch" h="100%">
        {/* Companies Grid */}
        <ScrollArea.Root flex="1" minH={0}>
          <ScrollArea.Viewport>
            <ScrollArea.Content>
              <VStack gap={4} align="stretch" pb={4}>
                {companies.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    position={index + 1}
                    currentPage={currentPage}
                  />
                ))}
              </VStack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </VStack>
    </Container>
  );
}
