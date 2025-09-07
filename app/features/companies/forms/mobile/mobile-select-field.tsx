import { useState } from "react";
import {
  Box,
  Button,
  Collapsible,
  HStack,
  Icon,
  Text,
  VStack,
  For,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useSyncState } from "@/hooks/use-sync-state";

interface SelectOption {
  value: string;
  label: string;
}

interface MobileSelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export function MobileSelectField({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
}: MobileSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    if (optionValue === value) {
      // Deselect if already selected
      onChange(null);
    } else {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <Box>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        width="full"
        justifyContent="space-between"
        colorPalette={value ? "purple" : "gray"}
      >
        <Text fontSize="sm">
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon size="xs">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</Icon>
      </Button>

      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <Box
            mt={2}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="white"
            shadow="sm"
          >
            <VStack gap={0} align="stretch">
              <For each={options}>
                {(option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    colorPalette={option.value === value ? "purple" : "gray"}
                    onClick={() => handleSelect(option.value)}
                    borderRadius={0}
                    _first={{ borderTopRadius: "md" }}
                    _last={{ borderBottomRadius: "md" }}
                  >
                    <HStack gap={2}>
                      <Text fontSize="sm">{option.label}</Text>
                      {option.value === value && (
                        <Text fontSize="xs" color="purple.600">
                          ✓
                        </Text>
                      )}
                    </HStack>
                  </Button>
                )}
              </For>
            </VStack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
