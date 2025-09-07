import type { Company } from "@/features/companies/types/schemas";
import {
  Box,
  Container,
  HStack,
  ScrollArea,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CompanyCard } from "./company-card";
import { Pagination } from "./pagination";
import {
  getPositionBackground,
  getPositionBorderColor,
} from "../utils/company-utils";

interface MobileLayoutProps {
  companies: Company[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isSqueezed?: boolean;
}

export function MobileLayout({
  companies,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  isSqueezed = false,
}: MobileLayoutProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const handleCardClick = (companyId: string) => {
    if (isSqueezed) {
      setExpandedCardId(expandedCardId === companyId ? null : companyId);
    }
  };
  if (isLoading) {
    return (
      <Container p={isSqueezed ? 2 : 4} h="100%" minH={0}>
        <VStack gap={isSqueezed ? 2 : 4} align="stretch">
          {/* Loading skeleton cards */}
          {Array.from({ length: isSqueezed ? 8 : 6 }).map((_, index) => {
            const position = index + 1;
            const skeletonBg = getPositionBackground(position, currentPage);
            const skeletonBorderColor = getPositionBorderColor(
              position,
              currentPage
            );

            return (
              <Box
                key={index}
                bg={skeletonBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={skeletonBorderColor}
                p={isSqueezed ? 2 : 4}
                h={isSqueezed ? "48px" : "200px"}
                bgGradient="linear(to-r, gray.100, gray.200)"
              >
                {isSqueezed ? (
                  // Compact skeleton layout
                  <HStack gap={1} align="start" h="full">
                    {/* Logo skeleton */}
                    <Box
                      width="28px"
                      height="28px"
                      borderRadius="lg"
                      bg="gray.300"
                      flexShrink={0}
                    />
                    {/* Content skeleton */}
                    <VStack gap={1} align="start" flex="1" minW={0}>
                      <Box
                        height="14px"
                        width="70%"
                        bg="gray.300"
                        borderRadius="sm"
                      />
                      <Box
                        height="10px"
                        width="40%"
                        bg="gray.300"
                        borderRadius="sm"
                      />
                    </VStack>
                    {/* Badge skeleton */}
                    <Box
                      width="24px"
                      height="20px"
                      bg="gray.300"
                      borderRadius="full"
                      flexShrink={0}
                    />
                  </HStack>
                ) : (
                  // Full skeleton layout
                  <VStack gap={3} align="stretch" h="full">
                    <HStack gap={3} align="start">
                      {/* Logo skeleton */}
                      <Box
                        width="48px"
                        height="48px"
                        borderRadius="lg"
                        bg="gray.300"
                        flexShrink={0}
                      />
                      {/* Content skeleton */}
                      <VStack gap={1} align="start" flex="1" minW={0}>
                        <Box
                          height="16px"
                          width="80%"
                          bg="gray.300"
                          borderRadius="sm"
                        />
                        <Box
                          height="14px"
                          width="60%"
                          bg="gray.300"
                          borderRadius="sm"
                        />
                      </VStack>
                      {/* Badge skeleton */}
                      <Box
                        width="32px"
                        height="24px"
                        bg="gray.300"
                        borderRadius="full"
                        flexShrink={0}
                      />
                    </HStack>
                    {/* Description skeleton */}
                    <Box
                      height="14px"
                      width="100%"
                      bg="gray.300"
                      borderRadius="sm"
                    />
                    <Box
                      height="14px"
                      width="75%"
                      bg="gray.300"
                      borderRadius="sm"
                    />
                    {/* Badges skeleton */}
                    <HStack gap={2}>
                      <Box
                        height="20px"
                        width="60px"
                        bg="gray.300"
                        borderRadius="full"
                      />
                      <Box
                        height="20px"
                        width="50px"
                        bg="gray.300"
                        borderRadius="full"
                      />
                    </HStack>
                    {/* Funding info skeleton */}
                    <Box
                      height="60px"
                      width="100%"
                      bg="gray.300"
                      borderRadius="md"
                    />
                  </VStack>
                )}
              </Box>
            );
          })}
        </VStack>
      </Container>
    );
  }

  if (companies.length === 0) {
    return (
      <Container p={4} h="100%" minH={0}>
        <Box
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          p={8}
          textAlign="center"
        >
          <VStack gap={4}>
            <Text fontSize="lg" color="gray.600">
              No companies found
            </Text>
            <Text fontSize="sm" color="gray.500">
              Try modifying your search criteria
            </Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container p={isSqueezed ? 2 : 4} h="100%" minH={0}>
      <VStack gap={4} align="stretch" h="100%">
        {/* Companies Grid */}
        <ScrollArea.Root flex="1" minH={0}>
          <ScrollArea.Viewport>
            <ScrollArea.Content w="100%" minW="0!important">
              {isSqueezed ? (
                <VStack gap={2} align="stretch" pb={4}>
                  {companies.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.1,
                          delay: index * 0.05,
                          ease: "easeOut",
                        },
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <CompanyCard
                        company={company}
                        position={index + 1}
                        currentPage={currentPage}
                        isSqueezed={expandedCardId !== company.id}
                        onClick={() => handleCardClick(company.id)}
                      />
                    </motion.div>
                  ))}
                </VStack>
              ) : (
                <VStack gap={4} align="stretch" pb={4}>
                  {companies.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.1,
                          delay: index * 0.05,
                          ease: "easeOut",
                        },
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <CompanyCard
                        company={company}
                        position={index + 1}
                        currentPage={currentPage}
                        isSqueezed={false}
                      />
                    </motion.div>
                  ))}
                </VStack>
              )}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
          isMobile
        />
      </VStack>
    </Container>
  );
}
