import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Badge,
  Text,
  Link as ChakraLink,
  HStack,
  VStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  Skeleton,
  Box,
  Flex,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  CopyIcon,
  TriangleUpIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import { useClipboard, useToast } from "@chakra-ui/react";
import type { Company } from "../../../utils/companies.types";
import type { FilterState } from "../../../services/companies.service";
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
  handleCopyDomain: () => void;
  getStageColor: (stage: string | null) => string;
  getFocusColor: (focus: string | null) => string;
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
      <Badge colorScheme="yellow" borderRadius="full" px={2}>
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
    render: (company, { handleCopyDomain }) => (
      <HStack spacing={3}>
        <Avatar
          src={`https://specter.api.com/logo/${company.domain}`}
          name={company.name}
          size="sm"
          bg="gray.100"
          color="gray.600"
        />
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
            {company.name}
          </Text>
          <HStack spacing={1}>
            <ChakraLink
              href={`https://${company.domain}`}
              isExternal
              fontSize="xs"
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              {company.domain}
            </ChakraLink>
            <Tooltip label="Copy domain" hasArrow>
              <IconButton
                aria-label="Copy domain"
                icon={<CopyIcon />}
                size="xs"
                variant="ghost"
                onClick={handleCopyDomain}
              />
            </Tooltip>
            <Tooltip label="Visit website" hasArrow>
              <IconButton
                as={ChakraLink}
                href={`https://${company.domain}`}
                isExternal
                aria-label="Visit website"
                icon={<ExternalLinkIcon />}
                size="xs"
                variant="ghost"
                colorScheme="blue"
              />
            </Tooltip>
          </HStack>
        </VStack>
      </HStack>
    ),
  },
  {
    key: "description",
    label: "Description",
    width: "300px",
    render: (company) => (
      <Text fontSize="sm" color="gray.600" noOfLines={2}>
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
        colorScheme={getStageColor(company.growth_stage)}
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
      <Badge colorScheme={getFocusColor(company.customer_focus)} borderRadius="full">
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
      <Text fontSize="sm" noOfLines={1}>
        {company.last_funding_type || "N/A"}
      </Text>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    width: "100px",
    render: (company, { handleCopyDomain }) => (
      <HStack spacing={1}>
        <Tooltip label="Copy domain" hasArrow>
          <IconButton
            aria-label="Copy domain"
            icon={<CopyIcon />}
            size="sm"
            variant="ghost"
            onClick={handleCopyDomain}
          />
        </Tooltip>
        <Tooltip label="Visit website" hasArrow>
          <IconButton
            as={ChakraLink}
            href={`https://${company.domain}`}
            isExternal
            aria-label="Visit website"
            icon={<ExternalLinkIcon />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
          />
        </Tooltip>
      </HStack>
    ),
  },
];

const LoadingRow = () => (
  <Tr>
    {COLUMNS.map((column) => (
      <Td key={column.key} width={column.width}>
        <Skeleton height="20px" />
      </Td>
    ))}
  </Tr>
);

const CompanyRow = ({ company }: { company: Company }) => {
  const { onCopy } = useClipboard(company.domain);
  const toast = useToast();
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const handleCopyDomain = () => {
    onCopy();
    toast({
      title: "Domain copied!",
      description: `${company.domain} copied to clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
      size: "sm",
    });
  };

  const helpers: CellHelpers = {
    handleCopyDomain,
    getStageColor,
    getFocusColor,
  };

  return (
    <Tr _hover={{ bg: hoverBg }}>
      {COLUMNS.map((column) => (
        <Td key={column.key} width={column.width}>
          {column.render(company, helpers)}
        </Td>
      ))}
    </Tr>
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

  return (
    <Th
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
              <TriangleUpIcon boxSize={3} />
            ) : (
              <TriangleDownIcon boxSize={3} />
            )}
          </Box>
        )}
      </Flex>
    </Th>
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
    <Thead bg={theadBg}>
      <Tr>
        {COLUMNS.map((column) => {
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
            <Th key={column.key} width={column.width}>
              {column.label}
            </Th>
          );
        })}
      </Tr>
    </Thead>
  );

  if (isLoading) {
    return (
      <TableContainer>
        <Table variant="simple" size="sm">
          {renderTableHeader()}
          <Tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <LoadingRow key={index} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  if (companies.length === 0) {
    return (
      <TableContainer>
        <Table variant="simple" size="sm">
          {renderTableHeader()}
          <Tbody>
            <Tr>
              <Td colSpan={COLUMNS.length} textAlign="center" py={10}>
                <VStack spacing={2}>
                  <Text fontSize="lg" color="gray.500">
                    No companies found
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Try adjusting your filters to see more results
                  </Text>
                </VStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      bg="white"
    >
      <Table variant="simple" size="sm">
        {renderTableHeader()}
        <Tbody>
          {companies.map((company) => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
