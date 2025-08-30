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
      <Container maxW="8xl" py={3}>
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Heading size="md" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
              🏢 Companies
            </Heading>
            <Badge colorScheme="blue" borderRadius="full" px={2} py={1} fontSize="xs">
              5K+
            </Badge>
          </HStack>
          
          <HStack spacing={2}>
            <Breadcrumb fontSize="xs" color="gray.500">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Companies</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`} hasArrow>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="xs"
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
