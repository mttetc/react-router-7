import {
  Badge,
  Box,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Company } from "@/types/companies";
import { FormatCurrency } from "@/components/ui/format-currency";
import {
  getGrowthStageColor,
  getCustomerFocusColor,
  formatFundingAmount,
  formatFundingType,
  formatDate,
  getPositionBackground,
  getPositionBorderColor,
} from "../utils/company-utils";

interface CompanyCardProps {
  company: Company;
  position: number;
  currentPage: number;
}

export function CompanyCard({
  company,
  position,
  currentPage,
}: CompanyCardProps) {
  return (
    <Box
      bg={getPositionBackground(position, currentPage)}
      borderRadius="lg"
      border="1px solid"
      borderColor={getPositionBorderColor(position, currentPage)}
      p={4}
      transition="all 0.2s"
      role="article"
      aria-label={`Company: ${company.name}`}
    >
      <VStack gap={3} align="stretch">
        {/* Header with logo and name */}
        <HStack gap={3} align="start">
          <Box
            width="48px"
            height="48px"
            borderRadius="lg"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Image
              src={`https://logo.clearbit.com/${company.domain}`}
              alt={`${company.name} logo`}
              width="32px"
              height="32px"
            />
          </Box>

          <VStack gap={1} align="start" flex="1" minW={0}>
            <Text
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              title={company.name}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {company.name}
            </Text>
            <Link
              href={`https://${company.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              color="brand.500"
              _hover={{ textDecoration: "underline" }}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {company.domain}
            </Link>
          </VStack>

          <Badge
            colorPalette="yellow"
            variant="surface"
            size="sm"
            borderRadius="full"
          >
            {position === 1 && currentPage === 1 ? "👑" : ""}#{company.rank}
          </Badge>
        </HStack>

        {/* Description */}
        {company.description && (
          <Text
            fontSize="sm"
            color="gray.700"
            lineHeight="1.4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {company.description}
          </Text>
        )}

        {/* Badges */}
        <HStack gap={2} wrap="wrap">
          {company.growth_stage && (
            <Badge
              colorPalette={getGrowthStageColor(company.growth_stage)}
              variant="surface"
              size="sm"
              textTransform="capitalize"
              borderRadius="full"
            >
              {company.growth_stage}
            </Badge>
          )}

          {company.customer_focus && (
            <Badge
              colorPalette={getCustomerFocusColor(company.customer_focus)}
              variant="surface"
              size="sm"
              borderRadius="full"
            >
              {company.customer_focus?.toUpperCase() || "N/A"}
            </Badge>
          )}
        </HStack>

        {/* Funding info */}
        {(company.last_funding_type || company.last_funding_amount) && (
          <Box
            bg="gray.50"
            borderRadius="md"
            p={3}
            border="1px solid"
            borderColor="gray.200"
          >
            <VStack gap={1} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.600" fontWeight="medium">
                  Dernier financement
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {formatFundingType(company.last_funding_type)}
                </Text>
              </HStack>

              {company.last_funding_amount && (
                <Box fontSize="sm" fontWeight="semibold" color="green.600">
                  <FormatCurrency value={company.last_funding_amount} />
                </Box>
              )}
            </VStack>
          </Box>
        )}

        {/* Date added */}
        {company.createdAt && (
          <Text fontSize="xs" color="gray.500">
            Ajouté le {formatDate(company.createdAt)}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
