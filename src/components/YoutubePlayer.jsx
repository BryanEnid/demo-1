import React, { useEffect, useRef } from 'react';
import { CredentiallessIFrame } from './CredentiallessIFrame';

// export const YouTubePlayer = ({ src }) => {
// 	const iframeRef = useRef(null);

// 	useEffect(() => {
// 		// Manually add the credentialless attribute to the iframe element
// 		if (iframeRef.current) {
// 			iframeRef.current.setAttribute('credentialless', '');
// 			iframeRef.current.setAttribute('src', src);
// 		}
// 	}, []);

// 	return (
// 		<iframe
// 			ref={iframeRef}
// 			// src={src}
// 			title="YouTube video player"
// 			// frameBorder="0"
// 			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
// 			allowFullScreen
// 			height="100%"
// 			width="100%"
// 		/>
// 	);
// };

export const YouTubePlayer = ({ videoId, onPlayerReady, onPlayerStateChange }) => {
	const playerRef = useRef(null);

	useEffect(() => {
		// Load YouTube iframe API script
		const script = document.createElement('script');
		script.src = 'https://www.youtube.com/iframe_api';
		document.body.appendChild(script);

		window.onYouTubeIframeAPIReady = () => {
			playerRef.current = new window.YT.Player('youtube-player', {
				videoId: videoId,
				events: {
					onReady: onPlayerReady,
					onStateChange: onPlayerStateChange
				},
				playerVars: {
					rel: '0',
					autoplay: 1,
					controls: 1,
					loop: 0,
					cc_load_policy: 1
				}
			});
		};

		console.log(playerRef.current);

		// Clean up YouTube player when component unmounts
		return () => {
			if (playerRef.current) playerRef.current.destroy();
		};
	}, [videoId]);

	return <CredentiallessIFrame src={videoId} />;
};
