export const YoutubePlayer = ({ videoId, className }) => {
	return (
		<>
			<iframe
				className={className}
				width="560"
				height="315"
				type="text/html"
				src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
				title="YouTube video player"
				// frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
				anonymous
			/>
		</>
	);
};
