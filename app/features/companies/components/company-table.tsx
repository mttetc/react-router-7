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
import { ExternalLinkIcon, CopyIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { useClipboard, useToast } from "@chakra-ui/react";
import type { Company } from "../../../utils/companies.types";
import type { FilterState } from "../../../services/companies.service";
import { formatFunding } from "../utils/filter-utils";

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const LoadingRow = () => {
  return (
    <Tr>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" /></Td>
    </Tr>
  );
};

const CompanyRow = ({ company }: { company: Company }) => {
  const { onCopy } = useClipboard(company.domain);
  const toast = useToast();

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

  const getStageColor = (stage: string | null) => {
    switch (stage?.toLowerCase()) {
      case "early": return "green";
      case "seed": return "yellow";
      case "growing": return "blue";
      case "late": return "purple";
      case "exit": return "red";
      default: return "gray";
    }
  };

  const getFocusColor = (focus: string | null) => {
    switch (focus?.toLowerCase()) {
      case "b2b": return "blue";
      case "b2c": return "pink";
      case "b2b_b2c": return "teal";
      case "b2c_b2b": return "orange";
      default: return "gray";
    }
  };

  return (
    <Tr _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
      {/* Rank */}
      <Td>
        <Badge colorScheme="yellow" borderRadius="full" px={2}>
          #{company.rank}
        </Badge>
      </Td>
      
      {/* Company */}
      <Td>
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
      </Td>
      
      {/* Description */}
      <Td maxW="300px">
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {company.description}
        </Text>
      </Td>
      
      {/* Stage */}
      <Td>
        <Badge 
          colorScheme={getStageColor(company.growth_stage)}
          borderRadius="full"
          textTransform="capitalize"
        >
          {company.growth_stage || "Unknown"}
        </Badge>
      </Td>
      
      {/* Focus */}
      <Td>
        <Badge 
          colorScheme={getFocusColor(company.customer_focus)}
          borderRadius="full"
        >
          {company.customer_focus?.toUpperCase() || "N/A"}
        </Badge>
      </Td>
      
      {/* Funding Amount */}
      <Td>
        <Text fontWeight="semibold" color="green.600">
          {formatFunding(company.last_funding_amount)}
        </Text>
      </Td>
      
      {/* Funding Type */}
      <Td>
        <Text fontSize="sm" noOfLines={1}>
          {company.last_funding_type || "N/A"}
        </Text>
      </Td>
      
      {/* Actions */}
      <Td>
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
      </Td>
    </Tr>
  );
};

const SortableHeader = ({ 
  children, 
  sortKey, 
  currentSort, 
  currentOrder, 
  onSort 
}: {
  children: React.ReactNode;
  sortKey: string;
  currentSort: string;
  currentOrder: string;
  onSort: (sortBy: string) => void;
}) => {
  const isActive = currentSort === sortKey;
  
  return (
    <Th 
      cursor="pointer" 
      onClick={() => onSort(sortKey)}
      _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
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

export const CompanyTable = ({ companies, isLoading, filters, onFilterChange }: CompanyTableProps) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSort = (sortBy: string) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    onFilterChange({ sortBy, sortOrder: newOrder });
  };

  if (isLoading) {
    return (
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Company</Th>
              <Th>Description</Th>
              <Th>Stage</Th>
              <Th>Focus</Th>
              <Th>Funding</Th>
              <Th>Type</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
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
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Company</Th>
              <Th>Description</Th>
              <Th>Stage</Th>
              <Th>Focus</Th>
              <Th>Funding</Th>
              <Th>Type</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td colSpan={8} textAlign="center" py={10}>
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
    <TableContainer borderWidth={1} borderColor={borderColor} borderRadius="lg" bg="white">
      <Table variant="simple" size="sm">
        <Thead bg={useColorModeValue("gray.50", "gray.700")}>
          <Tr>
            <SortableHeader 
              sortKey="rank" 
              currentSort={filters.sortBy} 
              currentOrder={filters.sortOrder}
              onSort={handleSort}
            >
              Rank
            </SortableHeader>
            <SortableHeader 
              sortKey="name" 
              currentSort={filters.sortBy} 
              currentOrder={filters.sortOrder}
              onSort={handleSort}
            >
              Company
            </SortableHeader>
            <Th>Description</Th>
            <Th>Stage</Th>
            <Th>Focus</Th>
            <SortableHeader 
              sortKey="funding" 
              currentSort={filters.sortBy} 
              currentOrder={filters.sortOrder}
              onSort={handleSort}
            >
              Funding
            </SortableHeader>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {companies.map((company) => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
