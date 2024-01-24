export async function getYouTubeVideoDetails(videoId) {
	const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_CLIENT_ID;
	const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();

		if (data.items && data.items.length > 0) {
			const videoDetails = data.items[0].snippet;
			return {
				title: videoDetails.title,
				channelTitle: videoDetails.channelTitle,
				thumbnail: videoDetails.thumbnails.high.url,
				description: videoDetails.description // You can choose different sizes
			};
		}
	} catch (error) {
		console.error('Error fetching YouTube video details', error);
	}

	return null;
}
