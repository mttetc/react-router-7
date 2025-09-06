import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Avatar,
  Badge,
  Box,
  Center,
  Link as ChakraLink,
  Flex,
  HStack,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  VStack,
  Presence,
  For,
  useLocaleContext,
} from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { FilterState } from "../../../services/companies.service";
import type { Company } from "../../../utils/companies.types";
import { FormatCurrencyCompact } from "../../../components/ui/format-currency";

// Column configuration
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  sortKey?: string;
  width?: string;
  render: (company: Company, helpers: CellHelpers) => React.ReactNode;
}

interface CellHelpers {
  getStageColor: (stage: string | null) => string;
  getFocusColor: (focus: string | null) => string;
  formatDate: (date: Date | null | string) => string;
}

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

// Utility functions
const getStageColor = (stage: string | null): string => {
  switch (stage?.toLowerCase()) {
    case "early":
      return "green";
    case "seed":
      return "yellow";
    case "growing":
      return "blue";
    case "late":
      return "purple";
    case "exit":
      return "red";
    default:
      return "gray";
  }
};

const getFocusColor = (focus: string | null): string => {
  switch (focus?.toLowerCase()) {
    case "b2b":
      return "blue";
    case "b2c":
      return "pink";
    case "b2b_b2c":
      return "teal";
    case "b2c_b2b":
      return "orange";
    default:
      return "gray";
  }
};

// Column definitions
const COLUMNS: TableColumn[] = [
  {
    key: "rank",
    label: "Rank",
    sortable: true,
    sortKey: "rank",
    width: "80px",
    render: (company) => (
      <Badge colorPalette="yellow" variant="surface">
        #{company.rank}
      </Badge>
    ),
  },
  {
    key: "company",
    label: "Company",
    sortable: true,
    sortKey: "name",
    width: "300px",
    render: (company) => (
      <HStack gap={3}>
        <Avatar.Root size="sm" bg="gray.100" color="gray.600">
          <Avatar.Image
            src={`https://app.tryspecter.com/logo?domain=${company.domain}`}
          />
          <Avatar.Fallback>{company.name.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
        <VStack align="start" gap={0}>
          <Text fontWeight="semibold" fontSize="sm" lineClamp={1}>
            {company.name}
          </Text>
          <ChakraLink
            href={`https://${company.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            fontSize="xs"
            color="brand.500"
            _hover={{ textDecoration: "underline" }}
          >
            {company.domain}
          </ChakraLink>
        </VStack>
      </HStack>
    ),
  },
  {
    key: "description",
    label: "Description",
    width: "250px",
    render: (company) => (
      <Text
        fontSize="sm"
        color="gray.600"
        lineClamp={1}
        cursor="help"
        maxWidth="230px"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        title={company.description}
      >
        {company.description}
      </Text>
    ),
  },
  {
    key: "stage",
    label: "Stage",
    width: "120px",
    render: (company, { getStageColor }) => (
      <Badge
        colorPalette={getStageColor(company.growth_stage)}
        borderRadius="full"
        textTransform="capitalize"
      >
        {company.growth_stage || "Unknown"}
      </Badge>
    ),
  },
  {
    key: "focus",
    label: "Focus",
    width: "100px",
    render: (company, { getFocusColor }) => (
      <Badge
        colorPalette={getFocusColor(company.customer_focus)}
        borderRadius="full"
      >
        {company.customer_focus?.toUpperCase() || "N/A"}
      </Badge>
    ),
  },
  {
    key: "funding",
    label: "Funding",
    sortable: true,
    sortKey: "funding",
    width: "120px",
    render: (company) => (
      <Text fontWeight="semibold" color="green.600">
        {company.last_funding_amount ? (
          <FormatCurrencyCompact value={company.last_funding_amount} />
        ) : (
          "N/A"
        )}
      </Text>
    ),
  },
  {
    key: "fundingType",
    label: "Type",
    width: "150px",
    render: (company) => (
      <Text fontSize="sm" lineClamp={1}>
        {company.last_funding_type || "N/A"}
      </Text>
    ),
  },
  {
    key: "createdAt",
    label: "Added",
    width: "120px",
    render: (company, helpers) => (
      <Text fontSize="sm" color="gray.600">
        {helpers.formatDate(company.createdAt)}
      </Text>
    ),
  },
];

const LoadingRow = () => (
  <Table.Row>
    <For each={COLUMNS}>
      {(column) => (
        <Table.Cell key={column.key} width={column.width}>
          {column.key === "rank" && (
            <Skeleton height="20px" width="40px" borderRadius="md" />
          )}
          {column.key === "company" && (
            <HStack gap={3}>
              <Skeleton height="28px" width="28px" borderRadius="full" />
              <VStack align="start" gap={1}>
                <Skeleton height="14px" width="100px" />
                <Skeleton height="12px" width="70px" />
              </VStack>
            </HStack>
          )}
          {column.key === "description" && (
            <Skeleton height="14px" width="180px" />
          )}
          {column.key === "stage" && (
            <Skeleton height="18px" width="60px" borderRadius="md" />
          )}
          {column.key === "focus" && (
            <Skeleton height="18px" width="45px" borderRadius="md" />
          )}
          {column.key === "funding" && <Skeleton height="14px" width="70px" />}
          {column.key === "fundingType" && (
            <Skeleton height="14px" width="90px" />
          )}
          {column.key === "createdAt" && (
            <Skeleton height="14px" width="80px" />
          )}
        </Table.Cell>
      )}
    </For>
  </Table.Row>
);

const CompanyRow = ({ company }: { company: Company }) => {
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const formatDate = (date: Date | null | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Use consistent locale for SSR hydration - always use en-US to avoid mismatch
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const helpers: CellHelpers = {
    getStageColor,
    getFocusColor,
    formatDate,
  };

  return (
    <Table.Row _hover={{ bg: hoverBg }}>
      <For each={COLUMNS}>
        {(column) => (
          <Table.Cell key={column.key} width={column.width}>
            {column.render(company, helpers)}
          </Table.Cell>
        )}
      </For>
    </Table.Row>
  );
};

const SortableHeader = ({
  children,
  sortKey,
  currentSort,
  currentOrder,
  onSort,
  textColor,
}: {
  children: React.ReactNode;
  sortKey: string;
  currentSort: string;
  currentOrder: string;
  onSort: (sortBy: string) => void;
  textColor?: string;
}) => {
  const isActive = currentSort === sortKey;
  const hoverBg = useColorModeValue("brand.100", "brand.800");
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";
  const tooltipText = `Click to sort by ${children} ${
    nextOrder === "asc" ? "ascending" : "descending"
  }`;

  return (
    <Tooltip content={tooltipText} positioning={{ placement: "top" }}>
      <Table.ColumnHeader
        cursor="pointer"
        onClick={() => onSort(sortKey)}
        _hover={{ bg: hoverBg }}
        position="relative"
        color={textColor}
      >
        <Flex align="center" justify="space-between">
          {children}
          {isActive && (
            <Box ml={2}>
              {currentOrder === "asc" ? (
                <FaCaretUp size={12} />
              ) : (
                <FaCaretDown size={12} />
              )}
            </Box>
          )}
        </Flex>
      </Table.ColumnHeader>
    </Tooltip>
  );
};

export const CompanyTable = ({
  companies,
  isLoading,
  filters,
  onFilterChange,
}: CompanyTableProps) => {
  // All hooks must be called at the top level, not conditionally
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const theadBg = useColorModeValue("brand.50", "brand.900");
  const theadTextColor = useColorModeValue("brand.700", "brand.200");
  const emptyBgColor = useColorModeValue("gray.50", "gray.700");

  const handleSort = (sortBy: string) => {
    const newOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    onFilterChange({ sortBy, sortOrder: newOrder });
  };

  const renderTableHeader = () => (
    <Table.Header bg={theadBg}>
      <Table.Row>
        <For each={COLUMNS}>
          {(column) => {
            if (column.sortable) {
              return (
                <SortableHeader
                  key={column.key}
                  sortKey={column.sortKey!}
                  currentSort={filters.sortBy}
                  currentOrder={filters.sortOrder}
                  onSort={handleSort}
                  textColor={theadTextColor}
                >
                  {column.label}
                </SortableHeader>
              );
            }
            return (
              <Table.ColumnHeader
                key={column.key}
                width={column.width}
                color={theadTextColor}
              >
                {column.label}
              </Table.ColumnHeader>
            );
          }}
        </For>
      </Table.Row>
    </Table.Header>
  );

  if (isLoading) {
    return (
      <Box
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="lg"
        bg="white"
        maxWidth="100%"
      >
        <ScrollArea.Root>
          <ScrollArea.Viewport>
            <Table.Root variant="outline" size="sm" minWidth="1100px">
              {renderTableHeader()}
              <Table.Body>
                <For each={Array.from({ length: 10 }, (_, i) => i)}>
                  {(index) => <LoadingRow key={index} />}
                </For>
              </Table.Body>
            </Table.Root>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Box
        borderWidth={1}
        borderColor={borderColor}
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

  return (
    <Box
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      bg="white"
      maxWidth="100%"
    >
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <Table.Root variant="outline" size="sm" minWidth="1100px">
            {renderTableHeader()}
            <Table.Body>
              <For each={companies}>
                {(company, index) => (
                  <CompanyRow key={company.id} company={company} />
                )}
              </For>
            </Table.Body>
          </Table.Root>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Box>
  );
};
