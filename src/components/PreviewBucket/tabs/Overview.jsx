import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { VideoUploadButton } from '@/components/VideoUploadButton.jsx';
import TextEditor from '@/components/TextEditor/index.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown.jsx';
import { cn } from '@/lib/utils.js';
import { useMobile } from '@/hooks/useMobile';
import { Image } from '@/components/Image';

const Overview = ({
	data,
	canWatch,
	profile,
	isUserProfile,
	description,
	setDescription,
	handleCreateBucket,
	handlePrepareVideosToSave,
	handleVideoURLsModal,
	setEditMode,
	setSharing,
	currentVideo,
	setCurrentVideo
}) => {
	const { isMobile } = useMobile();

	return (
		<>
			<div className="flex flex-row my-3 px-1 sm:px-8 sm:my-6 outline-none">
				{!isMobile && (
					<div className="flex basis-2/12 flex-col items-center gap-2 mt-2">
						<Image src={profile?.photoURL} className="rounded-full object-cover w-20" />
						<Typography variant="large">{profile?.name}</Typography>

						<Button iconBegin={<Icon icon="ic:round-anchor" />} variant="secondary">
							Anchor - <Typography variant="small">215k</Typography>
						</Button>
					</div>
				)}

				<div className="flex  flex-col w-full gap-2 pb-4 sm:gap-8 sm:basis-10/12">
					<div className="flex flex-row justify-between items-center">
						{!isMobile && (
							<div>
								<Typography variant="h3">{data.name}</Typography>
							</div>
						)}
						{isUserProfile && (
							<div className="flex flex-wrap gap-3 items-center px-2">
								<Button
									iconBegin={<Icon icon="humbleicons:camera-video" />}
									variant="secondary"
									onClick={() => handleCreateBucket({ willRedirect: true })}
								>
									Capture
								</Button>

								<VideoUploadButton onUpload={handlePrepareVideosToSave} />

								<Button iconBegin={<Icon icon="carbon:url" />} variant="secondary" onClick={handleVideoURLsModal}>
									Add video URL
								</Button>

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
							{/* <Typography variant="large">{data.title}</Typography> */}
							<Typography variant="p" className="whitespace-pre-line">
								<TextEditor readOnly state={description} setState={setDescription} />
							</Typography>
						</div>
					</div>
				</div>
			</div>
			{canWatch && (
				<div className="flex justify-center items-center my-6 mt-10 mx-6">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
						{data.videos.map(({ image }, index) => {
							if (image) {
								return (
									<button onClick={() => setCurrentVideo(index)} key={image}>
										<div>
											{/* <img src={image} className="rounded-lg object-cover w-40 h-28" /> */}
											<Image
												proxyEnabled
												className={cn(
													'rounded-lg aspect-video object-cover transition-all border-transparent border-[4px]',
													currentVideo === index && 'border-primary scale-110'
												)}
												src={image}
											/>
										</div>
									</button>
								);
							}
						})}
					</div>
				</div>
			)}
		</>
	);
};

export default Overview;
