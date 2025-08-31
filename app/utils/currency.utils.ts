// Currency utilities for locale-based currency detection and conversion

// Map of locales to their primary currencies
const LOCALE_TO_CURRENCY: Record<string, string> = {
  // English locales
  "en-US": "USD",
  "en-CA": "CAD",
  "en-GB": "GBP",
  "en-AU": "AUD",
  "en-NZ": "NZD",
  "en-IE": "EUR",

  // European locales
  "fr-FR": "EUR",
  "de-DE": "EUR",
  "es-ES": "EUR",
  "it-IT": "EUR",
  "pt-PT": "EUR",
  "nl-NL": "EUR",
  "be-BE": "EUR",
  "at-AT": "EUR",
  "fi-FI": "EUR",
  "gr-GR": "EUR",

  // Other major currencies
  "ja-JP": "JPY",
  "ko-KR": "KRW",
  "zh-CN": "CNY",
  "zh-TW": "TWD",
  "zh-HK": "HKD",
  "ru-RU": "RUB",
  "pl-PL": "PLN",
  "cz-CZ": "CZK",
  "hu-HU": "HUF",
  "tr-TR": "TRY",
  "br-BR": "BRL",
  "pt-BR": "BRL",
  "mx-MX": "MXN",
  "ar-SA": "SAR",
  "he-IL": "ILS",
  "th-TH": "THB",
  "id-ID": "IDR",
  "my-MY": "MYR",
  "sg-SG": "SGD",
  "ph-PH": "PHP",
  "vn-VN": "VND",
  "in-IN": "INR",
  "pk-PK": "PKR",
  "bd-BD": "BDT",
  "lk-LK": "LKR",
  "np-NP": "NPR",
  "ch-CH": "CHF",
  "no-NO": "NOK",
  "se-SE": "SEK",
  "dk-DK": "DKK",
  "is-IS": "ISK",
};

// Fallback currency mappings based on language code only
const LANGUAGE_TO_CURRENCY: Record<string, string> = {
  en: "USD", // Default to USD for English
  fr: "EUR",
  de: "EUR",
  es: "EUR",
  it: "EUR",
  pt: "EUR",
  nl: "EUR",
  ja: "JPY",
  ko: "KRW",
  zh: "CNY",
  ru: "RUB",
  pl: "PLN",
  tr: "TRY",
  ar: "SAR",
  he: "ILS",
  th: "THB",
  id: "IDR",
  my: "MYR",
  vi: "VND",
  hi: "INR",
  bn: "BDT",
  ur: "PKR",
};

/**
 * Get the appropriate currency code based on the user's locale
 */
export function getCurrencyFromLocale(locale: string): string {
  // Try exact locale match first
  if (LOCALE_TO_CURRENCY[locale]) {
    return LOCALE_TO_CURRENCY[locale];
  }

  // Try language code only
  const languageCode = locale.split("-")[0];
  if (LANGUAGE_TO_CURRENCY[languageCode]) {
    return LANGUAGE_TO_CURRENCY[languageCode];
  }

  // Default fallback
  return "USD";
}

/**
 * Simple exchange rates (in a real app, this would come from an API)
 * All rates are relative to USD
 */
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  KRW: 1180.0,
  INR: 74.5,
  BRL: 5.2,
  MXN: 20.1,
  RUB: 73.5,
  TRY: 8.5,
  PLN: 3.8,
  SEK: 8.6,
  NOK: 8.5,
  DKK: 6.3,
  CZK: 21.5,
  HUF: 295.0,
  THB: 31.5,
  SGD: 1.35,
  HKD: 7.8,
  NZD: 1.42,
  ZAR: 14.2,
  ILS: 3.2,
  SAR: 3.75,
  AED: 3.67,
  MYR: 4.1,
  IDR: 14250.0,
  PHP: 49.5,
  VND: 22800.0,
  TWD: 27.8,
  PKR: 155.0,
  BDT: 84.5,
  LKR: 180.0,
  NPR: 119.0,
  ISK: 125.0,
};

/**
 * Convert amount from USD to target currency
 */
export function convertCurrency(
  amountUSD: number,
  targetCurrency: string
): number {
  const rate = EXCHANGE_RATES[targetCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for currency: ${targetCurrency}`);
    return amountUSD; // Return original amount if rate not found
  }
  return amountUSD * rate;
}

/**
 * Convert amount from any currency to USD
 */
export function convertToUSD(amount: number, fromCurrency: string): number {
  const rate = EXCHANGE_RATES[fromCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for currency: ${fromCurrency}`);
    return amount; // Return original amount if rate not found
  }
  return amount / rate;
}

/**
 * Get a user-friendly currency name
 */
export function getCurrencyName(currencyCode: string): string {
  const currencyNames: Record<string, string> = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    KRW: "South Korean Won",
    INR: "Indian Rupee",
    BRL: "Brazilian Real",
    MXN: "Mexican Peso",
    RUB: "Russian Ruble",
    TRY: "Turkish Lira",
    PLN: "Polish Złoty",
    SEK: "Swedish Krona",
    NOK: "Norwegian Krone",
    DKK: "Danish Krone",
    CZK: "Czech Koruna",
    HUF: "Hungarian Forint",
    THB: "Thai Baht",
    SGD: "Singapore Dollar",
    HKD: "Hong Kong Dollar",
    NZD: "New Zealand Dollar",
    ZAR: "South African Rand",
    ILS: "Israeli Shekel",
    SAR: "Saudi Riyal",
    AED: "UAE Dirham",
    MYR: "Malaysian Ringgit",
    IDR: "Indonesian Rupiah",
    PHP: "Philippine Peso",
    VND: "Vietnamese Dong",
    TWD: "Taiwan Dollar",
    PKR: "Pakistani Rupee",
    BDT: "Bangladeshi Taka",
    LKR: "Sri Lankan Rupee",
    NPR: "Nepalese Rupee",
    ISK: "Icelandic Króna",
  };

  return currencyNames[currencyCode] || currencyCode;
}

/**
 * Hook to get currency information based on current locale
 */
export function useCurrency(locale: string) {
  const currency = getCurrencyFromLocale(locale);
  const currencyName = getCurrencyName(currency);

  const convertFromUSD = (amountUSD: number) =>
    convertCurrency(amountUSD, currency);
  const formatAmount = (amountUSD: number) => convertFromUSD(amountUSD);

  return {
    currency,
    currencyName,
    convertFromUSD,
    formatAmount,
  };
}

/**
 * Convert filter values from user's currency to USD for API calls
 */
export function convertFilterToUSD(
  amount: number | null,
  fromCurrency: string
): number | null {
  if (!amount) return null;
  return convertToUSD(amount, fromCurrency);
}

/**
 * Convert filter values from USD to user's currency for display
 */
export function convertFilterFromUSD(
  amount: number | null,
  toCurrency: string
): number | null {
  if (!amount) return null;
  return convertCurrency(amount, toCurrency);
}

/**
 * Get the current user's currency based on context or locale
 */
export function getCurrentUserCurrency(): string {
  if (typeof window !== "undefined" && window.navigator) {
    return getCurrencyFromLocale(window.navigator.language || "en-US");
  }
  return "USD";
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF",
    CNY: "¥",
    KRW: "₩",
    INR: "₹",
    BRL: "R$",
    MXN: "$",
    RUB: "₽",
    TRY: "₺",
    PLN: "zł",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    CZK: "Kč",
    HUF: "Ft",
    THB: "฿",
    SGD: "S$",
    HKD: "HK$",
    NZD: "NZ$",
    ZAR: "R",
    ILS: "₪",
    SAR: "﷼",
    AED: "د.إ",
    MYR: "RM",
    IDR: "Rp",
    PHP: "₱",
    VND: "₫",
    TWD: "NT$",
    PKR: "₨",
    BDT: "৳",
    LKR: "Rs",
    NPR: "Rs",
    ISK: "kr",
  };
  
  return currencySymbols[currencyCode] || currencyCode;
}
