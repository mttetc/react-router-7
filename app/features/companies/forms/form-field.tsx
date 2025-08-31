import { Field, Input } from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import { useState, useCallback } from "react";
import type { FormFieldProps } from "./types";
import { useDebounce } from "rooks";

interface ExtendedFormFieldProps extends Omit<FormFieldProps, "label"> {
  label: React.ReactNode;
}

export function FormField({
  name,
  label,
  defaultValue = "",
  disabled = false,
  size,
  ...props
}: ExtendedFormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { pending } = useFormStatus();
  const [inputValue, setInputValue] = useState(defaultValue?.toString() || "");

  const submitForm = useCallback((form: HTMLFormElement | null) => {
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const debouncedSubmit = useDebounce(submitForm, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSubmit(e.target.form);
  };

  const fieldId = `input-${name}`;

  return (
    <Field.Root>
      <Field.Label
        fontSize="sm"
        fontWeight="semibold"
        color="gray.600"
        htmlFor={fieldId}
      >
        {label}
      </Field.Label>
      <Input
        id={fieldId}
        name={name}
        value={inputValue}
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
