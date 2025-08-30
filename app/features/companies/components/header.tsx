import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Badge,
  Flex,
  Spacer,
  Breadcrumb,
} from "@chakra-ui/react";
import {
  ColorModeButton,
  useColorModeValue,
} from "../../../components/ui/color-mode";
import { Tooltip } from "../../../components/ui/tooltip";

export const Header = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
          <HStack gap={3}>
            <Heading
              size="md"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              🏢 Companies
            </Heading>
            <Tooltip
              content="Over 5,000 companies in database"
              positioning={{ placement: "bottom" }}
            >
              <Badge
                colorPalette="blue"
                borderRadius="full"
                px={2}
                py={1}
                fontSize="xs"
              >
                5K+
              </Badge>
            </Tooltip>
          </HStack>

          <HStack gap={2}>
            <Breadcrumb.Root fontSize="xs" color="gray.500">
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink>Companies</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
            <Tooltip
              content="Toggle between light and dark mode"
              positioning={{ placement: "bottom" }}
            >
              <ColorModeButton size="xs" />
            </Tooltip>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
