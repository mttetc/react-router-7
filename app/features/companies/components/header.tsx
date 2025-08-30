import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  useColorModeValue,
  HStack,
  Badge,
  Flex,
  Spacer,
  IconButton,
  useColorMode,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const Header = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="sticky"
      shadow="sm"
    >
      <Container maxW="8xl" py={6}>
        <Flex align="center" mb={4}>
          <Box>
            <Breadcrumb fontSize="sm" color="gray.500">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Companies</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
          <Spacer />
          <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`} hasArrow>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
        </Flex>
        
        <HStack spacing={4} align="center" mb={2}>
          <Heading size="xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
            🏢 Company Feed
          </Heading>
          <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
            5,000+ Companies
          </Badge>
        </HStack>
        
        <Text color="gray.600" fontSize="md" maxW="2xl">
          Discover and filter through our curated database of innovative companies. 
          Find your next investment opportunity or business partner with advanced filtering and search capabilities.
        </Text>
      </Container>
    </Box>
  );
};
