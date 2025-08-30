import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Image,
  Link as ChakraLink,
  Grid,
  Avatar,
  Heading,
  useColorModeValue,
  Tooltip,
  Flex,
  Spacer,
  IconButton,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import type { Company } from "../../../utils/companies.types";
import { formatFunding } from "../utils/filter-utils";

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
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
    <Card 
      h="full" 
      bg={bgColor}
      borderColor={borderColor}
      transition="all 0.3s ease"
      _hover={{ 
        transform: "translateY(-4px)", 
        shadow: "xl",
        borderColor: "blue.300"
      }}
      cursor="pointer"
    >
      <CardHeader pb={2}>
        <Flex align="center">
          <Avatar
            src={`https://specter.api.com/logo/${company.domain}`}
            name={company.name}
            size="md"
            bg="gray.100"
            color="gray.600"
          />
          <Box ml={3} flex={1}>
            <Tooltip label={company.name} hasArrow>
              <Heading size="sm" noOfLines={1} color="gray.700">
                {company.name}
              </Heading>
            </Tooltip>
            <HStack spacing={2} mt={1}>
              <ChakraLink
                href={`https://${company.domain}`}
                isExternal
                fontSize="xs"
                color="blue.500"
                noOfLines={1}
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
          </Box>
          <Spacer />
          <Tooltip label={`Ranked #${company.rank}`} hasArrow>
            <Badge colorScheme="yellow" fontSize="xs" px={2} py={1}>
              #{company.rank}
            </Badge>
          </Tooltip>
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <VStack align="start" spacing={4} h="full">
          {/* Description */}
          <Text fontSize="sm" color="gray.600" noOfLines={3} lineHeight="1.4">
            {company.description}
          </Text>

          <Spacer />

          {/* Company details */}
          <Grid templateColumns="1fr 1fr" gap={3} w="full">
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                🌱 Growth Stage
              </Text>
              <Badge 
                size="sm" 
                colorScheme={getStageColor(company.growth_stage)}
                borderRadius="full"
              >
                {company.growth_stage || "Unknown"}
              </Badge>
            </Box>
            
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                🎯 Customer Focus
              </Text>
              <Badge 
                size="sm" 
                colorScheme={getFocusColor(company.customer_focus)}
                borderRadius="full"
              >
                {company.customer_focus?.toUpperCase() || "N/A"}
              </Badge>
            </Box>
            
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                💰 Last Funding
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="green.600">
                {formatFunding(company.last_funding_amount)}
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                📊 Funding Type
              </Text>
              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                {company.last_funding_type || "N/A"}
              </Text>
            </Box>
          </Grid>
        </VStack>
      </CardBody>
    </Card>
  );
};
