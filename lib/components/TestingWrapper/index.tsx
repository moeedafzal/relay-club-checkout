import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Creating a client for React Query with default options.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disables automatic retrying of queries to simplify testing.
    },
  },
});

const TestingWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    // Wrapping children components with the QueryClientProvider.
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TestingWrapper;
