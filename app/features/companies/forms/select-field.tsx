import {
  Field,
  For,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import type { SelectFieldProps } from "./types";
import { useFilterState } from "~/hooks/use-filter-state";

export function SelectField({
  name,
  label,
  options,
  defaultValue = "",
  placeholder = "Select an option",
  disabled = false,
}: SelectFieldProps) {
  const { filters, updateFilters } = useFilterState();

  const collection = createListCollection({
    items: options,
  });

  // Get current value from nuqs state
  const currentValue = (filters as any)[name] || "";

  const handleValueChange = async (details: { value: string[] }) => {
    const newValue = details.value[0] || "";
    await updateFilters({
      [name]: newValue,
    } as Partial<typeof filters>);
  };

  const fieldId = `select-${name}`;

  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500" htmlFor={fieldId}>
        {label}
      </Field.Label>
      <Select.Root
        id={fieldId}
        collection={collection}
        size="sm"
        value={currentValue ? [currentValue.toString()] : []}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              <For each={collection.items}>
                {(item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Field.ErrorText />
    </Field.Root>
  );
}
