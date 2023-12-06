import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			staleTime: Infinity
			// suspense: true,
		}
	}
});

export function ReactQueryProvider({ children }) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
