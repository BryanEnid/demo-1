import React from 'react';

export const CredentiallessIFrame = ({ src, className, onLoad }) => {
	const iframeRef = React.useRef(null);

	React.useEffect(() => {
		// Manually add the credentialless attribute to the iframe element
		if (iframeRef.current) {
			iframeRef.current.setAttribute('credentialless', '');
			iframeRef.current.setAttribute('src', src);
		}
	}, []);

	return <iframe ref={iframeRef} className={className} onLoad={onLoad} />;
};
