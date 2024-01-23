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

export const getFirstPixelColor = async (imageUrl) => {
	const img = new Image();

	return new Promise((resolve, reject) => {
		img.crossOrigin = 'Anonymous'; // Enable cross-origin request
		img.src = imageUrl;

		img.onload = function () {
			try {
				const createImageBitmap = window.createImageBitmap || img.createImageBitmap;
				createImageBitmap(img).then((imageBitmap) => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					canvas.width = imageBitmap.width;
					canvas.height = imageBitmap.height;

					ctx.drawImage(imageBitmap, 0, 0);

					const pixelData = ctx.getImageData(2, 2, 1, 1).data;

					// Check if the pixel is fully transparent (alpha channel is 0)
					if (pixelData[3] === 0) {
						resolve('#FFFFFF'); // Return white for fully transparent pixel
					} else {
						const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
						resolve(hexColor);
					}
				});
			} catch (error) {
				console.error('Error loading image:', error);
				reject(error);
			}
		};

		img.onerror = function (error) {
			console.error('Error loading image:', error);
			reject(error);
		};
	});
};

export function rgbToHex(r, g, b) {
	var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	return hex.toUpperCase(); // Convert to uppercase for consistency
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	const a = (bigint >> 24) & 255; // Extract alpha channel
	return { r, g, b, a };
}

export async function getContrastColorAsync(hexColor) {
	// Convert hex to RGB
	const rgb = hexToRgb(hexColor);

	// Calculate relative luminance
	const luminance = (0.299 * rgb.r) / 255 + (0.587 * rgb.g) / 255 + (0.114 * rgb.b) / 255;

	// Use a threshold to determine if the text should be black or white
	return luminance > 0.5 ? 'black' : 'white';
}
