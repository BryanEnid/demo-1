import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/chadcn/Select';
import { Typography } from '@/chadcn/Typography';
import { useQueryParams } from '@/hooks/useQueryParams';
import useQuestions from '@/hooks/useQuestions.js';
import { useIndexedDBVideos } from '@/hooks/useIndexedDBVideos';
import { formatTimestamp } from '@/lib/utils';
import { useAuth } from '@/providers/Authentication.jsx';
import { useFFMPEG } from '@/hooks/useFFMPEG';

export function CaptureScreen() {
	// Hooks
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { user } = useAuth();
	const { saveVideo: saveVideoIDB } = useIndexedDBVideos('local-unlisted-videos', 1);
	const { data: questions } = useQuestions({ forUser: user?.id });
	const { mux, loadFFMPEG } = useFFMPEG();

	const query = new URLSearchParams(search);

	// State
	const [isRecording, setRecording] = React.useState(false);
	const [devices, setDevices] = React.useState({ audio: [], video: [] });
	const [screenDevice, setScreenDevice] = React.useState('');
	const [screenDevice2, setScreenDevice2] = React.useState('');
	const [audioDevice, setAudioDevice] = React.useState('');
	const [isUploading, setUploading] = React.useState(false);
	// const [uploadProgress, setUploadProgress] = React.useState(0);
	const [volumeDisplay, setVolumeDisplay] = React.useState(0);
	const [timelapsed, setTimeLapsed] = React.useState(0);
	const [recordedAudio, setRecordedAudio] = React.useState();
	const [recordedVideo, setRecordedVideo] = React.useState();
	const [question, setQuestion] = React.useState(query.get('questionId'));

	// Refs
	const webcamRef = React.useRef(null);
	const videoRef = React.useRef(null);
	const overlayCameraRef = React.useRef(null);
	const mainRef = React.useRef();
	const streamRef = React.useRef();
	const audioRecorderRef = React.useRef();
	const videoRecorderRef = React.useRef();

	// TODO: handle new devices without refreshes
	// Detects all audio and video devices and populates
	const handleDevices = React.useCallback(
		(mediaDevices) => {
			const devicesList = { audio: [], video: [] };
			mediaDevices.forEach((device) => {
				if (device.kind === 'videoinput') devicesList.video.push(device);
				if (device.kind === 'audioinput') devicesList.audio.push(device);
			});
			setDevices(devicesList);
			setScreenDevice(devicesList.video[0].deviceId);
			setAudioDevice(devicesList.audio[0].deviceId);
		},
		[setDevices]
	);

	// Loading FFMPEG over CDN
	React.useEffect(() => {
		loadFFMPEG().then(console.log);
	}, []);

	// Stop tracks when leaving to another screen
	React.useEffect(
		() => () => {
			streamRef.current?.getTracks().forEach((track) => {
				track.stop();
			});
		},
		[pathname]
	);

	// Populates available devices
	React.useEffect(() => {
		// TODO: Not supported on Safari
		// (async () => {
		//   const { state: microphonePermission } = await navigator.permissions.query({ name: "microphone" });
		//   const { state: cameraPermission } = await navigator.permissions.query({ name: "camera" });
		//   const devices = await navigator.mediaDevices.enumerateDevices();
		//   handleDevices(devices);
		// })();

		navigator.mediaDevices
			// ! This is only for asking user for permission. Don't change
			.getUserMedia({ video: { width: 1920, height: 1080, aspectRatio: 16 / 9 }, audio: true })
			.then((stream) => navigator.mediaDevices.enumerateDevices())
			.then(handleDevices);
	}, [handleDevices]);

	// Handles input device (audio/video) change
	React.useEffect(() => {
		if (!!screenDevice.length || !!audioDevice.length) {
			startScreen(screenDevice, audioDevice).catch((e) => {
				setScreenDevice('');
			});
		}

		// TODO: Clean tracks
		// return () => {
		//   // canvasRef.current = null;
		//   if (webcamRef.current?.srcObject) webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
		//   if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
		// };
	}, [screenDevice, audioDevice]);

	React.useEffect(() => {
		if (screenDevice2.length) {
			startScreen2(screenDevice2);
		}
	}, [screenDevice2]);

	// Handles time lapsed
	React.useEffect(() => {
		let instance;
		if (isRecording) {
			instance = setInterval(() => {
				setTimeLapsed((prev) => prev + 1000);
			}, 1000);
		}

		if (timelapsed !== 0 && !isRecording) setTimeLapsed(0);

		return () => {
			clearInterval(instance);
		};
	}, [isRecording]);

	// Observer for the media recorded
	React.useEffect(() => {
		if (recordedAudio && recordedVideo) handleRecordedVideo(recordedVideo, recordedAudio).catch(console.error);
	}, [recordedAudio, recordedVideo]);

	const handleRecordedVideo = async (video, audio) => {
		console.log('starting process');
		// setUploading(true);
		// overlayCameraRef.current.srcElement.exitPictureInPicture();

		// TODO: MAYBE/? Change to send this as a stream to the data base so it can save it even faster without losing any info after done.
		const recordedVideo = new Blob([video.data], { type: 'video/mp4' });
		const recordedAudio = new Blob([audio.data], { type: 'audio/mp4' });

		console.log(recordedVideo, recordedAudio);

		const muxedTrackURL = await mux(recordedVideo, recordedAudio);

		// const videoSrc = URL.createObjectURL(recordedVideo);
		window.open(muxedTrackURL);

		// const request = await saveVideoIDB(recordedVideo);

		// request.onsuccess = ({ target }) => {
		// 	query.set('id', target.result);
		// 	navigate({ pathname: 'preview', search: query.toString() });
		// };
	};

	const startRecording = async () => {
		if (!isRecording && !!screenDevice.length && !!audioDevice.length) {
			// Define Inputs
			const video = mainRef.current.captureStream();
			const audio = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice } });

			// Generate combined stream
			const videoRecorder = new MediaRecorder(video);
			const audioRecorder = new MediaRecorder(audio);
			videoRecorderRef.current = videoRecorder;
			audioRecorderRef.current = audioRecorder;

			// Start recording
			videoRecorder.start();
			audioRecorder.start();
			setRecording(true);

			// Video stopped
			audioRecorder.addEventListener('dataavailable', setRecordedAudio);
			videoRecorder.addEventListener('dataavailable', setRecordedVideo); // Video was stopped
			// videoRecorder.addEventListener("dataavailable", handleRecordedVideo); // Video was stopped
		}
		if (isRecording) {
			setRecording(false);
			videoRecorderRef.current.stop();
			audioRecorderRef.current.stop();
		}
	};

	// TODO: Make this start screen more modular (independent) from state
	const startScreen = async (deviceId, audioDeviceId) => {
		const config = { video: { width: 1920, height: 1080, deviceId }, audio: false };
		const main = mainRef.current;

		// Set default config depending on the media source
		const isDisplayMedia = deviceId === 'Screen Recording';
		const mediaStore = {
			getDisplayMedia: async (props) => navigator.mediaDevices.getDisplayMedia({ ...props }),
			getUserMedia: async (props) => navigator.mediaDevices.getUserMedia({ ...props })
		};

		const stream = await mediaStore[isDisplayMedia ? 'getDisplayMedia' : 'getUserMedia'](config);

		stream.getTracks().forEach((track) => {
			track.onended = (evt) => {
				if (isRecording) startRecording();
				setScreenDevice('');
				setScreenDevice2('');
				mainRef.current = null;
			};
		});

		// Shows audio input levels
		// ! Vercel breaks with this code. I think it related how the app gets build
		// ! The worklet needs to be served as an static file
		// const audioContext = new AudioContext();
		// await audioContext.audioWorklet.addModule("/src/screens/capture/audio-worklet-processor.js"); // Replace with your actual path
		// const source = audioContext.createMediaStreamSource(stream);
		// const processor = new AudioWorkletNode(audioContext, "vumeter");

		// processor.port.onmessage = (event) => {
		//   if (event.data.type === "audioData") {
		//     const { average } = event.data.data;
		//     const volume = 1 + average * 8;
		//     const max_cap = 1.6;
		//     setVolumeDisplay(volume > max_cap ? max_cap : volume);
		//   }
		// };

		// source.connect(processor).connect(audioContext.destination);

		main.srcObject = deviceId ? stream : null;
		streamRef.current = stream;
		// TODO : fix this for facing mode
		// main.style.transform = !isDisplayMedia ? "scaleX(-1)" : "scaleX(1)";
	};

	const startScreen2 = async (deviceId) => {
		const config = { video: { width: 1920, height: 1080, deviceId }, audio: false };
		const main = overlayCameraRef.current;
		// new HTMLVideoElement().onloadedmetadata;

		// Set default config depending on the media source
		const isDisplayMedia = deviceId === 'Screen Recording';
		const mediaStore = {
			getDisplayMedia: async (props) => navigator.mediaDevices.getDisplayMedia({ ...props }),
			getUserMedia: async (props) => navigator.mediaDevices.getUserMedia({ ...props })
		};

		const stream = await mediaStore[isDisplayMedia ? 'getDisplayMedia' : 'getUserMedia'](config);

		main.current = stream;
		main.srcObject = deviceId ? stream : null;

		main.onloadedmetadata = async (e) => {
			main.current.srcElement = e.srcElement;
			e.srcElement.requestPictureInPicture();
		};
	};

	const BottomTools = () => (
		<div className="relative flex flex-col items-center justify-center w-full text-white">
			<div className="flex flex-row justify-center w-full items-center">
				<div
					style={{ width: '100%', maxWidth: 'calc(85vh * 16/9)' }}
					className="flex flex-row justify-between items-center"
				>
					{/* Start */}
					<div className="flex flex-row gap-4">
						{/* Video input */}
						<div className="flex flex-col gap-3 m-2">
							<Typography variant="small">Video Input</Typography>

							<div className="flex justify-center items-center ">
								<Icon icon="clarity:video-camera-line" className="mr-2" />
								<div className="text-black">
									<Select
										value={screenDevice}
										onValueChange={(value) => setScreenDevice(value !== 'none' ? value : '')}
									>
										<SelectTrigger className="w-[180px] bg-white">
											<div className="truncate">
												<SelectValue placeholder="Select Screen Device" />
											</div>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">None</SelectItem>
											<SelectItem value="Screen Recording">Screen Recorder</SelectItem>
											{devices.video.map(({ deviceId, label }) => {
												if (!label) return '';
												return (
													<SelectItem key={deviceId} value={deviceId}>
														{label}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>
							</div>

							{screenDevice === 'Screen Recording' && (
								<div className="flex justify-center items-center">
									<Icon icon="iconamoon:profile-duotone" className="mr-2" />
									<div className="text-black">
										<Select
											value={screenDevice2}
											onValueChange={(value) => setScreenDevice2(value !== 'none' ? value : '')}
										>
											<SelectTrigger className="w-[180px] bg-white">
												<div className="truncate">
													<SelectValue placeholder="Select Screen Device" />
												</div>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												{devices.video.map(({ deviceId, label }) => {
													if (!label) return '';
													return (
														<SelectItem key={deviceId} value={deviceId}>
															{label}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
									</div>
								</div>
							)}
						</div>

						{/* Audio input */}
						<div className="flex flex-col gap-3 m-2">
							<Typography variant="small">
								{/* className="text-white" */}
								Audio Input
							</Typography>

							<div className="flex justify-center items-center">
								<Icon icon="iconamoon:microphone-duotone" className="mr-2" />
								<div className="text-black">
									<Select value={audioDevice} onValueChange={(value) => setAudioDevice(value !== 'none' ? value : '')}>
										<SelectTrigger className="w-[180px] bg-white">
											<div className="truncate">
												<SelectValue placeholder="Select Audio Device" />
											</div>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">None</SelectItem>
											{devices.audio.map(({ deviceId, label }) => {
												if (!label) return '';
												return (
													<SelectItem key={deviceId} value={deviceId}>
														{label}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>

					{/* End */}
					<div className="flex items-center gap-10">
						<div className="flex flex-col items-center gap-2 text-white relative">
							{true && (
								<>
									<div className="rounded-xl p-1 px-6 bg-blue-600 text-center">
										<Typography variant="large">{formatTimestamp(timelapsed)}</Typography>
									</div>

									<div className="text-yellow-300 absolute -bottom-8">
										{timelapsed > 0 && <Typography variant="small">Recording ...</Typography>}
									</div>
								</>
							)}
						</div>

						<div className="flex flex-col gap-3 m-2">
							<Typography variant="small">Question</Typography>

							<div className="flex justify-center items-center">
								{/* <Icon icon="iconamoon:microphone-duotone" className="mr-2" /> */}
								<div className="text-black">
									<Select value={question} onValueChange={(value) => setQuestion(value !== 'none' ? value : '')}>
										<SelectTrigger className="w-[180px] bg-white">
											<div className="truncate">
												<SelectValue placeholder="Select Question" />
											</div>
										</SelectTrigger>
										<SelectContent className="max-h-[90vh] overflow-x-auto">
											<SelectItem value="none">None</SelectItem>
											{(questions || []).map(({ id, text }) => (
												<SelectItem key={id} value={id}>
													{text}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Overlay */}
			<div className="absolute flex flex-row justify-center ">
				<div className="flex flex-row gap-10 text-4xl text-white">
					<div>
						<div className="relative">
							<button className="rounded-full p-3 bg-blue-600 relative z-10 scale-95">
								<Icon icon="ph:microphone-bold" />
							</button>

							<div
								style={{ transform: `scale(${volumeDisplay})`, transition: 'transform 0.1s linear' }}
								className="absolute top-0 left-0 w-full h-full bg-blue-400 rounded-full"
							/>
						</div>
					</div>

					{/* <button className="rounded-full p-3 bg-blue-600">
						<Icon icon="majesticons:video" />
					</button> */}

					{/* <button className="rounded-full p-3 bg-white text-black">
						<Icon icon="iconamoon:restart" />
					</button> */}

					{/* <button className="rounded-full p-3">
						<Icon icon="iconamoon:stop" />
					</button> */}

					<button
						onClick={startRecording}
						className="flex rounded-full p-3 bg-[#E87259] relative justify-center items-center"
					>
						<Icon icon={!isRecording ? 'fluent:record-48-filled' : 'fluent:record-stop-48-filled'} className="z-10" />
						{isRecording && (
							<div className="animate-ping absolute inline-flex h-5/6 w-5/6 rounded-full bg-red-400 opacity-75 z-0" />
						)}
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col h-screen justify-evenly bg-[#001027]">
			<div className="flex flex-col items-center justify-center">
				{/* Resources */}
				<video ref={webcamRef} autoPlay className="h-full hidden" />
				<video ref={videoRef} autoPlay className="h-full hidden" />
				<video ref={overlayCameraRef} autoPlay className="h-full hidden" />

				<div className="w-full h-full flex justify-center relative">
					<div
						className="flex justify-center items-center max-w-screen-2xl  bg-gray-700 rounded-3xl overflow-hidden"
						style={{ width: '100%', maxWidth: 'calc(85vh * 16/9)', height: '100%', maxHeight: 'calc(26vw * 16/9)' }}
					>
						<video
							muted
							ref={mainRef}
							autoPlay
							controls={false}
							width={1920}
							height={1080}
							className={`h-full w-full ${screenDevice === 'Screen Recording' && 'opacity-0'}`}
						/>
						{screenDevice === 'Screen Recording' && (
							<div className="absolute text-white">
								<Typography variant="large">You are screen recording ...</Typography>
							</div>
						)}
					</div>
				</div>
			</div>

			<BottomTools />
		</div>
	);
}
