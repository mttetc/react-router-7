import { Component, type ReactNode } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Collapsible,
  Code,
  Separator,
} from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string; // For identifying which boundary caught the error
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ errorInfo });

    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking service (Sentry, etc.)
      console.error("🚨 Production Error:", error, errorInfo);
    } else {
      console.error("🚨 Error Boundary caught an error:", error, errorInfo);
      console.error("🔍 Component Stack:", errorInfo.componentStack);
    }
  }

  getErrorType(error: Error): string {
    if (error.message.includes("ChakraProvider")) return "ChakraProvider";
    if (error.message.includes("useContext")) return "Context";
    if (error.message.includes("nuqs")) return "Nuqs";
    if (error.message.includes("Portal")) return "Portal";
    if (error.message.includes("Hydration")) return "Hydration";
    return "Unknown";
  }

  getTroubleshootingInfo(error: Error): string {
    const errorType = this.getErrorType(error);

    switch (errorType) {
      case "ChakraProvider":
        return `🔧 ChakraProvider Error:
• Component is used outside of ChakraProvider
• Check if Drawer/Modal components are properly wrapped
• Verify provider hierarchy in your app`;

      case "Context":
        return `🔧 Context Error:
• Component is rendered outside required provider
• Check provider setup and component tree
• Verify context is properly initialized`;

      case "Nuqs":
        return `🔧 Nuqs Error:
• useQueryState used outside NuqsProvider
• Check URL parameter configuration
• Verify parser setup`;

      case "Portal":
        return `🔧 Portal Error:
• Portal component rendering issues
• Check if Portal target exists
• Verify DOM structure`;

      case "Hydration":
        return `🔧 Hydration Error:
• Server/client rendering mismatch
• Check for conditional rendering
• Verify SSR compatibility`;

      default:
        return `🔧 General Error:
• Check component props and state
• Verify dependencies are properly installed
• Check for circular dependencies`;
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails } = this.state;
      const errorType = error ? this.getErrorType(error) : "Unknown";
      const troubleshooting = error ? this.getTroubleshootingInfo(error) : "";

      return (
        <Box
          p={6}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          maxW="4xl"
          mx="auto"
        >
          <VStack gap={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" color="red.600">
                🚨 Error Boundary Caught an Error
              </Text>
              <Badge colorPalette="red" variant="solid">
                {errorType}
              </Badge>
            </HStack>

            {this.props.name && (
              <Text fontSize="sm" color="gray.600">
                Boundary: <Code>{this.props.name}</Code>
              </Text>
            )}

            <Box
              bg="red.100"
              p={3}
              borderRadius="md"
              borderLeft="4px solid"
              borderLeftColor="red.400"
            >
              <Text fontWeight="semibold" color="red.800">
                Error Message:
              </Text>
              <Text color="red.700" mt={1}>
                {error?.message || "An unexpected error occurred"}
              </Text>
            </Box>

            {troubleshooting && (
              <Box
                bg="blue.100"
                p={3}
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="blue.400"
              >
                <Text fontWeight="semibold" color="blue.800" mb={2}>
                  Troubleshooting:
                </Text>
                <Text color="blue.700" fontSize="sm" whiteSpace="pre-line">
                  {troubleshooting}
                </Text>
              </Box>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ showDetails: !showDetails })}
              colorPalette="gray"
            >
              {showDetails ? "Hide" : "Show"} Technical Details
            </Button>

            <Collapsible.Root open={showDetails}>
              <Collapsible.Content>
                <VStack gap={3} align="stretch">
                  {error?.stack && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2}>
                        Stack Trace:
                      </Text>
                      <Code
                        p={3}
                        bg="gray.100"
                        borderRadius="md"
                        fontSize="xs"
                        whiteSpace="pre-wrap"
                        display="block"
                        overflowX="auto"
                      >
                        {error.stack}
                      </Code>
                    </Box>
                  )}

                  {errorInfo?.componentStack && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2}>
                        Component Stack:
                      </Text>
                      <Code
                        p={3}
                        bg="gray.100"
                        borderRadius="md"
                        fontSize="xs"
                        whiteSpace="pre-wrap"
                        display="block"
                        overflowX="auto"
                      >
                        {errorInfo.componentStack}
                      </Code>
                    </Box>
                  )}

                  <Separator />

                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontWeight="semibold" color="gray.700" mb={2}>
                      Debug Info:
                    </Text>
                    <VStack
                      gap={1}
                      align="stretch"
                      fontSize="sm"
                      color="gray.600"
                    >
                      <Text>
                        • Environment:{" "}
                        {import.meta.env.DEV ? "Development" : "Production"}
                      </Text>
                      <Text>• Timestamp: {new Date().toISOString()}</Text>
                      <Text>• Error Name: {error?.name || "Unknown"}</Text>
                      <Text>• Boundary: {this.props.name || "Unnamed"}</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Collapsible.Content>
            </Collapsible.Root>

            <HStack gap={3} justify="center">
              <Button
                onClick={() =>
                  this.setState({
                    hasError: false,
                    error: undefined,
                    errorInfo: undefined,
                  })
                }
                colorPalette="purple"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                colorPalette="gray"
              >
                Reload Page
              </Button>
            </HStack>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
