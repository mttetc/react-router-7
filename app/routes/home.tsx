import { Box, Button, Center, Heading, Image, Text } from "@chakra-ui/react";
import type { Route } from "./+types/home";
import { HiArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <Center
      minH="100dvh"
      bgImage="url(bg.png)"
      bgSize="cover"
      bgPosition="center"
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
        <Heading
          mb={1}
          fontWeight="semibold"
          letterSpacing="tight"
          as={motion.h1}
          initial={{
            opacity: 0,
            y: 24,
            filter: "blur(12px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
        >
          Hey there!
        </Heading>
        <Text color="gray.500" fontSize="sm" mb={4} letterSpacing="tight">
          Welcome to the Specter frontend test.
        </Text>
        <Button
          variant="outline"
          rightIcon={<HiArrowRight />}
          as={Link}
          to="/test"
        >
          Get Started
        </Button>
      </Box>
    </Center>
  );
}
