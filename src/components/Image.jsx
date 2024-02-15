import React from 'react';

export const Image = ({ children, ...props }) => {
	return (
		<img crossOrigin="anonymous" {...props}>
			{children}
		</img>
	);
};
