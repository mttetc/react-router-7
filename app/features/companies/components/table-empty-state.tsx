import { Box, Text, VStack } from "@chakra-ui/react";

/**
 * Empty state component for when no companies are found
 */
export function TableEmptyState() {
  return (
    <Box
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      p={12}
      textAlign="center"
    >
      <VStack gap={4} maxW="md" mx="auto">
        <Text fontSize="6xl" mb={2}>
          🔍
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="gray.600">
          No companies found
        </Text>
        <Text fontSize="md" color="gray.500" mb={2}>
          Try adjusting your filters to see more results
        </Text>
        <VStack gap={2} fontSize="sm" color="gray.400">
          <Text>💡 Try removing some filters</Text>
          <Text>🔍 Use broader search terms</Text>
          <Text>📊 Adjust your range filters</Text>
        </VStack>
      </VStack>
    </Box>
  );
}
