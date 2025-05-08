import type { ChakraTheme } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

// Generating a new colour pallette?
// https://palette.saas-ui.dev/

const extension: Partial<ChakraTheme> = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        color: "text",
        transitionProperty: "none",
        _dark: {
          bg: "black",
        },
        a: {
          _focus: {
            boxShadow: "none",
          },
          _focusVisible: {
            outline: "-webkit-focus-ring-color auto 1px",
            outlineOffset: "1px",
          },
        },
      },
    },
  },
  fontSizes: {
    "xx-small": "0.68rem",
    // xs: "0.82rem",
  },
  colors: {
    black: "#111317",
    gray: {
      50: "#f9fafa",
      100: "#f0f1f3",
      200: "#e6e7eb",
      300: "#d1d4da",
      400: "#aaadb2",
      500: "#7d7f82",
      600: "#535457",
      700: "#363738",
      800: "#1f2021",
      900: "#19191a",
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    // yellow: {
    //   50: "#FFF8E1",
    //   100: "#FFECB3",
    //   200: "#FFE082",
    //   300: "#FFD54F",
    //   400: "#FFCA28",
    //   500: "#FFC107",
    //   600: "#FFB300",
    //   700: "#FFA000",
    //   800: "#FF8F00",
    //   900: "#FF6F00",
    // },
    yellow: {
      50: "#FFFAEA",
      100: "#FFE082",
      200: "#FFD54F",
      300: "#FFCA28",
      400: "#FFC107",
      500: "#FFB300",
      600: "#FFA000",
      700: "#FF8F00",
      800: "#FF6F00",
      900: "#DD4F00",
    },
    teal: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    green: {
      50: "#e6f6ed",
      100: "#c2e7d3",
      200: "#9bd8b7",
      300: "#71ca9c",
      400: "#4fbe87",
      500: "#25b272",
      600: "#1ea367",
      700: "#16915a",
      800: "#107f4e",
      900: "#096039",
    },
    purple: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },
    brand: {
      50: "#f6f7ff",
      100: "#dadfff",
      200: "#b9c2ff",
      300: "#909fff",
      400: "#798bff",
      500: "#586eff",
      600: "#4459e8",
      700: "#3747bb",
      800: "#2e3d9e",
      900: "#212c72",
    },
    brandDark: {
      50: "#93a0c2",
      100: "#6c7ba3",
      200: "#576895",
      300: "#46588a",
      400: "#3e5286",
      500: "#324981",
      600: "#273655",
      700: "#1f2b41",
      800: "#1a2437",
      900: "#131c29",
    },
    success: "#49D0A8",
    warning: "#FA8F64",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  components: {
    Link: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
        _focusVisible: {
          outline: "-webkit-focus-ring-color auto 1px",
          outlineOffset: "1px",
        },
      },
    },
    Button: {
      defaultProps: {
        size: "sm",
      },
      sizes: {
        xs: {
          borderRadius: "md",
          fontSize: "xx-small",
        },
        sm: {
          fontSize: "xs",
          borderRadius: "lg",
          px: 3,
        },
      },
      variants: {
        outline: {
          shadow: "sm",
          bgColor: "white",
        },
        dashed: {
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "gray.200",
          bgColor: "gray.50",
          _hover: {
            bgColor: "gray.100",
          },
        },
      },
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
        _focusVisible: {
          outline: "-webkit-focus-ring-color auto 1px",
          outlineOffset: "1px",
        },
      },
    },
    ButtonGroup: {
      defaultProps: {
        spacing: 0,
      },
    },
    Modal: {
      defaultProps: {
        motionPreset: "slideInBottom",
        closeButton: {
          size: "xs",
        },
      },
      baseStyle: {
        overlay: {
          background: "rgba(255, 255, 255, 0.7)",
        },
        dialog: {
          overflow: "hidden",
          rounded: "xl",
          borderWidth: 1,
        },
        closeButton: {
          top: 1.5,
          right: 1.5,
          borderRadius: "full",
          _focus: {
            boxShadow: "none",
          },
        },
        body: {
          py: 5,
        },
        header: {
          fontWeight: "medium",
          fontSize: "xs",
          borderBottomWidth: 1,
          borderColor: "gray.100",
          py: 3,
        },
        footer: {
          borderTopWidth: 1,
          bg: "gray.50",
          px: 5,
          py: 3,
        },
      },
    },
    Kbd: {
      baseStyle: {
        bgColor: "gray.50",
        borderColor: "gray.100",
        fontSize: "xs",
        borderBottomWidth: 1,
        px: 0,
        boxSize: 5,
        color: "gray.500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    Drawer: {
      sizes: {
        "2xl": { dialog: { maxW: "5xl" } },
      },
      baseStyle: {
        overlay: {
          background: "rgba(255, 255, 255, 0.7)",
        },
        dialog: {
          m: 2,
          rounded: "xl",
          overflow: "hidden",
          borderWidth: 1,
        },
        closeButton: {
          borderRadius: "full",
          _focus: {
            boxShadow: "none",
          },
        },
        header: {
          fontWeight: "medium",
          fontSize: "xs",
          borderBottomWidth: 1,
          borderColor: "gray.100",
          py: 3,
        },
        footer: {
          borderTopWidth: 1,
          bg: "gray.50",
          px: 5,
          py: 3,
        },
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
      },
      variants: {
        outline: {
          field: {
            borderRadius: "md",
            shadow: "sm",
            borderWidth: 1,
            _disabled: {
              color: "gray.700",
            },
            bgGradient: "linear(to-b, white, gray.50)",
          },
        },
        unstyled: {
          icon: {
            opacity: 0,
          },
        },
      },
    },
    Input: {
      defaultProps: {
        size: "sm",
      },
      variants: {
        filled: {
          field: {
            bgColor: "white",
            borderRadius: "lg",
            borderWidth: 1,
            _focus: {
              boxShadow: "none !important",
              borderColor: "brand.500",
            },
          },
        },
        flushed: {
          field: {
            borderColor: "gray.100",
            _focus: {
              borderColor: "brand.500",
              boxShadow: "none",
            },
          },
        },
        outline: {
          field: {
            bgColor: "white",
            borderRadius: "lg",
            _focus: {
              boxShadow: "none !important",
              borderColor: "brand.500",
            },
          },
        },
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          _focus: {
            boxShadow: "none",
            outline: "none",
          },
        },
      },
      sizes: {
        xs: {
          tab: {
            px: 4,
            py: 1,
            fontSize: "xs",
          },
        },
      },
      variants: {
        line: {
          tablist: {
            borderBottom: "1px solid",
            borderColor: "gray.100",
            mb: "-1px",
            gap: 4,
          },
          tab: {
            borderBottom: "1px solid",
            mb: "-1px",
            py: 2,
            px: 0,
            fontWeight: "medium",
            color: "gray.500",
          },
        },
        "solid-rounded": {
          tablist: {
            gap: 1,
          },
          tab: {
            rounded: "md",
            px: 2,
            _selected: {
              color: "brand.500",
              bgColor: "brand.50",
            },
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        size: "sm",
      },
      baseStyle: {
        borderRadius: "lg",
        maxH: "220px",
      },
      variants: {
        outline: {
          borderRadius: "lg",
        },
      },
    },
    Radio: {
      defaultProps: {
        size: "sm",
      },
    },
    Progress: {
      defaultProps: {
        size: "sm",
      },
      baseStyle: {
        track: {
          borderRadius: "sm",
        },
      },
      variants: {
        light(props) {
          return {
            filledTrack: {
              bgColor: props.colorScheme + ".300",
            },
          };
        },
      },
    },
    NumberInput: {
      defaultProps: {
        size: "sm",
      },
      variants: {
        filled: {
          field: {
            bgColor: "white",
            borderRadius: "lg",
            _focus: {
              boxShadow: "none !important",
              borderColor: "brand.500",
            },
          },
        },
        outline: {
          field: {
            bgColor: "white",
            borderRadius: "lg",
            _focus: {
              boxShadow: "none !important",
              borderColor: "brand.500",
            },
          },
        },
      },
    },
    Tag: {
      baseStyle: {
        whiteSpace: "pre",
        _focus: {
          boxShadow: "none",
        },
        _focusVisible: {
          outline: "-webkit-focus-ring-color auto 1px",
          outlineOffset: "1px",
        },
      },
      defaultProps: {
        size: "sm",
      },
      variants: {
        softOutline: {
          container: {
            shadow: "none",
            borderWidth: 1,
          },
        },
      },
      sizes: {
        xs: {
          container: {
            px: 1.5,
            py: 1,
            rounded: "md",
            fontSize: "xx-small",
          },
        },
      },
    },
    Spinner: {
      defaultProps: {
        size: "sm",
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "xs",
        fontWeight: "semibold",
        mb: 1,
        color: "gray.400",
      },
    },
    Skeleton: {
      baseStyle: {
        borderRadius: "sm",
      },
    },
    Table: {
      baseStyle: {
        th: {
          textTransform: "none",
          verticalAlign: "bottom",
          px: 2,
          fontWeight: "semibold",
          letterSpacing: "unset",
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          _focus: {
            shadow: "none",
          },
        },
      },
    },
    Popover: {
      parts: [],
      baseStyle: {
        content: {
          _focus: {
            shadow: "unset",
          },
        },
      },
    },
    Tooltip: {
      defaultProps: {
        openDelay: 200,
      },
      baseStyle: {
        rounded: "md",
        bgColor: "white",
        borderWidth: 1,
        borderColor: "gray.200",
        color: "gray.900",
        fontSize: "xs",
      },
    },
    Alert: {
      baseStyle: {
        container: {
          backgroundColor: "white !important",
          borderWidth: 1,
          borderColor: "gray.200",
          rounded: "md",
        },
        title: {
          color: "gray.900",
          fontWeight: "semibold",
          fontSize: "sm",
        },
        description: {
          color: "gray.900",
          fontSize: "sm",
        },
        icon: {
          color: "gray.900",
        },
      },
    },
  },
  sizes: {
    container: {
      md: "920px",
    },
  },
  direction: "ltr",
  shadows: {
    card: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    cardHover: "0 10px 15px -3px rgba(0, 0, 0, 0.07)",
  },
};

export const theme = extendTheme(extension);
