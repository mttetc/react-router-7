import {
  Box,
  Button,
  Drawer,
  HStack,
  ScrollArea,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FilterForm } from "../forms/filter-form";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  activeFiltersCount,
}: MobileFilterDrawerProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyFilters = async () => {
    setIsApplying(true);
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsApplying(false);
    onClose();
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      placement="bottom"
      size="full"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content
          bg="white"
          borderTopRadius="xl"
          maxH="90vh"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="white"
            borderTopRadius="xl"
          >
            <HStack justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">
                Filtres
                {activeFiltersCount > 0 && (
                  <Text as="span" color="blue.500" ml={2}>
                    ({activeFiltersCount})
                  </Text>
                )}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Fermer les filtres"
              >
                ✕
              </Button>
            </HStack>
          </Box>

          {/* Content */}
          <ScrollArea.Root flex="1" minH={0}>
            <ScrollArea.Viewport>
              <ScrollArea.Content p={4}>
                <FilterForm isInDrawer={true} />
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar />
          </ScrollArea.Root>

          {/* Footer */}
          <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
            <HStack gap={3}>
              <Button
                variant="outline"
                flex="1"
                onClick={onClose}
                disabled={isApplying}
              >
                Annuler
              </Button>
              <Button
                colorPalette="blue"
                flex="1"
                onClick={handleApplyFilters}
                loading={isApplying}
                loadingText="Application..."
              >
                Appliquer les filtres
              </Button>
            </HStack>
          </Box>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
