import React from 'react';
import { Icon } from '@iconify/react';
import { AspectRatio } from '@/chadcn/AspectRatio';
import { Button } from '@/chadcn/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/chadcn/Select';
import { Typography } from '@/chadcn/Typography';

export function CaptureScreen() {
	const [cameraPosition, setCameraPosition] = React.useState({ bottom: 100, right: 100 });
	const [videoScale, setVideoScale] = React.useState(0.2);
	const [isScreenRecording, setIsScreenRecording] = React.useState(false);
	const [devices, setDevices] = React.useState([]);
	const [screenDevice, setScreenDevice] = React.useState('');
	const [selfieDevice, setSelfieDevice] = React.useState('');

	const webcamRef = React.useRef(null);
	const videoRef = React.useRef(null);
	const canvasRef = React.useRef();
	const recorderRef = React.useRef(null);
	const canvasWorker = React.useRef(null);
	// const videoChunks = React.useRef([]);

	// TODO: handle new devices without refreshes
	const handleDevices = React.useCallback(
		(mediaDevices) => {
			const devicesList = mediaDevices.filter(({ kind }) => kind === 'videoinput');
			setDevices(devicesList);
			setScreenDevice(devicesList[1].deviceId);
		},
		[setDevices]
	);

	React.useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(handleDevices);
	}, [handleDevices]);

	React.useEffect(() => {
		canvasRef.current = document.createElement('canvas');
		if (screenDevice.length) startScreen(screenDevice);
		if (selfieDevice.length) startWebcam(selfieDevice);
		if (!!screenDevice.length || !!selfieDevice.length) drawScreen();

		return () => {
			canvasRef.current = null;
			if (webcamRef.current?.srcObject) webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
			if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
		};
	}, [screenDevice, selfieDevice]);

	const handleRecordedVideo = (e) => {
		const recordedVideo = new Blob([e.data], { type: 'video/mp4' });
		console.log('recording stopped', recordedVideo);

		// For testing
		const fileObjectURL = URL.createObjectURL(recordedVideo);
		window.open(fileObjectURL);
	};

	const startRecording = async () => {
		if (!isScreenRecording && canvasRef.current && (!!screenDevice.length || !!selfieDevice.length)) {
			// Define Inputs
			const canvasStream = canvasRef.current.captureStream();
			const audioStream1 = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: screenDevice }
			});
			const audioStream2 = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: selfieDevice }
			});

			// Generate combined stream
			const combinedStream = new MediaStream([
				...canvasStream.getTracks(),
				...audioStream1.getTracks(),
				...audioStream2.getTracks()
			]);

			const recorder = new MediaRecorder(combinedStream);
			recorder.addEventListener('dataavailable', handleRecordedVideo); // Video was stopped
			recorderRef.current = recorder;

			recorder.start();
			setIsScreenRecording(true);
			console.log('recording started');
		}

		if (isScreenRecording) {
			setIsScreenRecording(false);
			recorderRef.current.stop();
		}
	};

	// const stopRecording = () => {};

	const startWebcam = async (deviceId) => {
		const config = {
			video: {
				width: 1920,
				height: 1920,
				aspectRatio: 1 / 1,
				deviceId
			}
		};

		const stream = await navigator.mediaDevices.getUserMedia(config);

		// webcamRef.current.onloadedmetadata = (e) => {
		//   canvasRef.current.width = window.innerWidth;
		//   canvasRef.current.height = window.innerHeight;
		// };

		webcamRef.current.srcObject = stream;
	};

	const startScreen = async (deviceId) => {
		const config = {
			video: {
				width: 1920,
				height: 1080,
				aspectRatio: 16 / 9,
				deviceId
			}
		};
		const stream =
			await navigator.mediaDevices[deviceId === 'Screen Recording' ? 'getDisplayMedia' : 'getUserMedia'](config);

		const canvas = canvasRef.current;

		const dpr = window.devicePixelRatio;
		videoRef.current.onloadedmetadata = ({ target }) => {
			canvas.width = 1920 * dpr;
			canvas.height = 1080 * dpr;
			// canvas.context2d.translate(0.5, 0.5); // TODO/FIXME: translate is not valid
		};

		videoRef.current.srcObject = stream;
	};

	const drawScreen = () => {
		// Video
		const video = videoRef.current;
		const { videoWidth } = video;
		const { videoHeight } = video;
		const videoAspectRatio = videoWidth / videoHeight;

		// Canvas
		const canvas = canvasRef.current;
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const dpr = window.devicePixelRatio;
		// const ctx = canvas.getContext("2d", { alpha: false });
		// const ctx = canvas.getContext("2d", { alpha: false });

		// Worker
		const worker = new Worker('capture-worker.js');
		document.createElement('canvas');
		const canvasWorker = canvas.transferControlToOffscreen();
		console.log(video);

		// worker.postMessage(
		//   {
		//     canvas: canvasWorker,
		//     dimensions: { width: canvasWidth, height: canvasHeight },
		//     dpr,
		//     video,
		//   },
		//   [canvasWorker]
		// );

		// ctx.scale(dpr, dpr);

		// let destWidth = canvasWidth;
		// let destHeight = canvasHeight;
		// if (videoAspectRatio > 16 / 9) {
		//   destHeight = canvasWidth / videoAspectRatio;
		// } else {
		//   destWidth = canvasHeight * videoAspectRatio;
		// }

		// const xOffset = (canvasWidth - destWidth) / 2;
		// const yOffset = (canvasHeight - destHeight) / 2;

		// // Draw the video to fit the canvas dimensions
		// canvasRef.current.style.width = destWidth;
		// canvasRef.current.style.height = destHeight;
		// ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		// ctx.drawImage(video, Math.floor(xOffset), Math.floor(yOffset), Math.floor(destWidth), Math.floor(destHeight));

		// // Now, call the drawCamera function to overlay the webcam feed
		// drawCamera();

		// requestAnimationFrame(drawScreen);
	};

	const drawCamera = () => {
		const dpr = window.devicePixelRatio;
		const canvasWidth = canvasRef.current.width;
		const canvasHeight = canvasRef.current.height;
		const cameraWidth = webcamRef.current.videoWidth * videoScale * dpr;
		const cameraHeight = webcamRef.current.videoHeight * videoScale * dpr;
		const tempCameraPosition = {
			x: -cameraPosition.bottom * dpr + (canvasWidth - cameraWidth),
			y: -cameraPosition.right * dpr + (canvasHeight - cameraHeight - 15)
		};
		const ctx = canvasRef.current.getContext('2d', { alpha: false });
		ctx.scale(dpr, dpr);

		ctx.save();

		// Border
		ctx.beginPath();
		ctx.arc(
			Math.floor(tempCameraPosition.x + cameraWidth / 2),
			Math.floor(tempCameraPosition.y + cameraHeight / 2),
			Math.floor(Math.min(cameraWidth, cameraHeight) / 2),
			0,
			Math.PI * 2
		);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 15;
		ctx.stroke();

		// Clip circular shape
		ctx.beginPath();
		ctx.arc(
			Math.floor(tempCameraPosition.x + cameraWidth / 2),
			Math.floor(tempCameraPosition.y + cameraHeight / 2),
			Math.floor(Math.min(cameraWidth, cameraHeight) / 2),
			0,
			Math.PI * 2
		);
		ctx.clip();

		// Camera to be clipped
		ctx.drawImage(webcamRef.current, tempCameraPosition.x, tempCameraPosition.y, cameraWidth, cameraHeight);

		ctx.restore();
	};

	const handleStartScreen = (value) => {
		setScreenDevice(value !== 'none' ? value : '');
		startScreen();
	};

	return (
		<div className="flex-inline pt-2 h-screen bg-[#001027]">
			{/* Resources */}
			<video ref={webcamRef} autoPlay className="h-full hidden" />
			<video ref={videoRef} autoPlay className="h-full hidden" />

			<div className="w-screen flex justify-center">
				<div
					className="flex justify-center items-center max-w-screen-2xl bg-white rounded-3xl overflow-hidden"
					style={{ width: '100%', maxWidth: 'calc(85vh * 16/9)' }}
				>
					<canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full" />
				</div>
			</div>

			<div className="relative flex flex-col items-center justify-center mt-10 w-full">
				<div className="flex flex-row justify-center w-full items-center">
					<div
						style={{ width: '100%', maxWidth: 'calc(85vh * 16/9)' }}
						className="flex flex-row justify-between items-center"
					>
						{/* Start */}
						<div className="flex flex-row gap-4">
							<Select value={screenDevice} onValueChange={handleStartScreen}>
								<SelectTrigger className="w-[180px] bg-white">
									<div className="truncate">
										<SelectValue placeholder="Select Screen Device" />
									</div>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									<SelectItem value="Screen Recording">Screen Recorder</SelectItem>
									{devices.map(({ deviceId, label }) => (
										<SelectItem key={deviceId} value={deviceId}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={selfieDevice} onValueChange={(value) => setSelfieDevice(value !== 'none' ? value : '')}>
								<SelectTrigger className="w-[180px] bg-white ">
									<div className="truncate">
										<SelectValue placeholder="Select Selfie Camera" />
									</div>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									{devices.map(({ deviceId, label }) => (
										<SelectItem key={deviceId} value={deviceId}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* End */}
						<div className="flex flex-col items-center gap-2 text-white">
							{/* <div className="rounded-xl p-1 px-6 bg-blue-600  text-center">
                <Typography variant="large">2 : 00</Typography>
              </div>

              <div className="text-yellow-300">
                <Typography variant="small">Recording ...</Typography>
              </div> */}
						</div>
					</div>
				</div>

				{/* Overlay */}
				<div className="absolute flex flex-row justify-center">
					<div className="flex flex-row gap-16 text-4xl text-white">
						<button className="rounded-full p-3 bg-blue-600">
							<Icon icon="ph:microphone-bold" />
						</button>

						<button className="rounded-full p-3 bg-blue-600">
							<Icon icon="majesticons:video" />
						</button>

						<button className="rounded-full p-3 bg-white text-black">
							<Icon icon="iconamoon:restart" />
						</button>

						{/* <button className="rounded-full p-3">Pause</button> */}

						<button onClick={startRecording} className="flex rounded-full p-3 bg-[#E87259] relative justify-center">
							{/* <Icon icon="fluent:record-stop-48-filled" /> */}
							<Icon icon={!isScreenRecording ? 'fluent:record-48-filled' : 'fluent:record-stop-48-filled'} />

							{/* <div className="absolute bottom-[-50px] flex flex-row gap-4 text-xl">
                <button className="bg-slate-600 rounded-full p-2 px-3">3s</button>
                <button className="bg-slate-600 rounded-full p-2 px-3">10s</button>
              </div> */}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
