import { Box, Card, HStack, Separator, Stack, Text } from "@chakra-ui/react";
import { Form, useActionState } from "react-router";
import { FaSearch } from "react-icons/fa";
import { useColorModeValue } from "../../../../components/ui/color-mode";
import { ClientOnly } from "../../../../components/ui/client-only";
import type { FilterState } from "../../../../services/companies.service";
import { FormField } from "./form-field";
import { SelectField } from "./select-field";
import { SliderField } from "./slider-field";
import { FundingSliderField } from "./funding-slider-field";
import { filtersToFormData } from "./utils";
import type { FormState } from "./types";

// Data for select options
const growthStageOptions = [
  { value: "early", label: "🌱 Early" },
  { value: "seed", label: "🌿 Seed" },
  { value: "growing", label: "🌳 Growing" },
  { value: "late", label: "🏢 Late" },
  { value: "exit", label: "🚀 Exit" },
];

const customerFocusOptions = [
  { value: "b2b", label: "🏢 B2B" },
  { value: "b2c", label: "👥 B2C" },
  { value: "b2b_b2c", label: "🔄 B2B & B2C" },
  { value: "b2c_b2b", label: "🔄 B2C & B2B" },
];

const fundingTypeOptions = [
  { value: "Seed", label: "🌱 Seed" },
  { value: "Series A", label: "🅰️ Series A" },
  { value: "Series B", label: "🅱️ Series B" },
  { value: "Series C", label: "©️ Series C" },
  { value: "Angel", label: "👼 Angel" },
  { value: "Convertible Note", label: "📝 Convertible Note" },
  { value: "Undisclosed", label: "🤐 Undisclosed" },
];

interface FilterFormProps {
  filters: FilterState;
  action: string;
}

export function FilterForm({ filters, action }: FilterFormProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [state, formAction] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // This will be handled by the route action
      return prevState;
    },
    { errors: {} }
  );

  const formData = filtersToFormData(filters);

  return (
    <Card.Root
      bg={bgColor}
      borderColor={borderColor}
      borderWidth={1}
      borderRadius="lg"
      shadow="sm"
      width="280px"
      position="sticky"
      top="32px"
    >
      <Card.Body>
        <Form method="post" action={action}>
          <Stack gap={6}>
            {/* Search */}
            <FormField
              name="search"
              label={
                <HStack gap={2}>
                  <FaSearch />
                  <Text>Search</Text>
                </HStack>
              }
              placeholder="Search companies, domains, descriptions..."
              defaultValue={formData.search}
              textOverflow="ellipsis"
            />

            <Separator />

            {/* Categories */}
            <Box>
              <Stack gap={4}>
                <SelectField
                  name="growthStage"
                  label="Growth Stage"
                  options={growthStageOptions}
                  placeholder="All stages"
                  defaultValue={formData.growthStage}
                />

                <SelectField
                  name="customerFocus"
                  label="Customer Focus"
                  options={customerFocusOptions}
                  placeholder="All customer types"
                  defaultValue={formData.customerFocus}
                />

                <SelectField
                  name="fundingType"
                  label="Funding Type"
                  options={fundingTypeOptions}
                  placeholder="All funding types"
                  defaultValue={formData.fundingType}
                />
              </Stack>
            </Box>

            <Separator />

            {/* Ranges */}
            <Box>
              <Stack gap={4}>
                <SliderField
                  name="rankRange"
                  label="Rank Range"
                  min={1}
                  max={10000}
                  minName="minRank"
                  maxName="maxRank"
                  minDefaultValue={filters.minRank || 1}
                  maxDefaultValue={filters.maxRank || 10000}
                />

                <ClientOnly
                  fallback={
                    <SliderField
                      name="fundingRange"
                      label="Funding Amount (USD)"
                      min={0}
                      max={100000000}
                      step={100000}
                      minName="minFunding"
                      maxName="maxFunding"
                      minDefaultValue={filters.minFunding || 0}
                      maxDefaultValue={filters.maxFunding || 100000000}
                      currency="USD"
                    />
                  }
                >
                  <FundingSliderField filters={filters} />
                </ClientOnly>
              </Stack>
            </Box>
          </Stack>
        </Form>
      </Card.Body>
    </Card.Root>
  );
}
