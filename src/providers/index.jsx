import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryProvider } from './ReactQuery';
import { AuthProvider } from './Authentication';
import { Toaster } from '@/chadcn/Toaster';
import { useMobile } from '@/hooks/useMobile';

export function GlobalProvider({ children }) {
	const { isMobile } = useMobile();

	return (
		<ReactQueryProvider>
			<AuthProvider>
				{children}

				{/* Overlay */}
				{!isMobile && <ReactQueryDevtools />}
				<Toaster />
			</AuthProvider>
		</ReactQueryProvider>
	);
}
