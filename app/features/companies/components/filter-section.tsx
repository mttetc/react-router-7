/**
 * Unified filter section component
 * Provides consistent layout and behavior for all filter sections
 */

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Collapsible,
  HStack,
  Icon,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp, FaCog } from "react-icons/fa";
import { useLandmark } from "@react-aria/landmark";

export interface FilterSectionProps {
  title: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
  className?: string;
}

export function FilterSection({
  title,
  icon,
  collapsible = false,
  defaultOpen = false,
  children,
  variant = "desktop",
  className,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { landmarkProps } = useLandmark(
    {
      role: "region",
      "aria-label": title,
    },
    sectionRef
  );

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  const headerContent = (
    <HStack justify="space-between" align="center" w="full">
      <HStack gap={2} align="center">
        {icon && <Icon>{icon}</Icon>}
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {title}
        </Text>
      </HStack>
      {collapsible && (
        <Icon
          color="gray.500"
          transition="transform 0.2s"
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </Icon>
      )}
    </HStack>
  );

  const header = collapsible ? (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleOpen}
      w="full"
      justifyContent="flex-start"
      p={2}
      h="auto"
      minH="auto"
      _hover={{ bg: "gray.50" }}
    >
      {headerContent}
    </Button>
  ) : (
    <Box p={2}>{headerContent}</Box>
  );

  const content = <Box p={collapsible ? 0 : 2}>{children}</Box>;

  return (
    <Box
      ref={sectionRef}
      {...landmarkProps}
      className={className}
      borderWidth={variant === "desktop" ? 1 : 0}
      borderColor="gray.200"
      borderRadius={variant === "desktop" ? "md" : 0}
      bg={variant === "desktop" ? "white" : "transparent"}
      shadow={variant === "desktop" ? "sm" : "none"}
    >
      <Stack gap={0}>
        {header}
        {collapsible ? (
          <Collapsible.Root open={isOpen}>
            <Collapsible.Content>{content}</Collapsible.Content>
          </Collapsible.Root>
        ) : (
          content
        )}
      </Stack>
    </Box>
  );
}

// Specialized sections for common use cases
export function DetailedFiltersSection({
  children,
  variant = "desktop",
  defaultOpen = false,
}: {
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
  defaultOpen?: boolean;
}) {
  return (
    <FilterSection
      title="Detailed Filters"
      icon={<FaCog />}
      collapsible
      defaultOpen={defaultOpen}
      variant={variant}
    >
      {children}
    </FilterSection>
  );
}

export function QuickFiltersSection({
  children,
  variant = "desktop",
}: {
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
}) {
  return (
    <FilterSection title="Quick Filters" variant={variant}>
      {children}
    </FilterSection>
  );
}

export function ActiveFiltersSection({
  children,
  variant = "desktop",
}: {
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
}) {
  return (
    <FilterSection title="Active Filters" variant={variant}>
      {children}
    </FilterSection>
  );
}
