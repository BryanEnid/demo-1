import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryProvider } from './ReactQuery';
import { AuthProvider } from './Authentication';
import { Toaster } from '@/chadcn/Toaster';

export function GlobalProvider({ children }) {
	return (
		<ReactQueryProvider>
			<AuthProvider>
				{children}

				{/* Overlay */}
				<ReactQueryDevtools />
				<Toaster />
			</AuthProvider>
		</ReactQueryProvider>
	);
}
