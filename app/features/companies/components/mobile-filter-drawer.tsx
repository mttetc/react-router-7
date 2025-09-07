import {
  Box,
  Button,
  Drawer,
  HStack,
  Presence,
  ScrollArea,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { FilterForm } from "../forms/filter-form";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFiltersCount: number;
  onClearAllFilters?: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  activeFiltersCount,
  onClearAllFilters,
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
              <HStack gap={2} align="center">
                <MdFilterList size={20} />
                <Text fontSize="lg" fontWeight="semibold">
                  Filters
                  {activeFiltersCount > 0 && (
                    <Text
                      as="span"
                      colorPalette="brand"
                      color="brand.500"
                      ml={2}
                    >
                      ({activeFiltersCount})
                    </Text>
                  )}
                </Text>
              </HStack>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close filters"
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
            <HStack gap={2} width="100%">
              <Presence
                present={onClearAllFilters && activeFiltersCount > 0}
                animationName={{
                  _open: "fade-in",
                  _closed: "fade-out",
                }}
                animationDuration="moderate"
              >
                <Button
                  variant="outline"
                  colorPalette="gray"
                  onClick={onClearAllFilters}
                  disabled={isApplying}
                  flex="1"
                >
                  <FaUndo style={{ width: "14px" }} />
                  Clear
                </Button>
              </Presence>

              <Button
                variant="outline"
                flex="1"
                onClick={onClose}
                disabled={isApplying}
              >
                Cancel
              </Button>

              <Button
                colorPalette="purple"
                flex="1"
                onClick={handleApplyFilters}
                loading={isApplying}
                loadingText="Applying..."
              >
                {activeFiltersCount > 0 ? "Apply" : "Apply Filters"}
              </Button>
            </HStack>
          </Box>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
