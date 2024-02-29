import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { Icon } from '@iconify/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Listbox } from '@headlessui/react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { BASE_URL } from '@/config/api.js';
import { getYouTubeVideoDetails } from '@/hooks/api/youtube.js';
import { cn, extractYoutubeVideoId, generatePreview, getShortNumberLabel, isYouTubeUrl } from '@/lib/utils';
import { PageModal } from '@/components/PageModal';
import TextEditor from '@/components/TextEditor';
import { VR_3D, Video360 } from '@/components/MediaPlayer';
import Overview from '@/components/PreviewBucket/tabs/Overview.jsx';
import Price from '@/components/PreviewBucket/tabs/Price.jsx';
import Views from '@/components/PreviewBucket/tabs/Views';
import QuestionsList from '@/components/QuestionsList.jsx';
import VideoAddURLModal from '@/components/VideoAddURLModal.jsx';
import { useProfile } from '@/hooks/useProfile';
import { useBuckets } from '@/hooks/useBuckets';
import { useToast } from '@/hooks/useToast';
import useStripeCheckout from '@/hooks/useStripeCheckout.js';
import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input';
import { Typography } from '@/chadcn/Typography';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/chadcn/Tabs.jsx';

import { VideoUploadButton } from '../VideoUploadButton.jsx';
import { CircularProgress } from '../CircularProgress.jsx';
import { CachedVideo } from '../CachedVideo.jsx';
import { Spinner } from '../Spinner';
import { useMobile } from '@/hooks/useMobile.js';
import { useAuth } from '@/providers/Authentication.jsx';
import { Image } from '../Image.jsx';

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
	const { user } = useAuth();
	const { data: profile, isUserProfile, isOrganization } = useProfile();
	const { isMobile } = useMobile();
	const { createBucket, updateBucket, markBucketViewed, deleteBucket, uploadVideo, saveVideoURLs, createBucketPrice } =
		useBuckets(profile);
	const { checkoutBucket } = useStripeCheckout();

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
		title: '',
		private: 'false'
	});
	const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

	// Refs
	const dropZoneRef = React.useRef();
	const videoRef = React.useRef();
	const video360Ref = React.useRef();

	React.useEffect(() => {
		if (inData) {
			setData((val) => ({ ...val, ...inData, private: inData.private?.toString() }));

			const { description = '' } = inData;
			setEditorState(
				typeof description === 'string'
					? EditorState.createWithText(description || '')
					: EditorState.createWithContent(convertFromRaw({ entityMap: {}, ...description }))
			);
		}
	}, [inData]);

	React.useEffect(() => {
		let timerId;
		if (documentId && show) {
			// Mark as viewed after 5 sec
			timerId = setTimeout(() => {
				markBucketViewed({ id: documentId });
			}, 5000);
		}

		return () => timerId && clearTimeout(timerId);
	}, [documentId, show]);

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
		if (isUploading) return;

		setCurrentVideo(0);
		onClose(...props);

		if (editMode) {
			setTimeout(() => {
				setData({
					videos: [],
					name: '',
					title: '',
					private: 'false'
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
				title: '',
				private: 'false'
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
			{
				data: {
					...data,
					...(isOrganization && { organizationId: profile.id }),
					private: data.private === 'true',
					description: convertToRaw(editorState.getCurrentContent())
				},
				documentId
			},
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
			if (item.type.length > 0 && !item.type.startsWith('video/') && item.name.split('.')[1] !== 'insv')
				return alert('Please drop a valid video file.');
		}

		handlePrepareVideosToSave(files);
	};

	const handle360Video = (ref, video) => {
		video360Ref.current = { ref, video };
		video360Ref.current.video.play();
	};

	const handleVideoURLsModal = () => {
		setDisplayVideoURLsModal(true);
		console.log(isDisplayVideoURLsModalVisible);
	};

	const handleVideoURLs = (videosURL) => {
		setDisplayVideoURLsModal(false);
		if (!videosURL) return;

		const bucketId = documentId;

		const videos = Object.values(videosURL);

		saveVideoURLs(
			{ id: bucketId, data: { videos } },
			{
				onSuccess: (response) => {
					console.log(response);
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

	const isValid = [editorState.getCurrentContent().hasText(), data.title.length].every(Boolean);
	const isCurrentVideo360 = data.videos[currentVideo]?.videoType === 'insv';
	const canWatch =
		isUserProfile || !data.price || user.payments?.buckets?.find(({ bucketId }) => bucketId === documentId);

	const handleCheckout = async () => {
		const { checkoutUrl } = await checkoutBucket({
			data: {
				bucketId: documentId,
				successUrl: `${BASE_URL}/api/stripe/checkout-bucket/success?sessionId={CHECKOUT_SESSION_ID}&redirectUrl=${window.location.href}`
			}
		});

		window.location.href = checkoutUrl;
	};

	if (isEditMode) {
		return (
			<PageModal show={show} onClose={handleExit} width="1560px" maxWidth="100vw">
				<VideoAddURLModal show={isDisplayVideoURLsModalVisible} onClose={handleVideoURLs} />

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
							<Image src={profile?.photoURL || profile?.picture} className="rounded-full object-cover w-20" />
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
										disabled={isUploading}
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
								<div className="relative">
									<Listbox value={data.private} onChange={(val) => setData((state) => ({ ...state, private: val }))}>
										<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
											<div className="truncate">{data.private === 'true' ? 'Private' : 'Public'}</div>
											<span>
												<CaretSortIcon className="h-4 w-4 opacity-50" />
											</span>
										</Listbox.Button>
										<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
											<Listbox.Option
												value="false"
												className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
											>
												{({ selected }) => (
													<>
														<span>Public</span>
														{selected && (
															<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
																<CheckIcon className="h-4 w-4" aria-hidden="true" />
															</span>
														)}
													</>
												)}
											</Listbox.Option>
											<Listbox.Option
												value="true"
												className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
											>
												{({ selected }) => (
													<>
														<span>Private</span>
														{selected && (
															<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
																<CheckIcon className="h-4 w-4" aria-hidden="true" />
															</span>
														)}
													</>
												)}
											</Listbox.Option>
										</Listbox.Options>
									</Listbox>
								</div>

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
									onClick={() => handleCreateBucket({ willRedirect: false, cb: handleVideoURLsModal })}
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
													<Image
														proxyEnabled={isYouTubeUrl(item.image)}
														src={item.image}
														className="animate-wiggle rounded-lg object-cover select-none h-full aspect-video"
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
								disabled={isUploading}
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
		<PageModal show={show} onClose={handleExit} width="1560px" maxWidth="100vw" initialFocus={videoRef}>
			<QRShareView show={isSharing} onClose={() => setSharing(false)} />

			<VideoAddURLModal show={isDisplayVideoURLsModalVisible} onClose={handleVideoURLs} />

			{/* Video Player */}
			<div className="aspect-[16/9] shadow bg-black">
				{canWatch ? (
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
				) : (
					<div className="w-full h-full bg-white/80 flex flex-col gap-1 justify-center items-center">
						<Typography variant="h4" className="text-xl">
							{data.price.type === 'recurring'
								? `Subscribe to the bucket content for ${data.price?.unitAmount} ${data.price?.currency} per ${data.price?.interval}.`
								: `Get unlimited full-time access to the bucket content for ${data.price?.unitAmount} ${data.price?.currency}.`}
						</Typography>
						<Button onClick={handleCheckout}>{data.price.type === 'recurring' ? 'Subscribe' : 'Buy'}</Button>
					</div>
				)}
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="flex items-center">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="q&a">Q&A</TabsTrigger>
					{isUserProfile && (
						<>
							<TabsTrigger value="price">Price</TabsTrigger>
							<TabsTrigger value="views">Views</TabsTrigger>
						</>
					)}
					<div className="flex flex-1 gap-1 items-center justify-end px-4 text-[#484848]">
						<Icon icon="ph:binoculars-fill" className="text-3xl" />
						{getShortNumberLabel(data.viewers?.length || 0)}
					</div>
				</TabsList>

				<TabsContent value="overview">
					<Overview
						data={data}
						profile={profile}
						canWatch={canWatch}
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

				{isUserProfile && (
					<>
						<TabsContent value="price">
							<Price bucketId={documentId} data={data} profile={profile} savePrice={createBucketPrice} />
						</TabsContent>
						<TabsContent value="views">
							<Views bucketId={documentId} profile={profile} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</PageModal>
	);
};

export default PreviewBucket;
