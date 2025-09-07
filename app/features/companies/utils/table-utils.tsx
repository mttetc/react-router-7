/**
 * Table utility functions and configurations
 */

import React from "react";
import {
  Avatar,
  Badge,
  HStack,
  Link as ChakraLink,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Company } from "@/features/companies/types/schemas";
import { FormatCurrencyCompact } from "../../../components/ui/format-currency";
import { Tooltip } from "../../../components/ui/tooltip";
import {
  getGrowthStageColor,
  getCustomerFocusColor,
  formatDate,
} from "./company-utils";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  sortKey?: string;
  width?: string;
  render: (company: Company, helpers: CellHelpers) => React.ReactNode;
}

export interface CellHelpers {
  getStageColor: (stage: string | null) => string;
  getFocusColor: (focus: string | null) => string;
  formatDate: (date: Date | null | string) => string;
  position: number;
  currentPage: number;
}

/**
 * Table column definitions
 */
export const TABLE_COLUMNS: TableColumn[] = [
  {
    key: "rank",
    label: "Rank",
    sortable: true,
    sortKey: "rank",
    width: "80px",
    render: (company, { position, currentPage }) => (
      <Badge colorPalette="yellow" variant="surface">
        {position === 1 && currentPage === 1 ? "👑 " : ""}#{company.rank}
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
          <Text fontWeight="semibold" fontSize="sm">
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
      <Tooltip content={company.description} disabled={!company.description}>
        <Text
          fontSize="sm"
          color="gray.600"
          lineClamp={1}
          cursor="help"
          maxWidth="230px"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {company.description}
        </Text>
      </Tooltip>
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
    sortable: true,
    sortKey: "createdAt",
    width: "120px",
    render: (company, helpers) => (
      <Text fontSize="sm" color="gray.600">
        {helpers.formatDate(company.createdAt)}
      </Text>
    ),
  },
];

/**
 * Skeleton mapping for loading states
 */
export const SKELETON_MAP: Record<string, React.ReactNode> = {
  rank: <Skeleton height="20px" width="50px" borderRadius="md" />,
  company: (
    <HStack gap={3}>
      <Skeleton height="36px" width="36px" borderRadius="full" />
      <VStack align="start" gap={1}>
        <Skeleton height="18px" width="120px" />
        <Skeleton height="18px" width="90px" />
      </VStack>
    </HStack>
  ),
  description: <Skeleton height="20px" width="200px" />,
  stage: <Skeleton height="24px" width="80px" borderRadius="full" />,
  focus: <Skeleton height="24px" width="50px" borderRadius="full" />,
  funding: <Skeleton height="20px" width="80px" />,
  fundingType: <Skeleton height="20px" width="70px" />,
  createdAt: <Skeleton height="20px" width="85px" />,
};

/**
 * Create cell helpers for table rendering
 */
export function createCellHelpers(
  position: number,
  currentPage: number
): CellHelpers {
  return {
    getStageColor: getGrowthStageColor,
    getFocusColor: getCustomerFocusColor,
    formatDate,
    position,
    currentPage,
  };
}
