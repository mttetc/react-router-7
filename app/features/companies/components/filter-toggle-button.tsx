import { Badge, Button, HStack, Text } from "@chakra-ui/react";

interface FilterToggleButtonProps {
  onClick: () => void;
  activeFiltersCount: number;
  isOpen?: boolean;
}

export function FilterToggleButton({
  onClick,
  activeFiltersCount,
  isOpen = false,
}: FilterToggleButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-label={`Ouvrir les filtres${
        activeFiltersCount > 0 ? ` (${activeFiltersCount} actifs)` : ""
      }`}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      position="relative"
      minW="auto"
      px={3}
    >
      <HStack gap={2} align="center">
        <Text fontSize="sm">Filtres</Text>

        {activeFiltersCount > 0 && (
          <Badge
            colorPalette="blue"
            variant="solid"
            size="sm"
            borderRadius="full"
            minW="20px"
            height="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="semibold"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </HStack>
    </Button>
  );
}
