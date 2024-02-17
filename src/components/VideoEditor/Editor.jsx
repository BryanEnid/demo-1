import { useState, useRef, useEffect } from 'react';
import './editor.css';

// https://github.com/ffmpegwasm/ffmpeg.wasm/blob/master/docs/api.md
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

import { Icon } from '@iconify/react';
import { Image } from '../Image';

const {
	faVolumeMute,
	faVolumeUp,
	faPause,
	faPlay,
	faGripLinesVertical,
	faSync,
	faStepBackward,
	faStepForward,
	faCamera,
	faDownload,
	faEraser
} = {
	faVolumeMute: '',
	faVolumeUp: 'formkit:volumeup',
	faPause: 'formkit:pause',
	faPlay: 'formkit:caretright',
	faGripLinesVertical: 'bi:grip-vertical',
	faSync: 'ic:outline-sync',
	faStepBackward: 'formkit:stepback',
	faStepForward: 'formkit:stepforward',
	faCamera: 'formkit:instagram',
	faDownload: 'formkit:upload',
	faEraser: 'formkit:close'
};

function Editor({ videoUrl, timings, setTimings }) {
	// Boolean state to handle video mute
	const [isMuted, setIsMuted] = useState(false);

	// Boolean state to handle whether video is playing or not
	const [playing, setPlaying] = useState(false);

	// Float integer state to help with trimming duration logic
	const [difference, setDifference] = useState(0.2);

	// Boolean state to handle deleting grabber functionality
	const [deletingGrabber, setDeletingGrabber] = useState(false);

	// State for error handling
	const [currentWarning, setCurrentWarning] = useState(null);

	// State for imageUrl
	const [imageUrl, setImageUrl] = useState('');

	// Boolean state handling trimmed video
	const [trimmingDone, setTrimmingDone] = useState(false);

	// Integer state to blue progress bar as video plays
	const [seekerBar, setSeekerBar] = useState(0);

	// Ref handling metadata needed for trim markers
	const currentlyGrabbedRef = useRef({ index: 0, type: 'none' });

	// Ref handling the trimmed video element
	const trimmedVidRef = useRef();

	// Ref handling the initial video element for trimming
	const playVideoRef = useRef();

	// Ref handling the progress bar element
	const progressBarRef = useRef();

	// Ref handling the element of the current play time
	const playBackBarRef = useRef();

	// Variable for error handling on the delete grabber functionality
	const warnings = { delete_grabber: <div>Please click on the grabber (either start or end) to delete it</div> };

	// State handling storing of the trimmed video
	const [trimmedVideo, setTrimmedVideo] = useState();

	// Integer state to handle the progress bars numerical incremation
	const [progress, setProgress] = useState(0);

	// Boolean state handling whether ffmpeg has loaded or not
	const [ready, setReady] = useState(false);

	// Ref to handle the current instance of ffmpeg when loaded
	const ffmpeg = useRef(null);

	// Function handling loading in ffmpeg
	const load = async () => {
		try {
			await ffmpeg.current.load();

			setReady(true);
		} catch (error) {
			console.log(error);
		}
	};

	// Loading in ffmpeg when this component renders
	useEffect(() => {
		ffmpeg.current = new FFmpeg();
		load();
	}, []);

	// Lifecycle handling the logic needed for the progress bar - displays the blue bar that grows as the video plays
	// useEffect(() => {
	//   if (playVideoRef.current.onloadedmetadata) {
	//     const currentIndex = currentlyGrabbedRef.current.index;
	//     const seek = ((playVideoRef.current.currentTime - timings[0].start) / playVideoRef.current.duration) * 100;
	//     setSeekerBar(seek);
	//     progressBarRef.current.style.width = `${seekerBar}%`;
	//     if (playVideoRef.current.currentTime >= timings[0].end) {
	//       playVideoRef.current.pause();
	//       setPlaying(false);
	//       currentlyGrabbedRef.current = { index: currentIndex + 1, type: "start" };
	//       progressBarRef.current.style.width = "0%";
	//       progressBarRef.current.style.left = `${(timings[0].start / playVideoRef.current.duration) * 100}%`;
	//       playVideoRef.current.currentTime = timings[0].start;
	//     }
	//   }

	//   window.addEventListener("keyup", (event) => {
	//     if (event.key === " ") {
	//       playPause();
	//     }
	//   });

	//   //Handles the start and end metadata for the timings state
	//   const time = timings;
	//   playVideoRef.current.onloadedmetadata = () => {
	//     if (time.length === 0) {
	//       time.push({ start: 0, end: playVideoRef.current.duration });
	//       setTimings(time);
	//       addActiveSegments();
	//     } else {
	//       addActiveSegments();
	//     }
	//   };
	// });

	// Lifecycle that handles removing event listener from the mouse event on trimmer - Desktop browser
	useEffect(() => window.removeEventListener('mouseup', removeMouseMoveEventListener), []);

	// Lifecycle that handles removing event listener from the touch/pointer event on trimmer - mobile browser
	useEffect(() => window.removeEventListener('pointerup', removePointerMoveEventListener), []);

	// Function handling the trimmer movement logic
	const handleMouseMoveWhenGrabbed = (event) => {
		playVideoRef.current.pause();
		addActiveSegments();
		const playbackRect = playBackBarRef.current.getBoundingClientRect();
		const seekRatio = (event.clientX - playbackRect.left) / playbackRect.width;
		const { index } = currentlyGrabbedRef.current;
		const { type } = currentlyGrabbedRef.current;
		const time = timings;
		const seek = playVideoRef.current.duration * seekRatio;
		if (
			type === 'start' &&
			seek > (index !== 0 ? time[index - 1].end + difference + 0.2 : 0) &&
			seek < time[index].end - difference
		) {
			progressBarRef.current.style.left = `${seekRatio * 100}%`;
			playVideoRef.current.currentTime = seek;
			time[index].start = seek;
			setPlaying(false);
			setTimings(time);
		} else if (
			type === 'end' &&
			seek > time[index].start + difference &&
			seek < (index !== timings.length - 1 ? time[index].start - difference - 0.2 : playVideoRef.current.duration)
		) {
			progressBarRef.current.style.left = `${(time[index].start / playVideoRef.current.duration) * 100}%`;
			playVideoRef.current.currentTime = time[index].start;
			time[index].end = seek;
			setPlaying(false);
			setTimings(time);
		}
		progressBarRef.current.style.width = '0%';
	};

	// Function that handles removing event listener from the mouse event on trimmer - Desktop browser
	const removeMouseMoveEventListener = () => {
		window.removeEventListener('mousemove', handleMouseMoveWhenGrabbed);
	};

	// Lifecycle that handles removing event listener from the mouse event on trimmer - Mobile browser
	const removePointerMoveEventListener = () => {
		window.removeEventListener('pointermove', handleMouseMoveWhenGrabbed);
	};

	// Function handling reset logic
	const reset = () => {
		playVideoRef.current.pause();

		setIsMuted(false);
		setPlaying(false);
		currentlyGrabbedRef.current = { index: 0, type: 'none' };
		setDifference(0.2);
		setDeletingGrabber(false);
		setCurrentWarning(false);
		setImageUrl('');

		setTimings([{ start: 0, end: playVideoRef.current.duration }]);
		playVideoRef.current.currentTime = timings[0].start;
		progressBarRef.current.style.left = `${(timings[0].start / playVideoRef.current.duration) * 100}%`;
		progressBarRef.current.style.width = '0%';
		addActiveSegments();
	};

	// Function handling thumbnail logic
	const captureSnapshot = () => {
		const video = playVideoRef.current;
		const canvas = document.createElement('canvas');
		// scale the canvas accordingly
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		// draw the video at that frame
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		// convert it to a usable data URL
		const dataURL = canvas.toDataURL();
		setImageUrl({ imageUrl: dataURL });
	};

	// Function handling download of thumbnail logic
	const downloadSnapshot = () => {
		const a = document.createElement('a'); // Create <a>
		a.href = imageUrl; // Image Base64 Goes here
		a.download = 'Thumbnail.png'; // File name Here
		a.click(); // Downloaded file
	};

	// Function handling skip to previous logic
	const skipPrevious = () => {
		if (playing) {
			playVideoRef.current.pause();
		}
		// let previousIndex = (currentlyGrabbed.index !== 0) ? (currentlyGrabbed.index - 1) : (timings.length - 1)
		// setCurrentlyGrabbed({currentlyGrabbed: {'index': previousIndex, 'type': 'start'}, playing: false})
		// currentlyGrabbedRef.current = {'index': previousIndex, 'type': 'start'}
		// progressBarRef.current.style.left = `${timings[previousIndex].start / playVideoRef.current.duration * 100}%`
		// progressBarRef.current.style.width = '0%'
		// playVideoRef.current.currentTime = timings[previousIndex].start
	};

	// Function handling play and pause logic
	const playPause = () => {
		if (playing) {
			playVideoRef.current.pause();
		} else {
			if (playVideoRef.current.currentTime >= timings[0].end) {
				playVideoRef.current.pause();
				setPlaying(false);
				currentlyGrabbedRef.current = { index: 0, type: 'start' };
				playVideoRef.current.currentTime = timings[0].start;
				progressBarRef.current.style.left = `${(timings[0].start / playVideoRef.current.duration) * 100}%`;
				progressBarRef.current.style.width = '0%';
			}
			playVideoRef.current.play();
		}
		setPlaying(!playing);
	};

	// Function handling skip to next logic
	const skipNext = () => {
		if (playing) {
			playVideoRef.current.pause();
		}
		// let nextIndex = (currentlyGrabbed.index !== (timings.length - 1)) ? (currentlyGrabbed.index + 1) : 0
		// setCurrentlyGrabbed({currentlyGrabbed: {'index': nextIndex, 'type': 'start'}, playing: false})
		// currentlyGrabbedRef.current = {'index': nextIndex, 'type': 'start'}
		// progressBarRef.current.style.left = `${timings[nextIndex].start / playVideoRef.current.duration * 100}%`
		// progressBarRef.current.style.width = '0%'
		// playVideoRef.current.currentTime = timings[nextIndex].start
	};

	// Function handling updating progress logic (clicking on progress bar to jump to different time durations)
	const updateProgress = (event) => {
		const playbackRect = playBackBarRef.current.getBoundingClientRect();
		const seekTime = ((event.clientX - playbackRect.left) / playbackRect.width) * playVideoRef.current.duration;
		playVideoRef.current.pause();
		// find where seekTime is in the segment
		let index = -1;
		let counter = 0;
		for (const times of timings) {
			if (seekTime >= times.start && seekTime <= times.end) {
				index = counter;
			}
			counter += 1;
		}
		if (index === -1) {
			return;
		}
		setPlaying(false);
		currentlyGrabbedRef.current = { index, type: 'start' };
		progressBarRef.current.style.width = '0%'; // Since the width is set later, this is necessary to hide weird UI
		progressBarRef.current.style.left = `${(timings[index].start / playVideoRef.current.duration) * 100}%`;
		playVideoRef.current.currentTime = seekTime;
	};

	// Function handling adding new trim markers logic
	const addGrabber = () => {
		const time = timings;
		const end = time[time.length - 1].end + difference;
		setDeletingGrabber({ deletingGrabber: false, currentWarning: null });
		if (end >= playVideoRef.current.duration) {
			return;
		}
		time.push({ start: end + 0.2, end: playVideoRef.current.duration });
		setTimings(time);
		addActiveSegments();
	};

	// Function handling first step of deleting trimmer
	const preDeleteGrabber = () => {
		if (deletingGrabber) {
			setDeletingGrabber({ deletingGrabber: false, currentWarning: null });
		} else {
			setDeletingGrabber({ deletingGrabber: true, currentWarning: 'delete_grabber' });
		}
	};

	// Function handling deletion of trimmers logic
	const deleteGrabber = (index) => {
		const time = timings;
		setDeletingGrabber({ deletingGrabber: false, currentWarning: null, currentlyGrabbed: { index: 0, type: 'start' } });
		setDeletingGrabber({ deletingGrabber: false, currentWarning: null, currentlyGrabbed: { index: 0, type: 'start' } });
		if (time.length === 1) {
			return;
		}
		time.splice(index, 1);
		progressBarRef.current.style.left = `${(time[0].start / playVideoRef.current.duration) * 100}%`;
		playVideoRef.current.currentTime = time[0].start;
		progressBarRef.current.style.width = '0%';
		addActiveSegments();
	};

	// Function handling logic of time segments throughout videos duration
	const addActiveSegments = () => {
		let colors = '';
		let counter = 0;
		colors += `, rgb(240, 240, 240) 0%, rgb(240, 240, 240) ${
			(timings[0].start / playVideoRef.current.duration) * 100
		}%`;
		for (const times of timings) {
			if (counter > 0) {
				colors += `, rgb(240, 240, 240) ${
					(timings[counter].end / playVideoRef.current.duration) * 100
				}%, rgb(240, 240, 240) ${(times.start / playVideoRef.current.duration) * 100}%`;
			}
			colors += `, #ccc ${(times.start / playVideoRef.current.duration) * 100}%, #ccc ${
				(times.end / playVideoRef.current.duration) * 100
			}%`;
			counter += 1;
		}
		colors += `, rgb(240, 240, 240) ${
			(timings[counter - 1].end / playVideoRef.current.duration) * 100
		}%, rgb(240, 240, 240) 100%`;
		playBackBarRef.current.style.background = `linear-gradient(to right${colors})`;
	};

	// Function handling logic for post trimmed video
	const saveVideo = async (fileInput) => {
		const metadata = {
			trim_times: timings,
			mute: isMuted
		};
		console.log(metadata.trim_times);
		const trimStart = metadata.trim_times[0].start;
		const trimEnd = metadata.trim_times[0].end;

		const trimmedVideo = trimEnd - trimStart;

		console.log('Trimmed Duration: ', trimmedVideo);
		console.log('Trim End: ', trimEnd);

		try {
			// Disabling new-cap for FS function

			ffmpeg.current.FS('writeFile', 'myFile.mp4', await fetchFile(videoUrl));

			ffmpeg.current.setProgress(({ ratio }) => {
				console.log('ffmpeg progress: ', ratio);
				if (ratio < 0) {
					setProgress(0);
				}
				setProgress(Math.round(ratio * 100));
			});

			await ffmpeg.current.run(
				'-ss',
				`${trimStart}`,
				'-accurate_seek',
				'-i',
				'myFile.mp4',
				'-to',
				`${trimmedVideo}`,
				'-codec',
				'copy',
				'output.mp4'
			);

			// Disabling new-cap for FS function

			const data = ffmpeg.current.FS('readFile', 'output.mp4');

			const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

			setTrimmedVideo(url);
			setTrimmingDone(true);
			// setLottiePlaying(false)
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="wrapper">
			{/* Video element for the trimmed video */}
			{trimmingDone ? (
				<div
					style={{
						maxHeight: '100vh',
						marginTop: '50vh'
					}}
				>
					<video
						style={{
							width: '100%',
							marginTop: '100px',
							borderRadius: '20px',
							border: '4px solid #0072cf'
						}}
						ref={trimmedVidRef}
						controls
						autoload="metadata"
						onClick={() => console.log(trimmedVidRef.current.duration)}
					>
						<source src={trimmedVideo} type="video/mp4" />
					</video>
				</div>
			) : null}
			{/* Main video element for the video editor */}
			<video
				className="video"
				autoload="metadata"
				muted={isMuted}
				ref={playVideoRef}
				onLoadedData={() => {
					console.log(playVideoRef);
					playPause();
				}}
				onClick={() => {
					playPause();
				}}
				onTimeUpdate={() => {
					setSeekerBar(progressBarRef.current.style.width);
				}}
			>
				<source src={videoUrl} type="video/mp4" />
			</video>
			<div className="playback">
				{/* If there is an instance of the playVideoRef, render the trimmer markers */}
				{/* {playVideoRef.current
					? Array.from(timings).map((timing, index) => (
							<div key={index}>
								<div key={`grabber_${index}`}>
									<div
										id="grabberStart"
										className="grabber start"
										style={{ left: `${(timings[0].start / playVideoRef.current.duration) * 100}%` }}
										// Events for desktop - Start marker
										onMouseDown={(event) => {
											if (deletingGrabber) {
												deleteGrabber(index);
											} else {
												currentlyGrabbedRef.current = { index, type: 'start' };
												window.addEventListener('mousemove', handleMouseMoveWhenGrabbed);
												window.addEventListener('mouseup', removeMouseMoveEventListener);
											}
										}}
										// Events for mobile - Start marker
										onPointerDown={() => {
											if (deletingGrabber) {
												deleteGrabber(index);
											} else {
												currentlyGrabbedRef.current = { index, type: 'start' };
												window.addEventListener('pointermove', handleMouseMoveWhenGrabbed);
												window.addEventListener('pointerup', removePointerMoveEventListener);
											}
										}}
									>
										<svg
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											x="0"
											y="0"
											width="10"
											height="14"
											viewBox="0 0 10 14"
											xmlSpace="preserve"
										>
											<path
												className="st0"
												d="M1 14L1 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C2 13.6 1.6 14 1 14zM5 14L5 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C6 13.6 5.6 14 5 14zM9 14L9 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C10 13.6 9.6 14 9 14z"
											/>
										</svg>
									</div>

									<div
										id="grabberEnd"
										className="grabber end"
										style={{ left: `${(timings[0].end / playVideoRef.current.duration) * 100}%` }}
										// Events for desktop - End marker
										onMouseDown={(event) => {
											if (deletingGrabber) {
												deleteGrabber(index);
											} else {
												currentlyGrabbedRef.current = { index, type: 'end' };
												window.addEventListener('mousemove', handleMouseMoveWhenGrabbed);
												window.addEventListener('mouseup', removeMouseMoveEventListener);
											}
										}}
										// Events for mobile - End marker
										onPointerDown={() => {
											if (deletingGrabber) {
												deleteGrabber(index);
											} else {
												currentlyGrabbedRef.current = { index, type: 'end' };
												window.addEventListener('pointermove', handleMouseMoveWhenGrabbed);
												window.addEventListener('pointerup', removePointerMoveEventListener);
											}
										}}
									>
										<svg
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											x="0"
											y="0"
											width="10"
											height="14"
											viewBox="0 0 10 14"
											xmlSpace="preserve"
										>
											<path
												className="st0"
												d="M1 14L1 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C2 13.6 1.6 14 1 14zM5 14L5 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C6 13.6 5.6 14 5 14zM9 14L9 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C10 13.6 9.6 14 9 14z"
											/>
										</svg>
									</div>
								</div>
							</div>
					  ))
					: []} */}
				<div className="seekable" ref={playBackBarRef} onClick={updateProgress} />
				<div className="progress" ref={progressBarRef} />
			</div>

			<div className="controls">
				<div className="player-controls">
					<button className="settings-control" title="Reset Video" onClick={reset}>
						<Icon icon={faSync} />
					</button>
					<button
						className="settings-control"
						title="Mute/Unmute Video"
						onClick={() => setIsMuted({ isMuted: !isMuted })}
					>
						{isMuted ? <Icon icon={faVolumeMute} /> : <Icon icon={faVolumeUp} />}
					</button>
					<button className="settings-control" title="Capture Thumbnail" onClick={captureSnapshot}>
						<Icon icon={faCamera} />
					</button>
				</div>
				<div className="player-controls">
					<button className="seek-start" title="Skip to previous clip" onClick={skipPrevious}>
						<Icon icon={faStepBackward} />
					</button>
					<button className="play-control" title="Play/Pause" onClick={playPause}>
						{playing ? <Icon icon={faPause} /> : <Icon icon={faPlay} />}
					</button>
					<button className="seek-end" title="Skip to next clip" onClick={skipNext}>
						<Icon icon={faStepForward} />
					</button>
				</div>
				<div>
					<button title="Add grabber" className="trim-control margined" onClick={addGrabber}>
						Add <Icon icon={faGripLinesVertical} />
					</button>
					<button title="Delete grabber" className="trim-control margined" onClick={preDeleteGrabber}>
						Delete <Icon icon={faGripLinesVertical} />
					</button>
					<button title="Save changes" className="trim-control" onClick={saveVideo}>
						Save
					</button>
				</div>
			</div>
			{ready ? <div /> : <div>Loading...</div>}
			{currentWarning != null ? <div className="warning">{warnings[currentWarning]}</div> : ''}
			{imageUrl !== '' ? (
				<div className="marginVertical">
					<Image src={imageUrl} className="thumbnail" alt="Photos" />
					<div className="controls">
						<div className="player-controls">
							<button className="settings-control" title="Reset Video" onClick={downloadSnapshot}>
								<Icon icon={faDownload} />
							</button>
							<button
								className="settings-control"
								title="Save Video"
								onClick={() => {
									setImageUrl('');
								}}
							>
								<Icon icon={faEraser} />
							</button>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default Editor;
