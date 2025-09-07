import {
  Badge,
  Box,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Company } from "@/features/companies/types/schemas";
import { FormatCurrency } from "@/components/ui/format-currency";
import {
  getGrowthStageColor,
  getCustomerFocusColor,
  formatFundingType,
  formatDate,
  getPositionBackground,
  getPositionBorderColor,
} from "../utils/company-utils";

interface CompanyCardProps {
  company: Company;
  position: number;
  currentPage: number;
  isSqueezed?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function CompanyCard({
  company,
  position,
  currentPage,
  isSqueezed = false,
  onClick,
}: CompanyCardProps) {
  return (
    <Box
      bg={getPositionBackground(position, currentPage)}
      borderRadius="lg"
      border="1px solid"
      borderColor={getPositionBorderColor(position, currentPage)}
      p={isSqueezed ? 2 : 4}
      transition="all 0.2s"
      role="article"
      aria-label={`Company: ${company.name}`}
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      _hover={onClick ? { transform: "translateY(-1px)", shadow: "md" } : {}}
      _active={onClick ? { transform: "translateY(0px)" } : {}}
    >
      <VStack gap={isSqueezed ? 1.5 : 3} align="stretch">
        {/* Header with logo and name */}
        <HStack gap={isSqueezed ? 1 : 3} align="start">
          <Box
            width={isSqueezed ? "28px" : "48px"}
            height={isSqueezed ? "28px" : "48px"}
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
              width={isSqueezed ? "18px" : "32px"}
              height={isSqueezed ? "18px" : "32px"}
            />
          </Box>

          <VStack gap={0} align="start" flex="1" minW={0}>
            <Text
              fontSize={isSqueezed ? "xs" : "md"}
              fontWeight="semibold"
              color="gray.900"
              title={company.name}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {company.name}
            </Text>
            {!isSqueezed && (
              <Link
                href={`https://${company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                color="brand.500"
                _hover={{ textDecoration: "underline" }}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w="100%"
              >
                {company.domain}
              </Link>
            )}
            {isSqueezed && company.description && (
              <Text
                fontSize="10px"
                color="gray.600"
                lineHeight="1.2"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w="100%"
                title={company.description}
              >
                {company.description}
              </Text>
            )}
          </VStack>

          <HStack gap={1}>
            <Badge
              colorPalette="yellow"
              variant="surface"
              size={isSqueezed ? "xs" : "sm"}
              borderRadius="full"
              fontSize={isSqueezed ? "10px" : undefined}
            >
              {position === 1 && currentPage === 1 ? "👑" : ""}#{company.rank}
            </Badge>
            {onClick && isSqueezed && (
              <Text fontSize="xs" color="gray.400">
                ▼
              </Text>
            )}
          </HStack>
        </HStack>

        {/* Description */}
        {company.description && !isSqueezed && (
          <Text fontSize="sm" color="gray.700" lineHeight="1.4">
            {company.description}
          </Text>
        )}

        {/* Badges */}
        {!isSqueezed && (
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
        )}

        {/* Funding info */}
        {(company.last_funding_type || company.last_funding_amount) &&
          !isSqueezed && (
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
                    Last Funding
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
        {company.createdAt && !isSqueezed && (
          <Text fontSize="xs" color="gray.500">
            Added on {formatDate(company.createdAt)}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
