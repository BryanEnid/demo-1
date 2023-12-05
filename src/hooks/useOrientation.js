import { useState, useEffect } from 'react';

export const useOrientation = () => {
	const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);

	const handleResize = () => {
		setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
	};

	useEffect(() => {
		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Initial check for orientation
		handleResize();

		// Cleanup the event listener when the component unmounts
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return { isPortrait };
};
