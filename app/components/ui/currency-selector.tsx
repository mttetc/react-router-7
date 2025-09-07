"use client";

import {
  Button,
  Menu,
  Portal,
  HStack,
  Text,
  VStack,
  For,
  createListCollection,
  Input,
} from "@chakra-ui/react";

import { LuChevronDown, LuGlobe } from "react-icons/lu";
import { useState, useMemo } from "react";
import { useCurrencyStore } from "@/stores/currency.store";
import { getCurrencyName } from "@/utils/currency-utils";
import { toaster } from "./toaster";

// Most popular currencies (top 4)
const popularCurrencies = [
  { value: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { value: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
  { value: "GBP", label: "British Pound", symbol: "£", flag: "🇬🇧" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
];

// All other currencies
const allOtherCurrencies = [
  { value: "CAD", label: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { value: "CHF", label: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
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
];

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore(
    (state) => ({
      selectedCurrency: state.selectedCurrency,
      setSelectedCurrency: state.setSelectedCurrency,
    })
  );

  const [searchQuery, setSearchQuery] = useState("");

  const getCurrentCurrencyInfo = () => {
    const allCurrencies = [...popularCurrencies, ...allOtherCurrencies];
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

  // Filter currencies based on search query
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) {
      return {
        popular: popularCurrencies,
        others: allOtherCurrencies,
        showPopularSection: true,
      };
    }

    const query = searchQuery.toLowerCase();
    const allCurrencies = [...popularCurrencies, ...allOtherCurrencies];
    const filtered = allCurrencies.filter(
      (currency) =>
        currency.value.toLowerCase().includes(query) ||
        currency.label.toLowerCase().includes(query) ||
        currency.symbol.toLowerCase().includes(query)
    );

    return {
      popular: [],
      others: filtered,
      showPopularSection: false,
    };
  }, [searchQuery]);

  const currentCurrency = getCurrentCurrencyInfo();

  // Handle currency selection with toast notification
  const handleCurrencySelect = (currency: {
    value: string;
    label: string;
    symbol: string;
  }) => {
    setSelectedCurrency(currency.value);
    setSearchQuery(""); // Clear search when currency is selected
    toaster.create({
      title: "Currency Updated",
      description: `Switched to ${currency.label} (${currency.symbol})`,
      type: "success",
      duration: 3000,
    });
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          _focus={{
            borderColor: "purple.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
          }}
        >
          <HStack gap={1}>
            <Text fontSize="sm">{currentCurrency.flag}</Text>
            <Text fontSize="sm" fontWeight="medium">
              {selectedCurrency}
            </Text>
          </HStack>
          <LuChevronDown />
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="280px" maxH="400px" overflowY="auto">
            <VStack align="stretch" p={3} gap={3}>
              <Input
                id="currency-search-input"
                name="currency-search"
                placeholder="Search currencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                _focus={{ outline: "none", boxShadow: "none" }}
                aria-label="Search currencies"
              />
            </VStack>

            <Menu.Separator />

            {filteredCurrencies.showPopularSection && (
              <>
                <Menu.ItemGroup>
                  <Menu.ItemGroupLabel>Popular Currencies</Menu.ItemGroupLabel>
                  <For each={filteredCurrencies.popular}>
                    {(currency) => (
                      <Menu.Item
                        key={currency.value}
                        value={currency.value}
                        onClick={() => handleCurrencySelect(currency)}
                        bg={
                          selectedCurrency === currency.value
                            ? "blue.50"
                            : undefined
                        }
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
                      </Menu.Item>
                    )}
                  </For>
                </Menu.ItemGroup>

                <Menu.Separator />
              </>
            )}

            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>
                {filteredCurrencies.showPopularSection
                  ? "Other Currencies"
                  : "Search Results"}
              </Menu.ItemGroupLabel>
              <For each={filteredCurrencies.others}>
                {(currency) => (
                  <Menu.Item
                    key={currency.value}
                    value={currency.value}
                    onClick={() => handleCurrencySelect(currency)}
                    bg={
                      selectedCurrency === currency.value
                        ? "blue.50"
                        : undefined
                    }
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
                  </Menu.Item>
                )}
              </For>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
