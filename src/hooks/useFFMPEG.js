import React from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

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

	const mux = async (videoBlob, audioBlob) => {
		const ffmpeg = ffmpegRef.current;

		console.log('Writing files...');
		// Assuming videoURL is the video file and trackURL is the audio file
		await ffmpeg.writeFile('input_video.mp4', videoBlob);
		await ffmpeg.writeFile('input_audio.mp3', audioBlob);
		console.log('Files created');

		console.log('Muxing files...');
		// Executing the command to mux the video and audio
		await ffmpeg.exec(['-i', 'input_video.mp4', '-i', 'input_audio.mp3', '-c', 'copy', 'output_combined.mp4']);
		console.log('Track with video and audio created');

		const fileData = await ffmpeg.readFile('output_combined.mp4');
		const data = new Uint8Array(fileData);

		// Return URL
		return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
	};

	return {
		loadFFMPEG: load,
		loaded,
		mux,
		transcode
	};
};
