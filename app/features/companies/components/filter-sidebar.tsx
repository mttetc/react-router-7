import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  useColorModeValue,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Stack,
  ButtonGroup,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import type { FilterState } from "../../../services/companies.service";

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
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      h="fit-content"
      position="sticky"
      top="80px"
      shadow="lg"
    >
      <CardHeader pb={2}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <Tooltip label={`${activeFilterCount} active filters`} hasArrow>
              <Badge colorScheme="blue" borderRadius="full" px={2}>
                {activeFilterCount}
              </Badge>
            </Tooltip>
          )}
        </HStack>
        {activeFilterCount > 0 && (
          <Button 
            size="sm" 
            variant="outline" 
            colorScheme="red"
            onClick={onReset} 
            w="full"
            mt={3}
          >
            Reset All Filters
          </Button>
        )}
      </CardHeader>

      <CardBody pt={2}>
        <Stack spacing={6}>
          {/* Search */}
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">
              🔍 Smart Search
            </FormLabel>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search companies, domains, descriptions..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                focusBorderColor="blue.400"
                borderRadius="md"
              />
            </InputGroup>
          </FormControl>

          <Divider />

          {/* Categories */}
          <Box>
            <Text fontSize="sm" mb={4} fontWeight="semibold" color="gray.600">
              📊 Categories
            </Text>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  Growth Stage
                </FormLabel>
                <Select
                  placeholder="All stages"
                  size="sm"
                  value={filters.growthStage}
                  onChange={(e) => onFilterChange({ growthStage: e.target.value })}
                  focusBorderColor="blue.400"
                  borderRadius="md"
                >
                  <option value="early">🌱 Early</option>
                  <option value="seed">🌿 Seed</option>
                  <option value="growing">🌳 Growing</option>
                  <option value="late">🏢 Late</option>
                  <option value="exit">🚀 Exit</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  Customer Focus
                </FormLabel>
                <Select
                  placeholder="All customer types"
                  size="sm"
                  value={filters.customerFocus}
                  onChange={(e) => onFilterChange({ customerFocus: e.target.value })}
                  focusBorderColor="blue.400"
                  borderRadius="md"
                >
                  <option value="b2b">🏢 B2B</option>
                  <option value="b2c">👥 B2C</option>
                  <option value="b2b_b2c">🔄 B2B & B2C</option>
                  <option value="b2c_b2b">🔄 B2C & B2B</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  Funding Type
                </FormLabel>
                <Select
                  placeholder="All funding types"
                  size="sm"
                  value={filters.fundingType}
                  onChange={(e) => onFilterChange({ fundingType: e.target.value })}
                  focusBorderColor="blue.400"
                  borderRadius="md"
                >
                  <option value="Seed">🌱 Seed</option>
                  <option value="Series A">🅰️ Series A</option>
                  <option value="Series B">🅱️ Series B</option>
                  <option value="Series C">©️ Series C</option>
                  <option value="Angel">👼 Angel</option>
                  <option value="Convertible Note">📝 Convertible Note</option>
                  <option value="Undisclosed">🤐 Undisclosed</option>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Divider />

          {/* Ranges */}
          <Box>
            <Text fontSize="sm" mb={4} fontWeight="semibold" color="gray.600">
              📏 Ranges
            </Text>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  Rank Range
                </FormLabel>
                <HStack>
                  <NumberInput
                    size="sm"
                    value={filters.minRank || ""}
                    onChange={(_, val) =>
                      onFilterChange({ minRank: isNaN(val) ? null : val })
                    }
                    min={1}
                    focusBorderColor="blue.400"
                  >
                    <NumberInputField placeholder="Min" borderRadius="md" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="xs" color="gray.400">to</Text>
                  <NumberInput
                    size="sm"
                    value={filters.maxRank || ""}
                    onChange={(_, val) =>
                      onFilterChange({ maxRank: isNaN(val) ? null : val })
                    }
                    min={1}
                    focusBorderColor="blue.400"
                  >
                    <NumberInputField placeholder="Max" borderRadius="md" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  💰 Funding Amount (USD)
                </FormLabel>
                <HStack>
                  <NumberInput
                    size="sm"
                    value={filters.minFunding || ""}
                    onChange={(_, val) =>
                      onFilterChange({ minFunding: isNaN(val) ? null : val })
                    }
                    min={0}
                    focusBorderColor="blue.400"
                  >
                    <NumberInputField placeholder="Min $" borderRadius="md" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="xs" color="gray.400">to</Text>
                  <NumberInput
                    size="sm"
                    value={filters.maxFunding || ""}
                    onChange={(_, val) =>
                      onFilterChange({ maxFunding: isNaN(val) ? null : val })
                    }
                    min={0}
                    focusBorderColor="blue.400"
                  >
                    <NumberInputField placeholder="Max $" borderRadius="md" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>
            </Stack>
          </Box>


        </Stack>
      </CardBody>
    </Card>
  );
};
