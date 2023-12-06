import React from 'react';

export function Spinner(props) {
	return (
		<div className={`animate-spin rounded-full border-t-4 border-blue-500 border-solid h-12 w-12 ${props.className}`} />
	);
}
