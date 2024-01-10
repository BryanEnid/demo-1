import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { Icon } from '@iconify/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

import { cn, generatePreview } from '@/lib/utils';
import { PageModal } from '@/components/PageModal';
import TextEditor from '@/components/TextEditor';
import { VR_3D, Video360 } from '@/components/MediaPlayer';
import Overview from '@/components/PreviewBucket/tabs/Overview.jsx';
import QuestionsList from '@/components/QuestionsList.jsx';
import { useProfile } from '@/hooks/useProfile';
import { useBuckets } from '@/hooks/useBuckets';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input';
import { Typography } from '@/chadcn/Typography';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/chadcn/Tabs.jsx';

import { VideoUploadButton } from '../VideoUploadButton.jsx';
import { CircularProgress } from '../CircularProgress.jsx';
import { CachedVideo } from '../CachedVideo.jsx';
import { Spinner } from '../Spinner';

async function getYouTubeVideoDetails(videoId) {
	const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_CLIENT_ID;
	const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();

		if (data.items && data.items.length > 0) {
			const videoDetails = data.items[0].snippet;
			return {
				title: videoDetails.title,
				channelTitle: videoDetails.channelTitle,
				thumbnail: videoDetails.thumbnails.high.url,
				description: videoDetails.description // You can choose different sizes
			};
		}
	} catch (error) {
		console.error('Error fetching YouTube video details', error);
	}

	return null;
}

const QRShareView = ({ show, onClose }) => {
	const [value, setValue] = React.useState(window.location.href);

	const { toast } = useToast();

	return (
		<PageModal show={show} onClose={onClose} width="600px" zIndex={20}>
			<div className="flex flex-col justify-center items-center p-16">
				<div className="flex flex-col justify-center items-center gap-10 ">
					<Typography variant="h3">Share this bucket!</Typography>

					<QRCode fgColor="#1688df" size={256} value={value} viewBox={`0 0 256 256`} />

					<Input
						value={value}
						onClick={() => {
							navigator.clipboard.writeText(value);
							toast({ title: 'Copied to clipboard !' });
						}}
					/>
				</div>
			</div>
		</PageModal>
	);
};

const extractVideoId = (url) => {
	const urlObject = new URL(url);
	const searchParams = new URLSearchParams(urlObject.search);
	return searchParams.get('v');
};

const VideoAddURLModal = ({ show, onClose }) => {
	// Hooks
	const { toast } = useToast();

	const [inputs, setInputs] = React.useState({
		0: { video: null, image: null, source: null, valid: false, type: 'url' }
	});

	// Function to check if the URL is from YouTube
	const isYouTubeUrl = (url) => {
		return url.includes('youtube.com') || url.includes('youtu.be');
	};

	const handleVideoAdded = async (url, index) => {
		if (isYouTubeUrl(url)) {
			// Extract video ID from the URL
			const videoId = extractVideoId(url);

			const embedCode = videoId && (await getYouTubeVideoDetails(videoId));

			const body = { [index]: { ...embedCode, valid: !!embedCode, url } };

			setInputs((prev) => ({ ...prev, ...body }));

			if (!body[index].valid) return;

			const ToasterView = () => (
				<div className="flex flex-col gap-2 ">
					<img src={embedCode.thumbnail} className="w-full object-cover" />

					<Typography variant="small" className="text-md font-bold leading-5 line-clamp-2">
						{embedCode?.title}
					</Typography>

					<Typography variant="small" className="text-sm font-light leading-5 line-clamp-2">
						{embedCode?.description}
					</Typography>

					<Typography variant="small" className="text-xs line-clamp-1">
						By {embedCode?.channelTitle}
					</Typography>
				</div>
			);

			toast({ customView: <ToasterView /> });

			return body;
		}

		// Default
		const { video, image } = inputs[index];
		if (video === null || image === null) return;

		const body = { [index]: { video: null, image: null } };
		setInputs((prev) => ({ ...prev, ...body }));
	};

	const handleAddNewItem = () => {
		const maxLength = 10;
		const currentLength = Object.values(inputs).length;
		if (currentLength >= maxLength) return;

		const newItem = { [currentLength]: { video: null, image: null } };
		setInputs((prev) => ({ ...prev, ...newItem }));
	};

	const handleDeleteItem = (propertyName) => {
		const byDifferentKey = ([key]) => key !== propertyName;
		const newState = Object.fromEntries(Object.entries(inputs).filter(byDifferentKey));
		setInputs(newState);
	};

	const handleClose = () => {
		setInputs({ 0: { video: null, image: null, source: null, valid: false, type: 'url' } });
		onClose();
	};

	const handleSaveDisabled = Object.values(inputs)
		.map(({ valid }) => valid)
		.every(Boolean);

	return (
		<PageModal show={show} width="600px" zIndex={30} onClose={() => onClose(inputs)}>
			<div className="flex flex-col justify-center items-center p-16 ">
				<div className="flex flex-col items-start gap-10 w-full min-h-[500px]">
					<Typography variant="h3">Add video urls</Typography>

					{Array.from(Object.keys(inputs)).map((key) => (
						<div key={key} className="flex flex-col w-full gap-2">
							<div key={key} className="flex flex-row items-center w-full gap-2">
								<div className="inline-flex items-center relative w-full h-full">
									<Input key={key} onChange={({ target }) => handleVideoAdded(target.value, key)} />
									{inputs[key].valid && (
										<div className="absolute right-1 p-1 rounded-full bg-white z-10">
											<Icon fontSize={20} icon="tabler:check" className="text-green-600 h-full" />
										</div>
									)}
								</div>

								<Icon fontSize={20} className="text-gray-500" icon="mi:delete" onClick={() => handleDeleteItem(key)} />
							</div>

							{inputs[key].title && (
								<Typography variant="small" className="text-sm font-bold leading-5 inline-flex">
									{inputs[key].title}
								</Typography>
							)}
						</div>
					))}

					<Button iconBegin={<Icon icon="ic:round-add" />} variant="default" onClick={handleAddNewItem}>
						Add new url
					</Button>
				</div>
				<div className="flex flex-row justify-end gap-2 w-full">
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="default" className="px-10" disabled={!handleSaveDisabled} onClick={() => onClose(inputs)}>
						Save
					</Button>
				</div>
			</div>
		</PageModal>
	);
};

const HoldToTriggerButton = ({ onRelease, text, holdTime }) => {
	const [isHolding, setIsHolding] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [isLoading, setLoading] = React.useState(false);

	const timer = React.useRef();

	const handleHoldPress = () => {
		setIsHolding(true);
		timer.current = setTimeout(() => setSuccess(true), holdTime);
	};

	const handleRelease = ({ cancel }) => {
		clearTimeout(timer.current);

		// If you release the button in any invalid way it will unload the bar
		if ((!success || cancel) && !isLoading) setIsHolding(false);

		// If you release on a valid way, it will show the spinner and the bar will not deplete
		if (success && !cancel) setLoading(true);

		// Skip calling the release when invalid releases were called
		if (cancel) return;

		onRelease({ success });
	};

	return (
		<div className="relative flex justify-center items-center w-full max-w-[150px] border-red-500 rounded-sm border">
			<button
				className="w-full h-full z-20 text-red-500"
				onMouseLeave={() => handleRelease({ cancel: true })}
				onMouseDown={handleHoldPress}
				onMouseUp={handleRelease}
			>
				{text}
			</button>

			<motion.div
				className={`absolute z-20 text-white`}
				initial={{ opacity: 0 }}
				animate={isHolding ? { opacity: 1 } : { opacity: 0 }}
				transition={isHolding ? { duration: holdTime / 1000 } : { duration: 0.2 }}
			>
				{isLoading && <Spinner size={24} />}
				{!isLoading && <Icon fontSize={22} icon="heroicons-solid:trash" />}
			</motion.div>

			<motion.div
				className="absolute top-0 left-0 h-full bg-red-500 z-10"
				initial={{ width: '0%' }}
				animate={isHolding ? { width: '100%' } : { width: '0%' }}
				transition={isHolding ? { duration: holdTime / 1000 } : { duration: 0.2 }}
			/>
		</div>
	);
};

const PreviewBucket = ({ show, onClose, data: inData, editMode, documentId }) => {
	// Hooks
	const navigate = useNavigate();
	const { data: profile, isUserProfile } = useProfile();
	const { createBucket, updateBucket, deleteBucket, uploadVideo } = useBuckets(profile);

	// State
	const [isFullscreen, setIsFullscreen] = React.useState(false);
	const [isEditMode, setEditMode] = React.useState(editMode ?? false);
	const [isUploading, setUploading] = React.useState(false);
	const [progress, setProgress] = React.useState(20);
	const [currentVideo, setCurrentVideo] = React.useState(0);
	const [enableDelete, setEnableDelete] = React.useState(false);
	const [isDragOver, setIsDragOver] = React.useState(false);
	const [isSharing, setSharing] = React.useState(false);
	const [isDisplayVideoURLsModalVisible, setDisplayVideoURLsModal] = React.useState(false);
	const [data, setData] = React.useState({
		videos: [],
		name: '',
		title: ''
	});
	const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

	// Refs
	const dropZoneRef = React.useRef();
	const videoRef = React.useRef();
	const video360Ref = React.useRef();

	React.useEffect(() => {
		if (inData) {
			setData((val) => ({ ...val, ...inData }));

			const { description = '' } = inData;
			setEditorState(
				typeof description === 'string'
					? EditorState.createWithText(description || '')
					: EditorState.createWithContent(convertFromRaw({ entityMap: {}, ...description }))
			);
		}
	}, [inData]);

	// Function to toggle fullscreen
	const toggleFullscreen = () => {
		const videoElement = videoRef.current;

		if (!videoElement) return;

		// if (!isFullscreen) {
		if (videoElement.requestFullscreen) {
			videoElement.requestFullscreen();
		} else if (videoElement.mozRequestFullScreen) {
			videoElement.mozRequestFullScreen();
		} else if (videoElement.webkitRequestFullscreen) {
			videoElement.webkitRequestFullscreen();
		} else if (videoElement.msRequestFullscreen) {
			videoElement.msRequestFullscreen();
		}

		// TODO: Fix this
		// Toggle the fullscreen state
		setIsFullscreen(!isFullscreen);
	};

	const handleNextVideo = () => {
		if (!(currentVideo === data.videos.length - 1)) return setCurrentVideo(currentVideo + 1);

		return setCurrentVideo(0);
	};

	// TODO: MERGE HANDLEEXIT AND HANDLECLOSE
	const handleClose = () => {
		setEditMode(false);
		onClose();
		clear();
	};

	const handleExit = (...props) => {
		setCurrentVideo(0);
		onClose(...props);

		if (editMode) {
			setTimeout(() => {
				setData({
					videos: [],
					name: '',
					title: ''
				});
				setEditorState(EditorState.createEmpty());
				setEditMode(true);
			}, 1000);
		} else {
			setTimeout(() => {
				setEditMode(false);
			}, 500);
		}
	};

	const clear = () => {
		if (editMode) {
			setData({
				videos: [],
				name: '',
				title: ''
			});
			setEditorState(EditorState.createEmpty());
		}
	};

	const handleToCaptureScreen = (dbid) =>
		navigate({ pathname: '/capture', search: createSearchParams({ bucketid: dbid }).toString() });

	const handleCreateBucket = (params) => {
		const { willRedirect = false, cb = () => {}, onSuccess = () => {} } = params;
		const crudFunction = documentId ? updateBucket : createBucket;

		crudFunction(
			{ data: { ...data, description: convertToRaw(editorState.getCurrentContent()) }, documentId },
			{
				onSuccess: (dbid) => {
					if (willRedirect) handleToCaptureScreen(documentId);
					if (onSuccess) return onSuccess(dbid);
				},
				onSettled: cb()
			}
		);
	};

	const handlePrepareVideosToSave = (files = []) => {
		setEditMode(true);

		handleCreateBucket({
			onSuccess: (dbid) => {
				const body = new Array(files.length).fill({}).map((_, index) => ({
					isUploading: true,
					progress: 0,
					index: data.videos.length + index,
					file: files.item(index)
				}));

				setData((prev) => ({ ...prev, videos: [...prev.videos, ...body] }));

				for (const item of body) {
					const videoType = item.file.name.split('.').at(-1);
					const reader = new FileReader();
					reader.readAsArrayBuffer(item.file);
					reader.onload = () =>
						saveVideo({ result: reader.result, details: { ...item, documentId: dbid } }, videoType, {
							onLoading: () => setData((prev) => ({ ...prev, videos: [...prev.videos, ...body] }))
						});
				}
			}
		});
	};

	const saveVideo = async (file, videoType, { onLoading }) => {
		setUploading(true);
		const bucketId = documentId || file.details.documentId;

		const video = new Blob([file.result], { type: 'video/mp4' }); // Video File
		const image = await generatePreview(video);

		// ! TODO: Display progress setProgress(Math.ceil((snapshot.bytesTransferred * 100) / snapshot.totalBytes));
		// ! TODO: Only save when clicking save button.
		uploadVideo(
			{ id: bucketId, data: { video, image, videoType }, onLoading },
			{
				onSuccess: (response) => {
					// console.log(response, variables, ctx);
					// const videos = [...data.videos];
					// videos[index] = { image, videoUrl: video };
					// setData((prev) => ({ ...prev, videos }));
					// navigate({ pathname: `/profile`, search: createSearchParams({ focus: selectedBucket.id }).toString() });
				},
				onSettled: () => {
					setUploading(false);
					setProgress(0);
				},
				onError: console.error
			}
		);
	};

	const handleDeleteBucket = ({ success }) => {
		if (success) deleteBucket({ documentId });
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		if (!e.dataTransfer.files.length > 0) return;

		const { files } = e.dataTransfer;

		// Check if the dropped file is a video
		for (const item of files) {
			if (!item.type.startsWith('video/')) return alert('Please drop a valid video file.');
		}

		handlePrepareVideosToSave(files);
	};

	const handle360Video = (ref, video) => {
		video360Ref.current = { ref, video };
		video360Ref.current.video.play();
	};

	const handleVideoURLsModal = () => {
		setDisplayVideoURLsModal(true);
	};

	const handleVideoURLs = (videosURL) => {
		setDisplayVideoURLsModal(false);

		console.log(videosURL);

		const bucketId = documentId;

		Object.values(videosURL).forEach((video) => {
			const { video: videoURL, image, source, type } = video;

			// uploadVideo(
			// 	{ id: bucketId, data: { video, image, videoType }, onLoading },
			// 	{
			// 		onSuccess: (response) => {
			// 			// console.log(response, variables, ctx);
			// 			// const videos = [...data.videos];
			// 			// videos[index] = { image, videoUrl: video };
			// 			// setData((prev) => ({ ...prev, videos }));
			// 			// navigate({ pathname: `/profile`, search: createSearchParams({ focus: selectedBucket.id }).toString() });
			// 		},
			// 		onSettled: () => {
			// 			setUploading(false);
			// 			setProgress(0);
			// 		},
			// 		onError: console.error
			// 	}
			// );
		});
	};

	const isValid = [editorState.getCurrentContent().hasText(), data.title.length].every(Boolean);
	const isCurrentVideo360 = data.videos[currentVideo]?.is360Video;

	if (isEditMode) {
		return (
			<PageModal show={show} onClose={handleExit} width="80vw">
				<div>
					{/* Video Player */}
					<div className="aspect-[16/9] shadow bg-black">
						<div className="w-full h-full backdrop-blur-md">
							{!isCurrentVideo360 && (
								<CachedVideo
									autoPlay
									controls={false}
									ref={videoRef}
									src={data.videos[currentVideo]?.videoUrl} // Have also low quality videos
									onEnded={handleNextVideo}
									loop={data?.videos?.length === 1}
									className="w-full h-full object-center rounded-none z-10"
								/>
							)}

							{isCurrentVideo360 && (
								<Video360
									onVideoReady={handle360Video}
									src={data.videos[currentVideo]?.videoUrl}
									className="w-screen h-screen"
								/>
							)}
						</div>
					</div>
					<div className="flex flex-row  px-8 my-6">
						<div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
							{/* TODO: picture */}
							<img src={profile?.photoURL} className="rounded-full object-cover w-20" crossOrigin="anonymous" />
							<Typography variant="small">215k</Typography>
						</div>

						<div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
							<div className="flex flex-row justify-between items-center">
								<div>
									<Typography variant="large">{profile?.name}</Typography>
									{/* <Typography variant="small">{profile?.role}</Typography> */}
								</div>
								<div>
									<Button
										variant="secondary"
										onClick={() => handleCreateBucket({ cb: () => setEditMode(false) })}
										// disabled={!isValid}
									>
										{isEditMode ? (editMode ? 'Create bucket' : 'Done editing') : 'Edit Bucket'}
									</Button>
								</div>
							</div>

							<div className="flex flex-col gap-3">
								{isEditMode && (
									<Input
										value={data.name}
										placeholder="Bucket name"
										onChange={({ target }) => setData((prev) => ({ ...prev, name: target.value }))}
										className="bg-white/10"
									/>
								)}

								{/* <Input
									value={data.title}
									placeholder="Title"
									onChange={({ target }) => setData((prev) => ({ ...prev, title: target.value }))}
									className="bg-white/10"
								/> */}
								{/* <Input
									name="category"
									placeholder="Category"
									value={data.category}
									onChange={({ target }) => setData((prev) => ({ ...prev, category: target.value }))}
									className="bg-white/10"
								/> */}

								{/*<Textarea
									value={data.description}
									placeholder="Description"
									onChange={({ target }) => setData((prev) => ({ ...prev, description: target.value }))}
									className="bg-white/10 min-h-[100px]"
								/>*/}
								<TextEditor placeholder="Description" state={editorState} setState={setEditorState} />
							</div>
						</div>
					</div>

					{/* TODO: Fix overflow hidden */}
					{/* <div className="h-10" /> */}

					{!editMode && (
						<div>
							<div className="flex gap-3 px-2 py-2 rounded-md bg-gray-200 scale-90">
								<Button
									iconBegin={<Icon icon="humbleicons:camera-video" />}
									variant="secondary"
									onClick={() => handleCreateBucket({ willRedirect: true })}
									// disabled={!isValid}
								>
									Capture
								</Button>

								<VideoUploadButton
									onUpload={handlePrepareVideosToSave}
									// disabled={!isValid}
								/>

								<Button
									iconBegin={<Icon icon="carbon:url" />}
									variant="secondary"
									onClick={() => handleCreateBucket({ willRedirect: true })}
								>
									Add video URL
								</Button>
							</div>

							<div className="text-center text-black/50 mt-8">
								<Typography variant="small">Drag and drop your videos below</Typography>
							</div>

							{/* <div className="flex justify-center items-center my-6 mt-6"> */}
							<div
								ref={dropZoneRef}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								style={{ transition: '0.5s' }}
								className={[
									'border-dashed border border-black/30 rounded-lg p-4 m-6 transition relative overflow-hidden',
									isDragOver && 'bg-primary'
								].join(' ')}
							>
								{/* {isUploading && (
									<Progress value={progress} color="bg-primary" className="bg-blue-100 absolute w-full left-0 top-0" />
								)} */}

								<ReactSortable
									className="flex flex-wrap justify-between w-full relative"
									list={data.videos}
									setList={(state) => setData((prev) => ({ ...prev, videos: state }))}
									onChoose={() => setEnableDelete(true)}
									onEnd={() => setEnableDelete(false)}
									onRemove={console.log}
									group="1"
									animation={500}
									delayOnTouchStart
									delay={0}
									draggable=".draggable"
									filter=".undraggable"
									ghostClass="opacity-0"
								>
									{[...data.videos, ...new Array(12 - data?.videos?.length).fill('')].map((item, index) => {
										if (item?.image) {
											return (
												<div key={item.image} className="relative draggable w-1/4 h-full aspect-video p-2 flex ">
													<img
														src={item.image}
														className="animate-wiggle rounded-lg object-cover select-none h-full aspect-video"
														crossOrigin="anonymous"
													/>

													{item.is360Video && (
														<Button
															variant="secondary"
															className={cn('absolute bottom-0 right-0 bg-gray-400/20 backdrop-blur-sm text-white')}
														>
															<Icon icon="tabler:360-view" fontSize={30} />
														</Button>
													)}
												</div>
											);
										}

										if (item?.isUploading) {
											return (
												<div key={index + 1} className="undraggable w-1/4 aspect-video p-3">
													<div className="flex h-full rounded-lg object-cover border-dashed border border-black/10 justify-center items-center text-3xl text-black/20">
														<div className="relative">
															<Icon icon="line-md:uploading-loop" fontSize={60} />
															{/* <Typography variant="small">{item?.progress}%</Typography> */}
															{/* <Progress value={item?.progress} color="bg-primary" className="bg-blue-100 mt-4 absolute -bottom-4 scale-50" /> */}
														</div>
													</div>
												</div>
											);
										}

										return (
											<div key={index + 1} className="undraggable w-1/4 aspect-video p-3">
												<div className=" flex h-full rounded-lg object-cover border-dashed border border-black/10 justify-center items-center text-3xl text-black/20">
													<div className="relative text-center">
														<Typography>{index + 1}</Typography>
													</div>
												</div>
											</div>
										);
									})}
								</ReactSortable>
								{/* </div> */}
							</div>

							{enableDelete && (
								<div className="flex justify-center items-center relative ">
									<ReactSortable
										className="border-dashed border border-white/30 rounded-3xl p-4 m-6 relative overflow-hidden bg-red-300 min-w-[50px] min-h-[50px] max-w-[380px] max-h-[200px]"
										group="1"
										list={[]}
										setList={() => {}}
										delayOnTouchStart
									/>

									<div className="absolute text-white ">
										<Icon fontSize={30} icon="fluent:delete-12-regular" />
									</div>
								</div>
							)}
							<div className="h-[50px]" />
						</div>
					)}

					<div className="flex justify-between px-8 my-8">
						{!editMode && <HoldToTriggerButton onRelease={handleDeleteBucket} text="Delete bucket" holdTime={1500} />}

						<div className="flex flex-row justify-end gap-3 text-center text-white/50 w-full">
							<Button
								variant="secondary"
								onClick={handleExit}
								// disabled={!isValid}
								className="w-full max-w-[150px]"
							>
								Cancel
							</Button>
							<Button
								onClick={() => handleCreateBucket({ cb: handleClose })}
								// disabled={!isValid}
								className="w-full max-w-[200px]"
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			</PageModal>
		);
	}

	return (
		<PageModal show={show} onClose={handleExit} width="80vw" initialFocus={videoRef}>
			<QRShareView show={isSharing} onClose={() => setSharing(false)} />

			<VideoAddURLModal show={isDisplayVideoURLsModalVisible} onClose={handleVideoURLs} />

			{/* Video Player */}
			<div className="aspect-[16/9] shadow bg-black">
				<div className="w-full h-full backdrop-blur-md">
					{!isCurrentVideo360 && (
						<>
							<CachedVideo
								autoPlay
								controls={true}
								ref={videoRef}
								src={data.videos[currentVideo]?.videoUrl} // Have also low quality videos
								onEnded={handleNextVideo}
								loop={data?.videos?.length === 1}
								className="w-full h-full object-center rounded-none z-10"
							/>
							{/* <div className="transition cursor-pointer absolute top-2 right-4 p-1 rounded-md bg-slate-300/20 backdrop-blur-sm border-white border hover:bg-slate-300/50">
								<Icon onClick={toggleFullscreen} className="text-3xl text-white" icon="iconamoon:screen-full-duotone" />
							</div> */}
						</>
					)}

					{isCurrentVideo360 && (
						<Video360
							onVideoReady={handle360Video}
							src={data.videos[currentVideo]?.videoUrl}
							className="w-screen h-screen"
						/>
					)}
				</div>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="q&a">Q&A</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<Overview
						data={data}
						profile={profile}
						isUserProfile={isUserProfile}
						setSharing={setSharing}
						setEditMode={setEditMode}
						currentVideo={currentVideo}
						description={editorState}
						setDescription={setEditorState}
						handlePrepareVideosToSave={handlePrepareVideosToSave}
						handleCreateBucket={handleCreateBucket}
						handleVideoURLsModal={handleVideoURLsModal}
						setCurrentVideo={setCurrentVideo}
					/>
				</TabsContent>
				<TabsContent value="q&a" disabled={isEditMode}>
					<div className="py-10">
						<QuestionsList profile={profile} scope={{ bucketId: documentId }} />
					</div>
				</TabsContent>
			</Tabs>
		</PageModal>
	);
};

export default PreviewBucket;
