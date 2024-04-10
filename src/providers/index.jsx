import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryProvider } from './ReactQuery';
import { AuthProvider } from './Authentication';
import { Toaster } from '@/chadcn/Toaster';
import { useMobile } from '@/hooks/useMobile';
import { ImageCacheProvider } from './ImageCacheProvider';

// const poolData = {
// 	UserPoolId: 'us-east-1_pUDIN5W4s',
// 	ClientId: '720749345099-k3goeebss33ns730itl4qo46rtjus0a5.apps.googleusercontent.com'
// };

export function GlobalProvider({ children }) {
	const { isMobile } = useMobile();

	React.useEffect(() => {
		const graphs = {
			development: `██████╗ ███████╗██╗   ██╗
			██╔══██╗██╔════╝██║   ██║
			██║  ██║█████╗  ██║   ██║
			██║  ██║██╔══╝  ╚██╗ ██╔╝
			██████╔╝███████╗ ╚████╔╝`,
			production: `██████╗ ██████╗ ██████╗ 
			██╔══██╗██╔══██╗██╔══██╗
			██████╔╝██████╔╝██║  ██║
			██╔═══╝ ██╔══██╗██║  ██║
			██║     ██║  ██║██████╔╝
			╚═╝     ╚═╝  ╚═╝╚═════╝ `
		};
		const mode = graphs[import.meta.env.MODE];

		// ANSI escape codes for styling
		const styles = {
			bold: '\x1b[1m',
			underline: '\x1b[4m',
			red: '\x1b[31m',
			green: '\x1b[32m',
			reset: '\x1b[0m' // Reset to default styling
		};

		// Define styling for the text
		const headerStyle = `${styles.bold}${styles.underline}${styles.red}`;
		const modeStyle = `${styles.bold}${styles.green}`;

		console.log(`
 			The application is running in 
			${modeStyle}${mode}${styles.reset} mode.
			
			Back end url: ${import.meta.env.VITE_SERVER_BASE_URL}
		`);
	}, []);

	return (
		<ReactQueryProvider>
			<ImageCacheProvider>
				<AuthProvider>
					{children}

					{/* Overlay */}
					{!isMobile && <ReactQueryDevtools />}
					<Toaster />
				</AuthProvider>
			</ImageCacheProvider>
		</ReactQueryProvider>
	);
}
