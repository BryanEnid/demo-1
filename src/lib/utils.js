import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const isRelativePath = (str) => {
	// Regular expression pattern to detect relative paths
	var pattern = /^(?!https?:\/\/)(?!www\.).*$/;
	return pattern.test(str);
};

// Function to check if the URL is from YouTube
export const isYouTubeUrl = (url = '') => {
	return url?.includes('youtube.com') || url?.includes('youtu.be') || url?.includes('ytimg.com');
};

export const extractYoutubeVideoId = (url) => {
	const urlObject = new URL(url);
	const pathname = urlObject.pathname;
	if (pathname.startsWith('/watch')) {
		const searchParams = new URLSearchParams(urlObject.search);
		return searchParams.get('v');
	} else if (pathname.startsWith('/')) {
		// For youtu.be URLs
		const segments = pathname.split('/');
		return segments[1];
	}
	return null;
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

// ! Remove this when ios supports Array.groupBy
export const groupBy = (array, keyFunc) => {
	return array.reduce((result, item) => {
		const key = keyFunc(item);
		(result[key] = result[key] || []).push(item);
		return result;
	}, {});
};

const iso8601DurationRegex =
	/(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

export const parseDuration = (str) => {
	const matches = str.match(iso8601DurationRegex);

	return {
		sign: matches[1] === undefined ? '+' : '-',
		years: matches[2] === undefined ? 0 : matches[2],
		months: matches[3] === undefined ? 0 : matches[3],
		weeks: matches[4] === undefined ? 0 : matches[4],
		days: matches[5] === undefined ? 0 : matches[5],
		hours: matches[6] === undefined ? 0 : matches[6],
		minutes: matches[7] === undefined ? 0 : matches[7],
		seconds: matches[8] === undefined ? 0 : matches[8]
	};
};

export const decodeIdToken = (idToken) => {
	if (!idToken) return;
	// Split the token into its three parts: header, payload, signature
	const parts = idToken.split('.');

	// Decode the payload (middle part)
	const payload = JSON.parse(atob(parts[1]));

	return payload;
};
