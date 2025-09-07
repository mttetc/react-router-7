import {
  Badge,
  Box,
  Breadcrumb,
  Container,
  Flex,
  HStack,
  Image,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { Tooltip } from "@/components/ui/tooltip";
import { FilterToggleButton } from "./filter-toggle-button";

interface HeaderProps {
  onFilterToggle?: () => void;
  activeFiltersCount?: number;
  isFilterOpen?: boolean;
}

export const Header = ({
  onFilterToggle,
  activeFiltersCount = 0,
  isFilterOpen = false,
}: HeaderProps) => {
  const [isMobile] = useMediaQuery(["(max-width: 768px)"], { ssr: false });
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
          <HStack gap={2} align="center">
            <Image
              src="https://www.tryspecter.com/specter.svg"
              alt="Specter"
              height="24px"
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
              {!isMobile && (
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
              )}
            </HStack>
          </HStack>

          <HStack gap={3}>
            {/* Desktop: Breadcrumb + Currency */}
            {!isMobile && (
              <>
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

                <HStack gap={2}>
                  <Tooltip
                    content="Select currency for funding amounts"
                    positioning={{ placement: "bottom" }}
                  >
                    <CurrencySelector />
                  </Tooltip>
                </HStack>
              </>
            )}

            {/* Mobile: Filter button + Currency */}
            {isMobile && (
              <HStack gap={2}>
                {onFilterToggle && (
                  <FilterToggleButton
                    onClick={onFilterToggle}
                    activeFiltersCount={activeFiltersCount}
                    isOpen={isFilterOpen}
                  />
                )}
                <Tooltip
                  content="Select currency for funding amounts"
                  positioning={{ placement: "bottom" }}
                >
                  <CurrencySelector />
                </Tooltip>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
