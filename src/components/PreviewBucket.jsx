import React from 'react';
import { Icon } from '@iconify/react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { PageModal } from '@/components/PageModal';
import { useProfile } from '@/hooks/useProfile';

import { VideoUploadButton } from './VideoUploadButton';
import { cn, generatePreview, generateRandomNumber } from '@/lib/utils';
import { CircularProgress } from './CircularProgress';
import { CachedVideo } from './CachedVideo';
import { VR_3D, Video360 } from '@/components/MediaPlayer';
import { useBuckets } from '@/hooks/useBuckets';
import QRCode from 'react-qr-code';
import { useToast } from '@/hooks/useToast';

import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input';
import { Typography } from '@/chadcn/Typography';
import { Textarea } from '@/chadcn/Textarea';
import { Dialog } from '@/chadcn/Dialog';
import { Progress } from '@/chadcn/Progress';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/chadcn/DropDown';

const QRShareView = ({ show, onClose }) => {
	const [value, setValue] = React.useState(window.location.href);

	const { toast } = useToast();

	return (
		<PageModal show={show} onClose={onClose} width="600px">
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

export function PreviewBucket({ show, onClose, data: inData, editMode, documentId }) {
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
	const [data, setData] = React.useState({
		videos: [],
		name: '',
		title: '',
		description: ''
	});

	// Refs
	const dropZoneRef = React.useRef();
	const videoRef = React.useRef();
	const video360Ref = React.useRef();

	React.useEffect(() => {
		if (inData) {
			// setData(inData);
			setData((val) => ({ ...val, ...inData }));
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
					title: '',
					description: ''
				});
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
				description: ''
			});
		}
	};

	const handleToCaptureScreen = (dbid) =>
		navigate({ pathname: '/capture', search: createSearchParams({ bucketid: dbid }).toString() });

	const handleCreateBucket = (params) => {
		const { willRedirect = false, cb = () => {}, onSuccess = () => {} } = params;
		const crudFunction = documentId ? updateBucket : createBucket;

		crudFunction(
			{ data, documentId },
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

	const handleDeleteBucket = () => {
		deleteBucket(documentId);
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
							<img src={profile?.photoURL} className="rounded-full object-cover w-20" />
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
										disabled={![data.description.length, data.title.length].every(Boolean)}
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

								<Input
									value={data.title}
									placeholder="Title"
									onChange={({ target }) => setData((prev) => ({ ...prev, title: target.value }))}
									className="bg-white/10"
								/>
								<Input
									name="category"
									placeholder="Category"
									value={data.category}
									onChange={({ target }) => setData((prev) => ({ ...prev, category: target.value }))}
									className="bg-white/10"
								/>
								<Textarea
									value={data.description}
									placeholder="Description"
									onChange={({ target }) => setData((prev) => ({ ...prev, description: target.value }))}
									className="bg-white/10 min-h-[100px]"
								/>
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
									disabled={![data.description.length, data.title.length].every(Boolean)}
								>
									Capture
								</Button>
								<VideoUploadButton
									onUpload={handlePrepareVideosToSave}
									disabled={![data.description.length, data.title.length].every(Boolean)}
								/>
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

					<div className="flex justify-between px-8 my-8" on>
						<button
							variant="destructive"
							onClick={handleClose}
							onMouseDown={() => console.log('down')}
							onMouseUp={() => console.log('up')}
							// disabled={![data.description.length, data.title.length].every(Boolean)}
							className="w-full max-w-[150px]"
						>
							Hold to Delete
						</button>

						<div className="flex flex-row justify-end gap-3 text-center text-white/50 w-full">
							<Button
								variant="secondary"
								onClick={handleExit}
								// disabled={![data.description.length, data.title.length].every(Boolean)}
								className="w-full max-w-[150px]"
							>
								Cancel
							</Button>
							<Button
								onClick={() => handleCreateBucket({ cb: handleClose })}
								disabled={![data.description.length, data.title.length].every(Boolean)}
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
		<PageModal show={show} onClose={handleExit} width="80vw">
			<QRShareView show={isSharing} onClose={() => setSharing(false)} />

			{/* Video Player */}
			<div className="aspect-[16/9] shadow bg-black">
				<div className="w-full h-full backdrop-blur-md">
					{!isCurrentVideo360 && (
						<>
							<CachedVideo
								autoPlay
								controls={false}
								ref={videoRef}
								src={data.videos[currentVideo]?.videoUrl} // Have also low quality videos
								onEnded={handleNextVideo}
								loop={data?.videos?.length === 1}
								className="w-full h-full object-center rounded-none z-10"
							/>
							<div className="transition cursor-pointer absolute top-2 right-4 p-1 rounded-md bg-slate-300/20 backdrop-blur-sm border-white border hover:bg-slate-300/50">
								<Icon onClick={toggleFullscreen} className="text-3xl text-white" icon="iconamoon:screen-full-duotone" />
							</div>
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

			<div className="flex flex-row px-8 my-6">
				<div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
					<img src={profile?.photoURL} className="rounded-full object-cover w-20" />
					<Typography variant="small">215k</Typography>
					<Button variant="secondary">Anchor</Button>
				</div>

				<div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
					<div className="flex flex-row justify-between items-center">
						<div>
							<Typography variant="large">{profile?.name}</Typography>
							{/* <Typography variant="small">{profile.role}</Typography> */}
						</div>
						{isUserProfile && (
							<div className="flex gap-3 items-center">
								<Button
									iconBegin={<Icon icon="humbleicons:camera-video" />}
									variant="secondary"
									onClick={() => handleCreateBucket({ willRedirect: true })}
								>
									Capture
								</Button>

								<VideoUploadButton onUpload={handlePrepareVideosToSave} />

								<DropdownMenu>
									<DropdownMenuTrigger>
										<Button variant="secondary">
											<Icon icon="tabler:dots" />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent>
										<DropdownMenuItem onClick={() => setEditMode(true)}>
											<Icon icon="material-symbols:edit" className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setSharing(true)}>
											<Icon icon="jam:share-alt" className="mr-2 h-4 w-4" />
											Share
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>

					<div>
						<div>
							<Typography variant="large">{data.title}</Typography>
							<Typography variant="p" className="whitespace-pre-line">
								{data.description}
							</Typography>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center items-center my-6 mt-10">
				<div className="grid grid-cols-4 gap-5">
					{data.videos.map(({ image }, index) => {
						if (image) {
							return (
								<button onClick={() => setCurrentVideo(index)} key={image}>
									<div>
										{/* <img src={image} className="rounded-lg object-cover w-40 h-28" /> */}
										<LazyLoadImage
											className={cn(
												'rounded-lg object-cover w-40 h-28 transition-all border-transparent border-[4px]',
												currentVideo === index && 'border-primary scale-110'
											)}
											// alt={image.alt}
											// height={image.height}
											src={image}
										/>
									</div>
								</button>
							);
						}
					})}
				</div>
			</div>
		</PageModal>
	);
}
