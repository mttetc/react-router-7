import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  Badge,
  NumberInput,
  Stack,
  Portal,
  Menu,
  Separator,
  Field,
  For,
} from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { useColorModeValue } from "../../../components/ui/color-mode";
import { FaSearch, FaCog, FaInfoCircle, FaChevronDown } from "react-icons/fa";
import {
  FaSeedling,
  FaTree,
  FaBuilding,
  FaRocket,
  FaUsers,
  FaUser,
  FaExchangeAlt,
  FaAngellist,
  FaFileAlt,
  FaEyeSlash,
} from "react-icons/fa";
import type { FilterState } from "../../../services/companies.service";

// Custom Select component that mimics the compound structure you wanted
interface SelectItem {
  value: string;
  label: string;
  icon: string;
}

interface SelectRootProps {
  items: SelectItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

// Mimic Select.Root component
const SelectRoot = ({
  items,
  value,
  onValueChange,
  placeholder,
  size = "sm",
}: SelectRootProps) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const selectedItem = items.find((item) => item.value === value);

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="outline"
          size={size}
          textAlign="left"
          fontWeight="normal"
          borderColor={borderColor}
          _hover={{ borderColor: "blue.400" }}
          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
          w="full"
          justifyContent="space-between"
        >
          <HStack gap={2}>
            {selectedItem && <Text>{selectedItem.icon}</Text>}
            <Text color={selectedItem ? "inherit" : "gray.500"}>
              {selectedItem?.label || placeholder}
            </Text>
          </HStack>
          <FaChevronDown />
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content maxH="200px" overflowY="auto">
            <Menu.Item value="" onClick={() => onValueChange("")}>
              <Text color="gray.500">{placeholder}</Text>
            </Menu.Item>
            <For each={items}>
              {(item) => (
                <Menu.Item
                  key={item.value}
                  value={item.value}
                  onClick={() => onValueChange(item.value)}
                  bg={value === item.value ? "blue.50" : "transparent"}
                  _hover={{ bg: "blue.50" }}
                >
                  <HStack gap={2}>
                    <Text>{item.icon}</Text>
                    <Text>{item.label}</Text>
                  </HStack>
                </Menu.Item>
              )}
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

// Data collections
const growthStageItems: SelectItem[] = [
  { value: "early", label: "Early", icon: "🌱" },
  { value: "seed", label: "Seed", icon: "🌿" },
  { value: "growing", label: "Growing", icon: "🌳" },
  { value: "late", label: "Late", icon: "🏢" },
  { value: "exit", label: "Exit", icon: "🚀" },
];

const customerFocusItems: SelectItem[] = [
  { value: "b2b", label: "B2B", icon: "🏢" },
  { value: "b2c", label: "B2C", icon: "👥" },
  { value: "b2b_b2c", label: "B2B & B2C", icon: "🔄" },
  { value: "b2c_b2b", label: "B2C & B2B", icon: "🔄" },
];

const fundingTypeItems: SelectItem[] = [
  { value: "Seed", label: "Seed", icon: "🌱" },
  { value: "Series A", label: "Series A", icon: "🅰️" },
  { value: "Series B", label: "Series B", icon: "🅱️" },
  { value: "Series C", label: "Series C", icon: "©️" },
  { value: "Angel", label: "Angel", icon: "👼" },
  { value: "Convertible Note", label: "Convertible Note", icon: "📝" },
  { value: "Undisclosed", label: "Undisclosed", icon: "🤐" },
];

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
}: FilterSidebarProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Card.Root
      bg={bgColor}
      borderColor={borderColor}
      h="fit-content"
      position="sticky"
      top="80px"
      shadow="lg"
    >
      <Card.Header pb={2}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <Badge
              colorPalette="blue"
              borderRadius="full"
              px={2}
              title={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </Badge>
          )}
        </HStack>
        {activeFilterCount > 0 && (
          <Tooltip
            content="Clear all active filters and reset to default view"
            positioning={{ placement: "top" }}
          >
            <Button
              size="sm"
              variant="outline"
              colorPalette="red"
              onClick={onReset}
              w="full"
              mt={3}
            >
              Reset All Filters
            </Button>
          </Tooltip>
        )}
      </Card.Header>

      <Card.Body pt={2}>
        <Stack gap={6}>
          {/* Search */}
          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="semibold" color="gray.600">
              <HStack gap={2}>
                <FaSearch />
                <Text>Smart Search</Text>
              </HStack>
            </Field.Label>
            <Input
              placeholder="Search companies, domains, descriptions..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              borderRadius="md"
              size="md"
            />
          </Field.Root>

          <Separator />

          {/* Categories */}
          <Box>
            <HStack gap={2} mb={4}>
              <FaCog />
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                Categories
              </Text>
            </HStack>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Growth Stage
                </Field.Label>
                <SelectRoot
                  items={growthStageItems}
                  value={filters.growthStage || ""}
                  onValueChange={(value) =>
                    onFilterChange({ growthStage: value })
                  }
                  placeholder="All stages"
                  size="sm"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Customer Focus
                </Field.Label>
                <SelectRoot
                  items={customerFocusItems}
                  value={filters.customerFocus || ""}
                  onValueChange={(value) =>
                    onFilterChange({ customerFocus: value })
                  }
                  placeholder="All customer types"
                  size="sm"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Funding Type
                </Field.Label>
                <SelectRoot
                  items={fundingTypeItems}
                  value={filters.fundingType || ""}
                  onValueChange={(value) =>
                    onFilterChange({ fundingType: value })
                  }
                  placeholder="All funding types"
                  size="sm"
                />
              </Field.Root>
            </Stack>
          </Box>

          <Separator />

          {/* Ranges */}
          <Box>
            <HStack gap={2} mb={4}>
              <FaInfoCircle />
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                Ranges
              </Text>
            </HStack>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Rank Range
                </Field.Label>
                <HStack>
                  <NumberInput.Root
                    size="sm"
                    value={filters.minRank?.toString() || ""}
                    onValueChange={(details) =>
                      onFilterChange({ minRank: details.valueAsNumber || null })
                    }
                    min={1}
                  >
                    <NumberInput.ValueText />
                    <NumberInput.Control>
                      <NumberInput.IncrementTrigger />
                      <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                  </NumberInput.Root>
                  <Text fontSize="xs" color="gray.400">
                    to
                  </Text>
                  <NumberInput.Root
                    size="sm"
                    value={filters.maxRank?.toString() || ""}
                    onValueChange={(details) =>
                      onFilterChange({ maxRank: details.valueAsNumber || null })
                    }
                    min={1}
                  >
                    <NumberInput.ValueText />
                    <NumberInput.Control>
                      <NumberInput.IncrementTrigger />
                      <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                  </NumberInput.Root>
                </HStack>
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  💰 Funding Amount (USD)
                </Field.Label>
                <HStack>
                  <NumberInput.Root
                    size="sm"
                    value={filters.minFunding?.toString() || ""}
                    onValueChange={(details) =>
                      onFilterChange({
                        minFunding: details.valueAsNumber || null,
                      })
                    }
                    min={0}
                  >
                    <NumberInput.ValueText />
                    <NumberInput.Control>
                      <NumberInput.IncrementTrigger />
                      <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                  </NumberInput.Root>
                  <Text fontSize="xs" color="gray.400">
                    to
                  </Text>
                  <NumberInput.Root
                    size="sm"
                    value={filters.maxFunding?.toString() || ""}
                    onValueChange={(details) =>
                      onFilterChange({
                        maxFunding: details.valueAsNumber || null,
                      })
                    }
                    min={0}
                  >
                    <NumberInput.ValueText />
                    <NumberInput.Control>
                      <NumberInput.IncrementTrigger />
                      <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                  </NumberInput.Root>
                </HStack>
              </Field.Root>
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
