import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { VideoUploadButton } from '@/components/VideoUploadButton.jsx';
import TextEditor from '@/components/TextEditor/index.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown.jsx';
import { cn } from '@/lib/utils.js';

const Overview = ({
	data,
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
	return (
		<>
			<div className="flex flex-row px-8 my-6 outline-none">
				<div className="flex basis-2/12 flex-col items-center gap-2 mt-2">
					<img src={profile?.photoURL} className="rounded-full object-cover w-20" crossOrigin="anonymous" />
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

								<Button
									iconBegin={<Icon icon="carbon:url" />}
									variant="secondary"
									onClick={() => handleVideoURLsModal(false)}
								>
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
											crossOrigin="anonymous"
											src={image}
										/>
									</div>
								</button>
							);
						}
					})}
				</div>
			</div>
		</>
	);
};

export default Overview;
