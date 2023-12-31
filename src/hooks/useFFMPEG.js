import React from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// const toBlobURL = async (url, type) => {
// 	const headers = {
// 		'Cross-Origin-Opener-Policy': 'same-origin',
// 		'Cross-Origin-Embedder-Policy': 'require-corp'
// 	};

// 	const res = await fetch(url, { headers });
// 	const buf = await res.arrayBuffer();
// 	const blob = new Blob([buf], { type });
// 	return URL.createObjectURL(blob);
// };

export const useFFMPEG = () => {
	const [loaded, setLoaded] = React.useState(false);
	const ffmpegRef = React.useRef(new FFmpeg());

	const load = async () => {
		const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
		const ffmpeg = ffmpegRef.current;

		ffmpeg.on('log', ({ type, message }) => {
			console.log('[FFMPEG] - ', type, message);
		});

		// toBlobURL is used to bypass CORS issue, urls with the same
		// domain can be used directly.
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
		});

		setLoaded(true);
	};

	const transcode = async (videoURL) => {
		const ffmpeg = ffmpegRef.current;

		await ffmpeg.writeFile('input.avi', await fetchFile(videoURL));

		// HERE EXECUTES THE COMMAND TO PERFORM
		await ffmpeg.exec(['-i', 'input.avi', 'output.mp4']);

		const fileData = await ffmpeg.readFile('output.mp4');
		const data = new Uint8Array(fileData);

		// Return url
		return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
	};

	const mux = async (videoURL, audioURL) => {
		const ffmpeg = ffmpegRef.current;

		// Assuming videoURL is the video file and trackURL is the audio file
		await ffmpeg.writeFile('input_video.mp4', await fetchFile(videoURL));
		await ffmpeg.writeFile('input_audio.mp3', await fetchFile(audioURL));

		// Executing the command to mux the video and audio
		await ffmpeg.exec(['-i', 'input_video.mp4', '-i', 'input_audio.mp3', '-c', 'copy', 'output_combined.mp4']);

		const fileData = await ffmpeg.readFile('output_combined.mp4');
		const data = new Uint8Array(fileData);

		const dataBlob = new Blob([data.buffer], { type: 'video/mp4' });
		const dataURL = URL.createObjectURL(dataBlob);

		// Return URL
		return { blob: dataBlob, url: dataURL };
	};

	return {
		loadFFMPEG: load,
		loaded,
		mux,
		transcode
	};
};
