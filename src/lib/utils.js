import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Function to check if the URL is from YouTube
export const isYouTubeUrl = (url = '') => {
	return url?.includes('youtube.com') || url?.includes('youtu.be');
};

export const extractYoutubeVideoId = (url) => {
	const urlObject = new URL(url);
	const searchParams = new URLSearchParams(urlObject.search);
	return searchParams.get('v');
};

function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI.split(',')[1]);
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: mimeString });
}

export const generatePreview = async (recordedVideo) => {
	const videoUrl = URL.createObjectURL(recordedVideo);

	const videoElement = document.createElement('video');
	videoElement.src = videoUrl;
	document.body.appendChild(videoElement);

	await videoElement.play();

	const canvas = document.createElement('canvas');
	canvas.width = videoElement.videoWidth;
	canvas.height = videoElement.videoHeight;
	const ctx = canvas.getContext('2d');

	// Draw the video frame onto the canvas
	ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

	// Convert the canvas content to a data URL (screenshot)
	const screenshot = canvas.toDataURL('image/png');

	// Clean up elements
	document.body.removeChild(videoElement);
	URL.revokeObjectURL(videoUrl);

	// Convert the screenshot to a Blob
	const screenshotBlob = dataURItoBlob(screenshot);

	return screenshotBlob;
};

export const generateRandomNumber = (minimum, maximum) => {
	// Generate a random decimal number between 0 (inclusive) and 1 (exclusive)
	const randomDecimal = Math.random();

	// Scale the random decimal to the desired range and round to the nearest integer
	const randomInteger = Math.floor(randomDecimal * (maximum - minimum + 1)) + minimum;

	return randomInteger;
};

export function formatTimestamp(timestamp) {
	// Convert the timestamp to seconds
	const seconds = Math.floor(timestamp / 1000);

	// Calculate the minutes and seconds
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	// Format the result as "m:ss" (minutes:seconds)
	const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

	return formattedTime;
}

export const getShortNumberLabel = (num, units = ['', 'k', 'm', 'b'], unitStep = 1000) => {
	let i = 0;
	let res = num;
	while (res >= unitStep && i < units.length - 1) {
		i += 1;
		res = res / unitStep;
	}

	return `${Math.round(res * 10) / 10}${units[i]}`.replace('.', ',');
};
