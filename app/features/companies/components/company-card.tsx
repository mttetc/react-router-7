import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  Image,
  Link as ChakraLink,
  Grid,
  Avatar,
  Heading,
  Flex,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { Company } from "../../../utils/companies.types";
import { formatFunding } from "../utils/filter-utils";

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const getStageColor = (stage: string | null) => {
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

  const getFocusColor = (focus: string | null) => {
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

  return (
    <Card.Root
      h="full"
      bg={bgColor}
      borderColor={borderColor}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "lg",
        borderColor: "brand.300",
      }}
      cursor="pointer"
      overflow="hidden"
    >
      {/* Header with rank badge positioned absolutely */}
      <Box position="relative">
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorPalette="yellow"
          fontSize="2xs"
          px={2}
          py={1}
          borderRadius="full"
          zIndex={1}
        >
          #{company.rank}
        </Badge>

        <Card.Body p={4}>
          <VStack align="start" gap={3} h="full">
            {/* Company header */}
            <HStack gap={3} w="full" pr={12}>
              {" "}
              {/* Add right padding for rank badge */}
              <Avatar.Root size="sm" bg="gray.100" color="gray.600">
                <Avatar.Image
                  src={`https://specter.api.com/logo/${company.domain}`}
                />
                <Avatar.Fallback>{company.name.charAt(0)}</Avatar.Fallback>
              </Avatar.Root>
              <Box flex={1} minW={0}>
                {" "}
                {/* minW={0} prevents overflow */}
                <Heading
                  size="sm"
                  lineClamp={1}
                  color="gray.700"
                  mb={1}
                  title={company.name}
                >
                  {company.name}
                </Heading>
                <HStack gap={1}>
                  <ChakraLink
                    href={`https://${company.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="xs"
                    color="brand.500"
                    lineClamp={1}
                    _hover={{ textDecoration: "underline" }}
                    flex={1}
                  >
                    {company.domain}
                  </ChakraLink>

                  <ChakraLink
                    href={`https://${company.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Visit website"
                  >
                    <IconButton
                      aria-label="Visit website"
                      size="xs"
                      variant="ghost"
                      colorPalette="purple"
                    >
                      <FaExternalLinkAlt />
                    </IconButton>
                  </ChakraLink>
                </HStack>
              </Box>
            </HStack>

            {/* Description */}
            <Text fontSize="sm" color="gray.600" lineClamp={2} lineHeight="1.3">
              {company.description}
            </Text>

            <Spacer />

            {/* Company details - more compact */}
            <VStack gap={2} w="full">
              <HStack justify="space-between" w="full">
                <HStack gap={2}>
                  <Text fontSize="xs" color="gray.500">
                    Stage:
                  </Text>
                  <Badge
                    size="sm"
                    colorPalette={getStageColor(company.growth_stage)}
                    borderRadius="full"
                  >
                    {company.growth_stage || "Unknown"}
                  </Badge>
                </HStack>
                <HStack gap={2}>
                  <Text fontSize="xs" color="gray.500">
                    Focus:
                  </Text>
                  <Badge
                    size="sm"
                    colorPalette={getFocusColor(company.customer_focus)}
                    borderRadius="full"
                  >
                    {company.customer_focus?.toUpperCase() || "N/A"}
                  </Badge>
                </HStack>
              </HStack>

              <HStack justify="space-between" w="full">
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    Funding
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color="green.600">
                    {formatFunding(company.last_funding_amount)}
                  </Text>
                </VStack>
                <VStack align="end" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    Type
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    lineClamp={1}
                    textAlign="right"
                  >
                    {company.last_funding_type || "N/A"}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </Card.Body>
      </Box>
    </Card.Root>
  );
};
