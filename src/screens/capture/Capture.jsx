import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/chadcn/Select';
import { Typography } from '@/chadcn/Typography';
import useQuestions from '@/hooks/useQuestions.js';
import { useIndexedDBVideos } from '@/hooks/useIndexedDBVideos';
import { formatTimestamp } from '@/lib/utils';
import { useAuth } from '@/providers/Authentication.jsx';
import { useFFMPEG } from '@/hooks/useFFMPEG';
import { Button } from '@/chadcn/Button';
import { useIndexedDBDictionary } from '@/hooks/useIndexedDBDictionary';
import audioWorkletProcessor from './audio-worklet-processor?worker&url'; // ! This import is not supported if the file is TS
import { throttle } from '@/lib/utils';

export function CaptureScreen() {
	// Hooks
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { user } = useAuth();
	const { saveVideo: saveVideoIDB } = useIndexedDBVideos('local-unlisted-videos', 1);
	const { saveKeyValue, getValueByKey } = useIndexedDBDictionary('capture-preferences', 1);
	const { data: questions } = useQuestions({ forUser: user?.id });
	const { mux, loadFFMPEG } = useFFMPEG();

	const query = new URLSearchParams(search);

	// State
	const [isRecording, setRecording] = React.useState(false);
	const [devices, setDevices] = React.useState({ audio: [], video: [] });
	const [screenDevice, setScreenDevice] = React.useState('');
	const [screenDevice2, setScreenDevice2] = React.useState('');
	const [audioDevice, setAudioDevice] = React.useState('');
	const [timelapsed, setTimeLapsed] = React.useState(0);
	const [audioTracks, setRecordedAudio] = React.useState([]);
	const [videoTracks, setRecordedVideo] = React.useState([]);
	const [question, setQuestion] = React.useState(query.get('questionId'));

	// Refs
	const webcamRef = React.useRef(null);
	const videoRef = React.useRef(null);
	const overlayCameraRef = React.useRef(null);
	const mainRef = React.useRef();
	const streamRef = React.useRef();
	const mainVideoRecorderRef = React.useRef();
	const profileVideoRecorderRef = React.useRef();
	const profileAudioRecorderRef = React.useRef();
	const volumeDisplay = React.useRef();

	// Shows audio input levels
	React.useEffect(() => {
		let audioContext = new AudioContext();
		let sourceNode;
		let processorNode;

		const setupAudio = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice } });
			await audioContext.audioWorklet.addModule(audioWorkletProcessor);

			sourceNode = audioContext.createMediaStreamSource(stream);
			processorNode = new AudioWorkletNode(audioContext, 'vumeter');

			const setVolumeDisplayThrottled = throttle((input) => (volumeDisplay.current.style.scale = input), 100);

			processorNode.port.onmessage = (event) => {
				if (event.data.type === 'audioData') {
					const { average } = event.data.data;
					const volume = 1 + average * 8;
					const max_cap = 1.3;
					setVolumeDisplayThrottled(volume > max_cap ? max_cap : volume);
				}
			};

			sourceNode.connect(processorNode).connect(audioContext.destination);
		};
		setupAudio();

		// Clean
		return () => {
			if (processorNode) processorNode.disconnect();
			if (sourceNode) sourceNode.disconnect();
			audioContext.close();
		};
	}, [audioDevice]);

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
			getValueByKey('video_device_1').then((value) => setScreenDevice(value ? value : devicesList.video[0].deviceId));
			getValueByKey('video_device_2').then((value) => setScreenDevice2(value));
			getValueByKey('audio_device_1').then((value) => setAudioDevice(value ? value : devicesList.audio[0].deviceId));
		},
		[setDevices]
	);

	// Loading FFMPEG over CDN
	React.useEffect(() => {
		loadFFMPEG().catch(console.error);
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

	// Save preferences whenever selected devices changes
	React.useEffect(() => {
		const { audio, video } = devices;
		if (audio.length && video.length) savePreferences(screenDevice, screenDevice2, audioDevice);
	}, [screenDevice, screenDevice2, audioDevice]);

	// Handles input device (audio/video) change
	React.useEffect(() => {
		if (screenDevice.length) {
			startScreen(screenDevice).catch(console.error);
		}

		// TODO: Clean tracks
		// return () => {
		//   // canvasRef.current = null;
		//   if (webcamRef.current?.srcObject) webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
		//   if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
		// };
	}, [screenDevice]);

	// Handles input device (audio/video) change
	React.useEffect(() => {
		if (screenDevice2.length) {
			startScreen2(screenDevice2).catch(console.error);
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
		if (audioTracks.length && videoTracks.length) {
			if (document.pictureInPictureElement) document.exitPictureInPicture();
			handleRecordedVideo(videoTracks, audioTracks).catch(console.error);
			stopScreenSharing();
		}
	}, [audioTracks, videoTracks]);

	const handleRecordedVideo = async (videoTracks, audioTracks) => {
		const hasAudio = videoTracks[0].target.audioBitsPerSecond > 0;
		// TODO: MAYBE/? Change to send this as a stream to the data base so it can save it even faster without losing any info after done.
		const [mainVideo, profileVideo] = videoTracks.map((track) => new Blob([track?.data], { type: 'video/mp4' }));
		const recordedAudio = new Blob([audioTracks?.[0].data], { type: 'audio/mpeg' });

		const videoURL = URL.createObjectURL(mainVideo);
		const audioURL = URL.createObjectURL(recordedAudio);

		// console.log(hasAudio);
		const { blob: muxedVideo } = await mux(videoURL, audioURL, { hasAudio });

		// ? For testing - mux has an url property
		// window.open(url);

		const request = await saveVideoIDB(muxedVideo);

		request.onsuccess = ({ target }) => {
			query.set('id', target.result);
			navigate({ pathname: 'preview', search: query.toString() });
		};
	};

	const stopScreenSharing = () => {
		if (streamRef.current) {
			const tracks = streamRef.current.getTracks();
			tracks.forEach((track) => track.stop());
			streamRef.current = null;
			mainRef.current.srcObject = null;
		}
	};

	const stopRecording = () => {
		setRecording(false);
		mainVideoRecorderRef.current?.stop();
		profileVideoRecorderRef.current?.stop();
		profileAudioRecorderRef.current?.stop();
	};

	const startRecording = async () => {
		if (!isRecording && !!screenDevice.length && !!audioDevice?.length) {
			// Define Inputs
			const mainVideo = mainRef.current.captureStream(); // main video
			const profileVideo = overlayCameraRef.current.captureStream(); // profile video
			const profileAudio = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice } }); // main audio

			// Generate combined stream
			const mainVideoRecorder = mainVideo.active ? new MediaRecorder(mainVideo) : null;
			const profileVideoRecorder = profileVideo.active ? new MediaRecorder(profileVideo) : null;
			const profileAudioRecorder = profileAudio.active ? new MediaRecorder(profileAudio) : null;
			mainVideoRecorderRef.current = mainVideoRecorder;
			profileVideoRecorderRef.current = profileAudioRecorder;
			profileAudioRecorderRef.current = profileVideoRecorder;

			// Start recording
			mainVideoRecorder?.start();
			profileVideoRecorder?.start();
			profileAudioRecorder?.start();
			setRecording(true);

			// Video stopped
			// mainVideoRecorder?.addEventListener('dataavailable', setRecordedVideo); // Video was stopped
			// profileVideoRecorder?.addEventListener('dataavailable', setRecordedVideo);

			// Audio stopped
			// profileAudioRecorder?.addEventListener('dataavailable', setRecordedAudio);

			// !multiple track v1
			// Video stopped
			mainVideoRecorder?.addEventListener('dataavailable', (params) => setRecordedVideo((prev) => [...prev, params])); // Video was stopped
			profileVideoRecorder?.addEventListener('dataavailable', (params) =>
				setRecordedVideo((prev) => [...prev, params])
			);

			// Audio stopped
			profileAudioRecorder?.addEventListener('dataavailable', (params) =>
				setRecordedAudio((prev) => [...prev, params])
			);
		}
	};

	const savePreferences = (videoDev1, videoDev2, audioDev1) => {
		// console.log({ videoDev1, videoDev2, audioDev1 });
		saveKeyValue('video_device_1', videoDev1);
		saveKeyValue('video_device_2', videoDev2);
		saveKeyValue('audio_device_1', audioDev1);
	};

	// TODO: Make this start screen more modular (independent) from state
	const startScreen = async (deviceId) => {
		const hasAudio = deviceId === 'Screen Recording';
		const isDisplayMedia = deviceId === 'Screen Recording';
		const config = { video: { width: 1920, height: 1080, deviceId }, audio: hasAudio };
		const main = mainRef.current;

		// Set default config depending on the media source

		const mediaStore = {
			getDisplayMedia: async (props) => navigator.mediaDevices.getDisplayMedia({ ...props }),
			getUserMedia: async (props) => navigator.mediaDevices.getUserMedia({ ...props })
		};

		const stream = await mediaStore[isDisplayMedia ? 'getDisplayMedia' : 'getUserMedia'](config);

		stream.getTracks().forEach((track) => {
			// Stopped by media event API
			track.onended = (evt) => {
				if (isRecording) startRecording();
				setScreenDevice('');
				setScreenDevice2('');
				exitPictureInPicture();
				stopRecording();
				// mainRef.current = null;
			};
		});

		streamRef.current = stream;
		main.srcObject = deviceId ? stream : null;
		// if (main) main.srcObject = deviceId ? stream : null;

		// TODO : fix this for facing mode
		// main.style.transform = !isDisplayMedia ? "scaleX(-1)" : "scaleX(1)";
	};

	const startScreen2 = async (deviceId) => {
		const main = overlayCameraRef.current;
		// new HTMLVideoElement().onloadedmetadata;

		const stream = await navigator.mediaDevices.getUserMedia({
			video: { width: 1920, height: 1080, deviceId },
			audio: false
		});

		main.current = stream;
		main.srcObject = deviceId ? stream : null;
		// if (main) main.srcObject = deviceId ? stream : null;

		main.onloadedmetadata = async (e) => {
			main.current.srcElement = e.srcElement;
			e.srcElement.requestPictureInPicture();
		};
	};

	const startPictureInPicture = () => {
		overlayCameraRef.current.requestPictureInPicture();
	};

	const exitPictureInPicture = () => {
		if (document.pictureInPictureElement) document.exitPictureInPicture();
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

							<div className="flex justify-start items-center gap-3">
								<Icon icon="clarity:video-camera-line" className="mr-2" />
								<div className="text-black">
									<Select
										disabled={isRecording}
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
								<div className="flex justify-start items-center gap-3">
									<Icon icon="iconamoon:profile-duotone" className="mr-2" />
									<div className="text-black">
										<Select
											disabled={isRecording}
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
									<Button variant="outline" className="rounded-md" onClick={startPictureInPicture}>
										<Icon icon="material-symbols:picture-in-picture" />
									</Button>
								</div>
							)}
						</div>

						{/* Audio input */}
						<div className="flex flex-col gap-3 m-2">
							<Typography variant="small">
								{/* className="text-white" */}
								Audio Input
							</Typography>

							<div className="flex justify-start items-center gap-3">
								<Icon icon="iconamoon:microphone-duotone" className="mr-2" />
								<div className="text-black">
									<Select
										disabled={isRecording}
										value={audioDevice}
										onValueChange={(value) => setAudioDevice(value !== 'none' ? value : '')}
									>
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

						<div className="flex flex-col gap-3 m-2 hidden">
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
								ref={volumeDisplay}
								// transform: `scale(${volumeDisplay.current})`,
								style={{ transition: 'all 0.1s linear' }}
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
						onClick={isRecording ? stopRecording : startRecording}
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
