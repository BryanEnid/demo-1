import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryProvider } from './ReactQuery';
import { AuthProvider } from './Authentication';
import { Toaster } from '@/chadcn/Toaster';
import { useMobile } from '@/hooks/useMobile';

const poolData = {
	UserPoolId: 'us-east-1_pUDIN5W4s',
	ClientId: '720749345099-k3goeebss33ns730itl4qo46rtjus0a5.apps.googleusercontent.com'
};

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
