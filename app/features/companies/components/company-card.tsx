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
  const getGrowthStageColor = (stage: string | null) => {
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

  const getCustomerFocusColor = (focus: string | null) => {
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

  const formatFundingAmount = (amount: number | null) => {
    if (!amount) return "N/A";
    return <FormatCurrency value={amount} />;
  };

  const formatFundingType = (type: string | null) => {
    if (!type) return "N/A";
    return type.replace(/_/g, " ").toUpperCase();
  };

  const formatDate = (date: Date | null | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPositionBackground = (position: number, currentPage: number) => {
    if (currentPage !== 1) return "white";
    switch (position) {
      case 1:
        return "yellow.100";
      case 2:
        return "gray.100";
      case 3:
        return "orange.100";
      default:
        return "white";
    }
  };

  const getPositionBorderColor = (position: number, currentPage: number) => {
    if (currentPage !== 1) return "gray.200";
    switch (position) {
      case 1:
        return "yellow.300";
      case 2:
        return "gray.300";
      case 3:
        return "orange.300";
      default:
        return "gray.200";
    }
  };

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
                  {formatFundingAmount(company.last_funding_amount)}
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
