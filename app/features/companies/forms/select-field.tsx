import {
  Field,
  For,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import type { SelectFieldProps } from "@/types/common";

export function SelectField({
  name,
  label,
  options,
  placeholder = "Select an option",
  disabled = false,
  parser,
}: SelectFieldProps) {
  const [currentValue, setCurrentValue] = useQueryState(name, parser);
  const [, setPage] = useQueryState("page");

  const collection = createListCollection({
    items: options,
  });

  const handleValueChange = (details: { value: string[] }) => {
    const newValue = details.value[0] || "";
    setPage("1"); // Reset page to 1 when filter changes
    setCurrentValue(newValue || null);
  };

  const fieldId = `select-${name}`;

  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500" htmlFor={fieldId}>
        {label}
      </Field.Label>
      <Select.Root
        collection={collection}
        size="sm"
        value={currentValue ? [currentValue.toString()] : []}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <Select.HiddenSelect id={fieldId} />
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
              <For
                each={
                  collection.items as Array<{ value: string; label: string }>
                }
              >
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
