/**
 * Unified filter field component
 * Handles both mobile and desktop variants to eliminate duplication
 */

import { useMemo } from "react";
import { Box, VStack } from "@chakra-ui/react";
import type { SelectFieldProps, SliderFieldProps } from "@/types/filters";
import { SelectField } from "../forms/select-field";
import { SliderField } from "../forms/slider-field";
import { FundingSliderField } from "../forms/funding-slider-field";
import { MobileSelectField } from "../forms/mobile/mobile-select-field";
import { MobileSliderField } from "../forms/mobile/mobile-slider-field";
import { MobileFundingSliderField } from "../forms/mobile/mobile-funding-slider-field";

export interface FilterFieldProps {
  variant?: "desktop" | "mobile";
  type: "select" | "slider" | "funding-slider";
  name: string;
  label: string;
  defaultValue?: string | number | null;
  disabled?: boolean;
  // Select-specific props
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  parser?: any; // nuqs parser
  // Slider-specific props
  min?: number;
  max?: number;
  minValue?: number | null;
  maxValue?: number | null;
  step?: number;
  currency?: string;
  // Event handlers
  onChange?: (value: any) => void;
}

export function FilterField({
  variant = "desktop",
  type,
  name,
  label,
  defaultValue,
  disabled,
  options,
  placeholder,
  parser,
  min,
  max,
  minValue,
  maxValue,
  step,
  currency,
  onChange,
}: FilterFieldProps) {
  const commonProps = useMemo(
    () => ({
      name,
      label,
      defaultValue,
      disabled,
      onChange,
    }),
    [name, label, defaultValue, disabled, onChange]
  );

  const renderField = () => {
    switch (type) {
      case "select":
        if (!options) {
          throw new Error("Select field requires options");
        }

        if (variant === "mobile") {
          return (
            <MobileSelectField
              {...commonProps}
              options={options}
              placeholder={placeholder || "Select an option"}
              value={defaultValue as string | null}
              onChange={onChange || (() => {})}
            />
          );
        }

        return (
          <SelectField
            {...commonProps}
            options={options}
            placeholder={placeholder}
            parser={parser}
          />
        );

      case "slider":
        if (min === undefined || max === undefined) {
          throw new Error("Slider field requires min and max values");
        }

        if (variant === "mobile") {
          return (
            <MobileSliderField
              {...commonProps}
              min={min}
              max={max}
              minValue={minValue || min}
              maxValue={maxValue || max}
              step={step}
              onMinChange={(value) => onChange?.({ min: value, max: maxValue })}
              onMaxChange={(value) => onChange?.({ min: minValue, max: value })}
            />
          );
        }

        return (
          <SliderField
            name={name}
            label={label}
            min={min}
            max={max}
            step={step}
            minName={`${name}Min`}
            maxName={`${name}Max`}
            disabled={disabled}
          />
        );

      case "funding-slider":
        if (min === undefined || max === undefined) {
          throw new Error("Funding slider field requires min and max values");
        }

        if (variant === "mobile") {
          return (
            <MobileFundingSliderField
              minValue={minValue || min}
              maxValue={maxValue || max}
              onMinChange={(value) => onChange?.({ min: value, max: maxValue })}
              onMaxChange={(value) => onChange?.({ min: minValue, max: value })}
            />
          );
        }

        return <FundingSliderField />;

      default:
        throw new Error(`Unknown field type: ${type}`);
    }
  };

  return <Box>{renderField()}</Box>;
}
