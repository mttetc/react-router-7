import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  {
    ignores: [
      "build/**",
      "node_modules/**",
      "dist/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Response: "readonly",
        Event: "readonly",
        history: "readonly",
        location: "readonly",
        setTimeout: "readonly",
        process: "readonly",
        structuredClone: "readonly",
        // Node globals
        __dirname: "readonly",
        __filename: "readonly",
        // React DevTools
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
        // Additional globals
        React: "readonly",
        global: "readonly",
        navigator: "readonly",
        Headers: "readonly",
        HeadersInit: "readonly",
        HTMLElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLTableCellElement: "readonly",
        HTMLInputElement: "readonly",
        PromiseRejectionEvent: "readonly",
        ErrorEvent: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React rules
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off", // Using TypeScript
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // General rules
      "no-unused-vars": "off", // Using TypeScript version instead
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // Import rules
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.test.{ts,tsx,js,jsx}", "**/__tests__/**/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
];
