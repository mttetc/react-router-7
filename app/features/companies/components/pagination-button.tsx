"use client";

import { IconButton } from "@chakra-ui/react";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useRef } from "react";

interface PaginationButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  ariaLabel: string;
  [key: string]: any;
}

/**
 * Custom pagination button using React Aria
 */
export function PaginationButton({
  children,
  onPress,
  isDisabled = false,
  isSelected = false,
  ariaLabel,
  ...props
}: PaginationButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton(
    {
      onPress,
      isDisabled,
      "aria-label": ariaLabel,
      "aria-current": isSelected ? "page" : undefined,
    },
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <IconButton
      ref={ref}
      {...buttonProps}
      {...focusProps}
      {...props}
      variant={isSelected ? "solid" : "outline"}
      disabled={isDisabled}
      _focus={{
        outline: isFocusVisible
          ? "2px solid var(--chakra-colors-purple-500)"
          : "none",
        outlineOffset: "2px",
      }}
      _active={{ bg: isPressed ? "purple.200" : undefined }}
      aria-current={isSelected ? "page" : undefined}
    >
      {children}
    </IconButton>
  );
}
