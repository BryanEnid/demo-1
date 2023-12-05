import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryProvider } from './ReactQuery';
import { AuthProvider } from './Authentication';

export function GlobalProvider({ children }) {
	return (
		<ReactQueryProvider>
			<AuthProvider>
				{children}
				<ReactQueryDevtools />
			</AuthProvider>
		</ReactQueryProvider>
	);
}
