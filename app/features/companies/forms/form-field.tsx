import { Field, Input } from "@chakra-ui/react";
import { useFormStatus } from "react-router";
import type { FormFieldProps } from "./types";
import { debouncedSubmit } from "./utils";

interface ExtendedFormFieldProps extends Omit<FormFieldProps, "label"> {
  label: React.ReactNode;
}

export function FormField({
  name,
  label,
  defaultValue = "",
  disabled = false,
  ...props
}: ExtendedFormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { pending } = useFormStatus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-submit form on change with debouncing
    debouncedSubmit(e.target.form);
  };

  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="semibold" color="gray.600">
        {label}
      </Field.Label>
      <Input
        name={name}
        defaultValue={defaultValue?.toString() || ""}
        disabled={disabled || pending}
        onChange={handleChange}
        borderRadius="md"
        size="sm"
        {...props}
      />
      <Field.ErrorText />
    </Field.Root>
  );
}
