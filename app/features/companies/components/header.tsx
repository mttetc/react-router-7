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
  Image,
} from "@chakra-ui/react";
import {
  ColorModeButton,
  useColorModeValue,
} from "../../../components/ui/color-mode";
import { Tooltip } from "../../../components/ui/tooltip";
import { CurrencySelector } from "../../../components/ui/currency-selector";

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
          <HStack gap={2} align="center">
            <Image
              src="https://www.tryspecter.com/specter.svg"
              alt="Specter"
              filter={useColorModeValue("none", "invert(1)")}
            />
            <HStack gap={3} align="baseline">
              <Text
                fontSize="sm"
                color={useColorModeValue("brand.500", "brand.400")}
                fontWeight="normal"
                fontStyle="italic"
              >
                lite
              </Text>
              <Tooltip
                content="Over 5,000 companies in database"
                positioning={{ placement: "bottom" }}
              >
                <Badge
                  colorPalette="purple"
                  borderRadius="full"
                  size="sm"
                  variant="surface"
                >
                  5K+
                </Badge>
              </Tooltip>
            </HStack>
          </HStack>

          <HStack gap={3}>
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

            <HStack gap={2}>
              <Tooltip
                content="Select currency for funding amounts"
                positioning={{ placement: "bottom" }}
              >
                <CurrencySelector />
              </Tooltip>
              <Tooltip
                content="Toggle between light and dark mode"
                positioning={{ placement: "bottom" }}
              >
                <ColorModeButton size="xs" />
              </Tooltip>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
