import React, { useEffect, useRef } from 'react';
import { CredentiallessIFrame } from './CredentiallessIFrame';
import queryString from 'querystring';

function constructYouTubeUrl(videoId, params) {
	let url = `https://www.youtube.com/embed/${videoId}`;
	if (params) url += '?' + queryString.stringify(params);
	return url;
}

export const YouTubePlayer = ({ videoId, onPlayerReady, onPlayerStateChange }) => {
	const iframeRef = useRef(null);

	useEffect(() => {
		// Manually add the credentialless attribute to the iframe element
		if (iframeRef.current) {
			const url = constructYouTubeUrl(videoId, {
				autoplay: 1,
				mute: 1,
				rel: 0,
				showinfo: 0,
				cc_load_policy: 1,
				playsinline: 1
			});
			iframeRef.current.setAttribute('credentialless', '');
			iframeRef.current.setAttribute('src', url);
		}
	}, []);

	return (
		<iframe
			ref={iframeRef}
			title="YouTube video player"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
			height="100%"
			width="100%"
		/>
	);
};

// export const YouTubePlayer = ({ videoId, onPlayerReady, onPlayerStateChange }) => {
// 	const playerRef = useRef(null);

// 	useEffect(() => {
// 		// Load YouTube iframe API script
// 		const script = document.createElement('script');
// 		script.src = 'https://www.youtube.com/iframe_api';
// 		document.body.appendChild(script);

// 		window.onYouTubeIframeAPIReady = () => {
// 			playerRef.current = new window.YT.Player('youtube-player', {
// 				videoId: videoId,
// 				events: {
// 					onReady: onPlayerReady,
// 					onStateChange: onPlayerStateChange
// 				},
// 				playerVars: {
// 					rel: '0',
// 					autoplay: 1,
// 					controls: 1,
// 					loop: 0,
// 					cc_load_policy: 1
// 				}
// 			});
// 		};

// 		// Clean up YouTube player when component unmounts
// 		return () => {
// 			if (playerRef.current) playerRef.current.destroy();
// 		};
// 	}, [videoId]);

// 	return <CredentiallessIFrame src={videoId} />;
// };
