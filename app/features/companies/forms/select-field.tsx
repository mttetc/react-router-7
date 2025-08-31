import {
  Field,
  For,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useFormStatus } from "react-router";
import type { SelectFieldProps } from "./types";
import { debouncedSubmit } from "./utils";

export function SelectField({
  name,
  label,
  options,
  defaultValue = "",
  placeholder = "Select an option",
  disabled = false,
}: SelectFieldProps) {
  const { pending } = useFormStatus();

  const collection = createListCollection({
    items: options,
  });

  const handleValueChange = (details: { value: string[] }) => {
    // Update hidden input value
    const hiddenInput = document.querySelector(
      `input[name="${name}"]`
    ) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = details.value[0] || "";
      // Auto-submit form on change with debouncing
      debouncedSubmit(hiddenInput.form);
    }
  };

  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500">
        {label}
      </Field.Label>
      <Select.Root
        collection={collection}
        size="sm"
        value={defaultValue ? [defaultValue.toString()] : []}
        onValueChange={handleValueChange}
        disabled={disabled || pending}
      >
        {/* Hidden input for form submission */}
        <input
          type="hidden"
          name={name}
          defaultValue={defaultValue?.toString() || ""}
        />

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
