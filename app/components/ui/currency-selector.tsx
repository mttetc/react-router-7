"use client";

import {
  Button,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuSeparator,
  HStack,
  Text,
  Badge,
  VStack,
  For,
  createListCollection,
  Spinner,
} from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import { LuChevronDown, LuGlobe } from "react-icons/lu";
import { useEffect } from "react";
import { useCurrency } from "../../stores/currency.store";
import { getCurrencyName } from "../../utils/currency.utils";

const popularCurrencies = createListCollection({
  items: [
    { value: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { value: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
    { value: "GBP", label: "British Pound", symbol: "£", flag: "🇬🇧" },
    { value: "JPY", label: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { value: "CAD", label: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { value: "AUD", label: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { value: "CHF", label: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
    { value: "CNY", label: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  ],
});

const otherCurrencies = createListCollection({
  items: [
    { value: "KRW", label: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
    { value: "INR", label: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
    { value: "BRL", label: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
    { value: "MXN", label: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
    { value: "RUB", label: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
    { value: "TRY", label: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
    { value: "PLN", label: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
    { value: "SEK", label: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
    { value: "NOK", label: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
    { value: "DKK", label: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
    { value: "CZK", label: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
    { value: "HUF", label: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
    { value: "THB", label: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
    { value: "SGD", label: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
    { value: "HKD", label: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
    { value: "NZD", label: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
    { value: "ZAR", label: "South African Rand", symbol: "R", flag: "🇿🇦" },
    { value: "ILS", label: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
    { value: "SAR", label: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
    { value: "AED", label: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  ],
});

export function CurrencySelector() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    isAutoDetect,
    setIsAutoDetect,
    isHydrated,
    setHydrated,
  } = useCurrency();

  // Set hydrated state when component mounts
  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  const getCurrentCurrencyInfo = () => {
    const allCurrencies = [
      ...popularCurrencies.items,
      ...otherCurrencies.items,
    ];
    const currencyInfo = allCurrencies.find(
      (c) => c.value === selectedCurrency
    );
    return (
      currencyInfo || {
        value: selectedCurrency,
        label: getCurrencyName(selectedCurrency),
        symbol: selectedCurrency,
        flag: "💰",
      }
    );
  };

  const currentCurrency = getCurrentCurrencyInfo();

  // Show spinner while store is hydrating
  if (!isHydrated) {
    return (
      <Button
        variant="ghost"
        size="sm"
        rightIcon={<LuChevronDown />}
        leftIcon={<LuGlobe />}
        disabled
      >
        <HStack gap={1}>
          <Spinner size="xs" />
          <Text fontSize="sm" fontWeight="medium">
            Loading...
          </Text>
        </HStack>
      </Button>
    );
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<LuChevronDown />}
          leftIcon={<LuGlobe />}
        >
          <HStack gap={1}>
            <Text fontSize="sm">{currentCurrency.flag}</Text>
            <Text fontSize="sm" fontWeight="medium">
              {selectedCurrency}
            </Text>
            {isAutoDetect && (
              <Badge size="xs" colorPalette="blue" variant="surface">
                Auto
              </Badge>
            )}
          </HStack>
        </Button>
      </MenuTrigger>

      <MenuContent minW="280px">
        <VStack align="stretch" p={2} gap={2}>
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="medium">
              Auto-detect currency
            </Text>
            <Switch
              size="sm"
              checked={isAutoDetect}
              onCheckedChange={(e) => setIsAutoDetect(e.checked)}
            />
          </HStack>
          {isAutoDetect && (
            <Text fontSize="xs" color="gray.500">
              Currency is automatically detected from your browser locale
            </Text>
          )}
        </VStack>

        <MenuSeparator />

        <MenuItemGroup title="Popular Currencies">
          <For each={popularCurrencies.items}>
            {(currency) => (
              <MenuItem
                key={currency.value}
                value={currency.value}
                onClick={() => {
                  setSelectedCurrency(currency.value);
                  if (isAutoDetect) {
                    setIsAutoDetect(false);
                  }
                }}
                bg={selectedCurrency === currency.value ? "blue.50" : undefined}
              >
                <HStack gap={3} w="full">
                  <Text fontSize="lg">{currency.flag}</Text>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {currency.value}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {currency.label}
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="gray.400">
                    {currency.symbol}
                  </Text>
                </HStack>
              </MenuItem>
            )}
          </For>
        </MenuItemGroup>

        <MenuSeparator />

        <MenuItemGroup title="Other Currencies">
          <For each={otherCurrencies.items}>
            {(currency) => (
              <MenuItem
                key={currency.value}
                value={currency.value}
                onClick={() => {
                  setSelectedCurrency(currency.value);
                  if (isAutoDetect) {
                    setIsAutoDetect(false);
                  }
                }}
                bg={selectedCurrency === currency.value ? "blue.50" : undefined}
              >
                <HStack gap={3} w="full">
                  <Text fontSize="lg">{currency.flag}</Text>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {currency.value}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {currency.label}
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="gray.400">
                    {currency.symbol}
                  </Text>
                </HStack>
              </MenuItem>
            )}
          </For>
        </MenuItemGroup>
      </MenuContent>
    </MenuRoot>
  );
}
