import {
  Box,
  Button,
  Drawer,
  HStack,
  IconButton,
  Presence,
  ScrollArea,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { MobileFilterForm } from "../forms/mobile/mobile-filter-form";
import { useQueryStates } from "nuqs";
import { filtersSearchParams } from "@/lib/search-params";
import type { FilterState } from "../types/schemas";

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
  const [pendingFilters, setPendingFilters] = useState<Partial<FilterState>>(
    {}
  );

  // Get all filter setters
  const [, setFilters] = useQueryStates({
    search: filtersSearchParams.search,
    growthStage: filtersSearchParams.growthStage,
    customerFocus: filtersSearchParams.customerFocus,
    fundingType: filtersSearchParams.fundingType,
    minRank: filtersSearchParams.minRank,
    maxRank: filtersSearchParams.maxRank,
    minFunding: filtersSearchParams.minFunding,
    maxFunding: filtersSearchParams.maxFunding,
    sortBy: filtersSearchParams.sortBy,
    sortOrder: filtersSearchParams.sortOrder,
    page: filtersSearchParams.page,
    limit: filtersSearchParams.limit,
  });

  const handleFiltersChange = (filters: Partial<FilterState>) => {
    setPendingFilters(filters);
  };

  const handleApplyFilters = async () => {
    setIsApplying(true);

    try {
      // Apply all pending filters at once
      await setFilters(pendingFilters);

      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      setIsApplying(false);
      onClose();
    }
  };

  const handleClearAllFilters = async () => {
    const clearedFilters = {
      search: "",
      growthStage: "",
      customerFocus: "",
      fundingType: "",
      minRank: null,
      maxRank: null,
      minFunding: null,
      maxFunding: null,
      sortBy: "rank",
      sortOrder: "asc",
      page: 1,
    };

    // Clear pending filters first
    setPendingFilters({});

    // Apply cleared filters directly
    setIsApplying(true);
    try {
      await setFilters(clearedFilters);
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      setIsApplying(false);
      onClose();
    }
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
                      colorPalette="palette"
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
                <MobileFilterForm
                  onFiltersChange={handleFiltersChange}
                  pendingFilters={pendingFilters}
                />
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar />
          </ScrollArea.Root>

          {/* Footer */}
          <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
            <HStack gap={2} width="100%">
              <Presence
                present={activeFiltersCount > 0}
                animationName={{
                  _open: "fade-in",
                  _closed: "fade-out",
                }}
                animationDuration="moderate"
              >
                <IconButton
                  variant="outline"
                  colorPalette="gray"
                  onClick={handleClearAllFilters}
                  disabled={isApplying}
                  flex="1"
                >
                  <FaUndo style={{ width: "14px" }} />
                </IconButton>
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
