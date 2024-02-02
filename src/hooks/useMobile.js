import { useEffect, useState } from 'react';

export const useMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mobileBreakpoint = window.matchMedia('(max-width: 640px)'); // Tailwind's default mobile breakpoint

		const handleResize = () => {
			setIsMobile(mobileBreakpoint.matches);
		};

		// Call the handler initially
		handleResize();

		// Add event listener
		mobileBreakpoint.addEventListener('change', handleResize);

		// Remove event listener on cleanup
		return () => {
			mobileBreakpoint.removeEventListener('change', handleResize);
		};
	}, []);

	return { isMobile };
};
