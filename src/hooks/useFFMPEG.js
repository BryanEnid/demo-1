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

	const mux2 = async (videoURL, audioURL, opts) => {
		const { hasAudio } = opts;
		const ffmpeg = ffmpegRef.current;

		// Assuming videoURL is the video file and audioURL is the additional audio file
		const videoFileName = 'input_video.mp4';
		const audioFileName = 'input_audio.mp3';
		const outputFileName = 'output_combined.mp4';

		await ffmpeg.writeFile(videoFileName, await fetchFile(videoURL));
		await ffmpeg.writeFile(audioFileName, await fetchFile(audioURL));

		// Executing the command to mux the video and audio
		await ffmpeg.exec([
			'-i',
			videoFileName,
			'-i',
			audioFileName,
			'-c:v',
			'copy',
			'-filter_complex',
			'[0:a][1:a]amerge=inputs=2[a]',
			'-map',
			'0:v:0',
			'-map',
			'[a]',
			'-c:a',
			'aac',
			'-strict',
			'experimental',
			outputFileName
		]);

		// Read the output file
		const fileData = await ffmpeg.readFile(outputFileName);
		const data = new Uint8Array(fileData);

		// Create Blob and URL
		const dataBlob = new Blob([data.buffer], { type: 'video/mp4' });
		const dataURL = URL.createObjectURL(dataBlob);

		// Cleanup: delete temporary files
		await ffmpeg.deleteFile(videoFileName);
		await ffmpeg.deleteFile(audioFileName);
		await ffmpeg.deleteFile(outputFileName);

		// Return Blob and URL
		return { blob: dataBlob, url: dataURL };
	};

	const mux = async (videoURL, audioURL, opts) => {
		const { hasAudio } = opts;
		const ffmpeg = ffmpegRef.current;

		// Assuming videoURL is the video file and audioURL is the additional audio file
		const videoFileName = 'input_video.mp4';
		const audioFileName = 'input_audio.mp3';
		const outputFileName = 'output_combined.mp4';

		await ffmpeg.writeFile(videoFileName, await fetchFile(videoURL));
		await ffmpeg.writeFile(audioFileName, await fetchFile(audioURL));

		// Build FFmpeg command based on the presence of audio in the input video
		const ffmpegCommand = ['-i', videoFileName, '-i', audioFileName, '-c:v', 'copy'];

		if (hasAudio) {
			ffmpegCommand.push('-filter_complex', '[0:a][1:a]amerge=inputs=2[a]', '-map', '0:v:0', '-map', '[a]');
		} else {
			ffmpegCommand.push('-map', '0:v:0', '-map', '1:a:0');
		}

		ffmpegCommand.push('-c:a', 'aac', '-strict', 'experimental', outputFileName);

		// Executing the command to mux the video and audio
		await ffmpeg.exec(ffmpegCommand);

		// Read the output file
		const fileData = await ffmpeg.readFile(outputFileName);
		const data = new Uint8Array(fileData);

		// Create Blob and URL
		const dataBlob = new Blob([data.buffer], { type: 'video/mp4' });
		const dataURL = URL.createObjectURL(dataBlob);

		// Cleanup: delete temporary files
		await ffmpeg.deleteFile(videoFileName);
		await ffmpeg.deleteFile(audioFileName);
		await ffmpeg.deleteFile(outputFileName);

		// Return Blob and URL
		return { blob: dataBlob, url: dataURL };
	};

	return {
		loadFFMPEG: load,
		loaded,
		mux,
		transcode
	};
};
