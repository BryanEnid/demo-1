import React, { useEffect, useState } from 'react';
import { useIndexedDBVideos } from '@/hooks/useIndexedDBVideos';
import { extractYoutubeVideoId, isYouTubeUrl } from '@/lib/utils';
import YouTube from 'react-youtube';

// export const CachedVideo = ({ videoUrl, ...props }) => {
//   const { saveVideo } = useIndexedDBVideos("cached-videos", 1);

//   useEffect(() => {
//     const loadVideo = async () => {
//       // Check if the video is already cached
//       const cachedVideo = localStorage.getItem(videoUrl);
//       if (cachedVideo) return setCachedVideoUrl(cachedVideo);

//       try {
//         const response = await fetch(videoUrl, { credentials: "same-origin" });
//         const videoData = await response.blob();

//         // Save the video data to localStorage for future use
//         localStorage.setItem(videoUrl, URL.createObjectURL(videoData));

//         // Update the state with the cached video URL
//         setCachedVideoUrl(URL.createObjectURL(videoData));
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     // Load the video when the component mounts
//     loadVideo();
//   }, [videoUrl]);

//   return (
//     <video {...props}>
//       <source src={cachedVideoUrl} type="video/mp4" />
//       Your browser does not support the video tag.
//     </video>
//   );
// };

export const CachedVideo = React.forwardRef(function CachedVideo({ src, ...props }, ref) {
	// const [cachedVideoUrl, setCachedVideoUrl] = React.useState(null);

	// React.useEffect(() => {
	//   const loadVideo = async () => {
	//     const cachedVideo = localStorage.getItem(videoUrl);

	//     if (cachedVideo) return setCachedVideoUrl(cachedVideo);

	//     // Create a video element dynamically
	//     const videoElement = document.createElement("video");

	//     // Set the source URL
	//     videoElement.src = videoUrl;

	//     // Load the video and wait for it to be ready
	//     await videoElement.load();

	//     // Convert the video to a Blob
	//     const blob = await fetch(videoUrl).then((response) => response.blob());

	//     // Convert the Blob to a data URL
	//     const dataUrl = URL.createObjectURL(blob);

	//     // Save the data URL to localStorage for future use
	//     localStorage.setItem(videoUrl, dataUrl);

	//     // Update the state with the cached video URL
	//     setCachedVideoUrl(dataUrl);
	//   };

	//   loadVideo();
	// }, [videoUrl]);

	// return (
	//   <video controls width="500" height="300">
	//     <source src={cachedVideoUrl || videoUrl} type="video/mp4" />
	//     Your browser does not support the video tag.
	//   </video>
	// );

	// const opts = {
	// 	playerVars: {
	// 		// https://developers.google.com/youtube/player_parameters
	// 		autoplay: 1
	// 	}
	// };

	const YoutubePlayerRef = React.useRef();

	const handleYoutubeOnReady = (event) => {
		console.log(event);
		event.target.mute();
		event.target.playVideo();
	};

	if (isYouTubeUrl(src))
		return (
			<YouTube
				ref={YoutubePlayerRef}
				videoId={extractYoutubeVideoId(src)}
				opts={{ playerVars: { autoplay: 1, controls: 1, loop: 0 } }}
				onReady={handleYoutubeOnReady}
			/>
		);

	return (
		<video
			{...props}
			ref={ref}
			// crossOrigin="anonymous"
		>
			<source src={src} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
});
