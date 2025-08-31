import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Separator,
  Wrap,
} from "@chakra-ui/react";
import type { Company } from "../../utils/companies.types";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const formatFunding = (amount: number | null) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 10) return "blue";
    if (rank <= 50) return "green";
    if (rank <= 100) return "yellow";
    return "gray";
  };

  const getGrowthStageColor = (stage: string | null) => {
    if (!stage) return "gray";
    switch (stage.toLowerCase()) {
      case "seed":
        return "green";
      case "early":
        return "blue";
      case "growing":
        return "purple";
      case "late":
        return "orange";
      case "exit":
        return "red";
      default:
        return "gray";
    }
  };

  const getCustomerFocusColor = (focus: string | null) => {
    if (!focus) return "gray";
    switch (focus.toLowerCase()) {
      case "b2b":
        return "purple";
      case "b2c":
        return "pink";
      case "b2b_b2c":
      case "b2c_b2b":
        return "teal";
      default:
        return "gray";
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      bg="white"
      shadow="md"
      transition="all 0.2s"
      cursor="pointer"
      _hover={{
        shadow: "lg",
      }}
    >
      <VStack align="start" gap={3}>
        {/* Header with logo, name, and rank */}
        <HStack justify="space-between" w="full">
          <HStack gap={3}>
            <Image
              src={`https://app.tryspecter.com/logo?domain=${company.domain}`}
              alt={`${company.name} logo`}
              w="32px"
              h="32px"
              borderRadius="md"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/32x32?text=?";
              }}
            />
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {company.name}
            </Text>
          </HStack>
          <Badge colorPalette={getRankBadgeColor(company.rank)}>
            #{company.rank}
          </Badge>
        </HStack>

        {/* Domain */}
        <Text color="brand.600" fontSize="sm" fontWeight="medium">
          {company.domain}
        </Text>

        {/* Description */}
        <Text
          color="gray.600"
          fontSize="sm"
          lineClamp={3}
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {company.description}
        </Text>

        <Separator />

        {/* Tags */}
        <Wrap gap={4}>
          <Badge
            variant="outline"
            colorPalette={getGrowthStageColor(company.growth_stage)}
          >
            {company.growth_stage}
          </Badge>
          <Badge
            variant="outline"
            colorPalette={getCustomerFocusColor(company.customer_focus)}
          >
            {company.customer_focus}
          </Badge>
        </Wrap>

        {/* Funding info */}
        <Text fontSize="xs" color="gray.500">
          Last funding: {company.last_funding_type || "Unknown"}
          {company.last_funding_amount && (
            <span> - {formatFunding(company.last_funding_amount)}</span>
          )}
        </Text>
      </VStack>
    </Box>
  );
}
