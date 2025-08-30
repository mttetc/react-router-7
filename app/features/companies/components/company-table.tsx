import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Avatar,
  Badge,
  Box,
  Link as ChakraLink,
  Flex,
  HStack,
  Skeleton,
  Table,
  Text,
  VStack,
  Presence,
  For,
} from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { FilterState } from "../../../services/companies.service";
import type { Company } from "../../../utils/companies.types";
import { formatFunding } from "../utils/filter-utils";

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
      <Badge colorPalette="yellow" borderRadius="full" px={2}>
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
            color="blue.500"
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
        {formatFunding(company.last_funding_amount)}
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
          <Skeleton height="20px" />
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
    return dateObj.toLocaleDateString(navigator.language || "en-US", {
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
}: {
  children: React.ReactNode;
  sortKey: string;
  currentSort: string;
  currentOrder: string;
  onSort: (sortBy: string) => void;
}) => {
  const isActive = currentSort === sortKey;
  const hoverBg = useColorModeValue("gray.100", "gray.600");
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
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const theadBg = useColorModeValue("gray.50", "gray.700");

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
                >
                  {column.label}
                </SortableHeader>
              );
            }
            return (
              <Table.ColumnHeader key={column.key} width={column.width}>
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
        overflowX="auto"
        maxWidth="100%"
      >
        <Table.Root variant="outline" size="sm" minWidth="1100px">
          {renderTableHeader()}
          <Table.Body>
            <For each={Array.from({ length: 10 }, (_, i) => i)}>
              {(index) => <LoadingRow key={index} />}
            </For>
          </Table.Body>
        </Table.Root>
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
        overflowX="auto"
        maxWidth="100%"
      >
        <Table.Root variant="outline" size="sm" minWidth="1100px">
          {renderTableHeader()}
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                <VStack gap={2}>
                  <Text fontSize="lg" color="gray.500">
                    No companies found
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Try adjusting your filters to see more results
                  </Text>
                </VStack>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>
    );
  }

  return (
    <Box
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      bg="white"
      overflowX="auto"
      maxWidth="100%"
    >
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
    </Box>
  );
};
