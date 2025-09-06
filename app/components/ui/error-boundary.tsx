import { Component, type ReactNode } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("🚨 Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={6} textAlign="center">
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold" color="red.500">
              Something went wrong
            </Text>
            <Text color="gray.600">
              {this.state.error?.message || "An unexpected error occurred"}
            </Text>
            <Button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              colorScheme="blue"
            >
              Try again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
