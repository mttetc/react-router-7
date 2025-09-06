import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "rooks";

interface UseSyncStateOptions<T> {
  /** Initial value */
  initialValue: T;
  /** External value to sync with */
  externalValue: T;
  /** Callback to sync local changes to external state */
  onSync: (value: T) => void;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Custom equality function to compare values (default: Object.is) */
  isEqual?: (a: T, b: T) => boolean;
}

/**
 * A hook that manages temporary local state that syncs with external state.
 * Perfect for form inputs, sliders, etc. that need immediate UI feedback
 * but debounced persistence.
 *
 * @example
 * ```typescript
 * const [localValue, setLocalValue] = useSyncState({
 *   initialValue: 0,
 *   externalValue: filters.minFunding || 0,
 *   onSync: (value) => updateFilter('minFunding', value),
 *   debounceMs: 300
 * });
 * ```
 */
export function useSyncState<T>({
  initialValue,
  externalValue,
  onSync,
  debounceMs = 300,
  isEqual = Object.is,
}: UseSyncStateOptions<T>) {
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState<T>(initialValue);

  // Track if we're currently syncing to avoid infinite loops
  const isSyncingRef = useRef(false);

  // Track previous external value to detect changes
  const prevExternalValueRef = useRef<T>(initialValue);

  // Update local state when external value changes (from other sources)
  useEffect(() => {
    if (
      !isSyncingRef.current &&
      !isEqual(prevExternalValueRef.current, externalValue)
    ) {
      setLocalValue(externalValue);
      prevExternalValueRef.current = externalValue;
    }
  }, [externalValue, isEqual]);

  // Debounced sync function
  const syncToExternal = useCallback(
    (value: T) => {
      isSyncingRef.current = true;
      onSync(value);
      // Reset sync flag after a brief delay to allow external state to update
      setTimeout(() => {
        isSyncingRef.current = false;
        // Update the ref to the synced value to prevent unnecessary updates
        prevExternalValueRef.current = value;
      }, 50);
    },
    [onSync]
  );

  const debouncedSync = useDebounce(syncToExternal, debounceMs);

  // Enhanced setter that updates local state immediately and syncs with debounce
  const setValueAndSync = useCallback(
    (value: T | ((prev: T) => T)) => {
      const newValue =
        typeof value === "function"
          ? (value as (prev: T) => T)(localValue)
          : value;

      // Update local state immediately for smooth UI
      setLocalValue(newValue);

      // Sync to external state with debounce
      debouncedSync(newValue);
    },
    [localValue, debouncedSync]
  );

  // Force immediate sync (useful for form submissions, etc.)
  const syncImmediately = useCallback(() => {
    syncToExternal(localValue);
  }, [localValue, syncToExternal]);

  return [localValue, setValueAndSync, { syncImmediately }] as const;
}

/**
 * Specialized version for array values (like slider ranges)
 */
export function useSyncArrayState<T extends readonly unknown[]>({
  initialValue,
  externalValue,
  onSync,
  debounceMs = 300,
  isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b),
}: UseSyncStateOptions<T>) {
  return useSyncState({
    initialValue,
    externalValue,
    onSync,
    debounceMs,
    isEqual,
  });
}

/**
 * Specialized version for number values with optional precision handling
 */
export function useSyncNumberState({
  initialValue,
  externalValue,
  onSync,
  debounceMs = 300,
  precision,
}: Omit<UseSyncStateOptions<number>, "isEqual"> & {
  /** Number of decimal places for comparison (optional) */
  precision?: number;
}) {
  const isEqual = useCallback(
    (a: number, b: number) => {
      if (precision !== undefined) {
        return Math.abs(a - b) < Math.pow(10, -precision);
      }
      return Object.is(a, b);
    },
    [precision]
  );

  return useSyncState({
    initialValue,
    externalValue,
    onSync,
    debounceMs,
    isEqual,
  });
}
