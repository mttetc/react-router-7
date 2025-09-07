import {
  Badge,
  Box,
  Breadcrumb,
  Button,
  Container,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { MdGridOn, MdList } from "react-icons/md";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { Tooltip } from "@/components/ui/tooltip";
import { FilterToggleButton } from "./filter-toggle-button";

interface HeaderProps {
  onFilterToggle?: () => void;
  activeFiltersCount?: number;
  isFilterOpen?: boolean;
  onLayoutToggle?: () => void;
  isSqueezedLayout?: boolean;
}

export const Header = ({
  onFilterToggle,
  activeFiltersCount = 0,
  isFilterOpen = false,
  onLayoutToggle,
  isSqueezedLayout = false,
}: HeaderProps) => {
  return (
    <Box
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="sticky"
      shadow="sm"
      role="banner"
    >
      <Container maxW="8xl" py={3}>
        <Flex align="center" justify="space-between">
          <HStack
            gap={{
              base: 1,
              md: 2,
            }}
            align="center"
          >
            <Image
              src="https://www.tryspecter.com/specter.svg"
              alt="Specter"
              height={{
                base: "16px",
                md: "24px",
              }}
              width="auto"
              filter="none"
            />
            <HStack gap={3} align="baseline">
              <Text
                fontSize="sm"
                color="brand.500"
                fontWeight="normal"
                fontStyle="italic"
              >
                lite
              </Text>
              <Box hideBelow="md">
                <Tooltip
                  content="Over 5,000 companies in database"
                  positioning={{ placement: "bottom" }}
                >
                  <Badge
                    colorPalette="purple"
                    borderRadius="full"
                    size="sm"
                    variant="surface"
                  >
                    5K+ Companies
                  </Badge>
                </Tooltip>
              </Box>
            </HStack>
          </HStack>

          <HStack gap={2}>
            {/* Desktop: Breadcrumb + Currency */}
            <Box hideBelow="md">
              <Breadcrumb.Root fontSize="xs" color="gray.500">
                <Breadcrumb.List>
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Separator />
                  <Breadcrumb.Item>
                    <Breadcrumb.CurrentLink>Companies</Breadcrumb.CurrentLink>
                  </Breadcrumb.Item>
                </Breadcrumb.List>
              </Breadcrumb.Root>
            </Box>

            <HStack gap={2}>
              <Tooltip
                content="Select currency for funding amounts"
                positioning={{ placement: "bottom" }}
              >
                <CurrencySelector />
              </Tooltip>
            </HStack>

            {/* Mobile: Layout toggle and Filter button */}
            <Box hideFrom="md">
              <HStack gap={2}>
                {onLayoutToggle && (
                  <Tooltip
                    content={
                      isSqueezedLayout
                        ? "Switch to full cards"
                        : "Switch to compact cards"
                    }
                    positioning={{ placement: "bottom" }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onLayoutToggle}
                      aria-label={
                        isSqueezedLayout
                          ? "Switch to full cards"
                          : "Switch to compact cards"
                      }
                    >
                      {isSqueezedLayout ? <MdList /> : <MdGridOn />}
                    </Button>
                  </Tooltip>
                )}
                {onFilterToggle && (
                  <FilterToggleButton
                    onClick={onFilterToggle}
                    activeFiltersCount={activeFiltersCount}
                    isOpen={isFilterOpen}
                  />
                )}
              </HStack>
            </Box>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
