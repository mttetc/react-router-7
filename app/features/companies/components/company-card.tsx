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
        transform: "translateY(-2px)", 
        shadow: "lg",
        borderColor: "blue.300"
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
          colorScheme="yellow" 
          fontSize="2xs" 
          px={2} 
          py={1}
          borderRadius="full"
          zIndex={1}
        >
          #{company.rank}
        </Badge>
        
        <CardBody p={4}>
          <VStack align="start" spacing={3} h="full">
            {/* Company header */}
            <HStack spacing={3} w="full" pr={12}> {/* Add right padding for rank badge */}
              <Avatar
                src={`https://specter.api.com/logo/${company.domain}`}
                name={company.name}
                size="sm"
                bg="gray.100"
                color="gray.600"
              />
              <Box flex={1} minW={0}> {/* minW={0} prevents overflow */}
                <Tooltip label={company.name} hasArrow>
                  <Heading size="sm" noOfLines={1} color="gray.700" mb={1}>
                    {company.name}
                  </Heading>
                </Tooltip>
                <HStack spacing={1}>
                  <ChakraLink
                    href={`https://${company.domain}`}
                    isExternal
                    fontSize="xs"
                    color="blue.500"
                    noOfLines={1}
                    _hover={{ textDecoration: "underline" }}
                    flex={1}
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
            </HStack>

            {/* Description */}
            <Text fontSize="sm" color="gray.600" noOfLines={2} lineHeight="1.3">
              {company.description}
            </Text>

            <Spacer />

            {/* Company details - more compact */}
            <VStack spacing={2} w="full">
              <HStack justify="space-between" w="full">
                <HStack spacing={2}>
                  <Text fontSize="xs" color="gray.500">Stage:</Text>
                  <Badge 
                    size="sm" 
                    colorScheme={getStageColor(company.growth_stage)}
                    borderRadius="full"
                  >
                    {company.growth_stage || "Unknown"}
                  </Badge>
                </HStack>
                <HStack spacing={2}>
                  <Text fontSize="xs" color="gray.500">Focus:</Text>
                  <Badge 
                    size="sm" 
                    colorScheme={getFocusColor(company.customer_focus)}
                    borderRadius="full"
                  >
                    {company.customer_focus?.toUpperCase() || "N/A"}
                  </Badge>
                </HStack>
              </HStack>
              
              <HStack justify="space-between" w="full">
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="gray.500">Funding</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="green.600">
                    {formatFunding(company.last_funding_amount)}
                  </Text>
                </VStack>
                <VStack align="end" spacing={0}>
                  <Text fontSize="xs" color="gray.500">Type</Text>
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1} textAlign="right">
                    {company.last_funding_type || "N/A"}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Box>
    </Card>
  );
};
