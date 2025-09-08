import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router";

export default function Home() {
  return (
    <Center
      minH="100dvh"
      bgImage="url(bg.png)"
      bgSize="cover"
      backgroundPosition="center"
      pos="relative"
      zIndex={0}
      _before={{
        content: '""',
        pos: "absolute",
        inset: 0,
        bgColor: "rgba(255, 255, 255, 0.6)",
        zIndex: -1,
      }}
    >
      <Box textAlign="center">
        <Image src="/specter-icon.svg" alt="Specter" w={12} mx="auto" mb={4} />
        <Heading mb={1} fontWeight="semibold" letterSpacing="tight">
          Hey there!
        </Heading>
        <Text color="gray.500" fontSize="sm" mb={4} letterSpacing="tight">
          Welcome to the Specter frontend test.
        </Text>
        <VStack gap={3}>
          <Link to="/companies">
            <Button variant="solid" colorPalette="purple">
              View Companies
            </Button>
          </Link>
        </VStack>
      </Box>
    </Center>
  );
}
