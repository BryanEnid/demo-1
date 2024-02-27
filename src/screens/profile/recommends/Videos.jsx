import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import { parseDuration } from '@/lib/utils.js';
import { BASE_URL } from '@/config/api.js';
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import useRecommends from '@/hooks/useRecommends.js';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';
import VideoAddURLModal from '@/components/VideoAddURLModal.jsx';
import { Image } from '@/components/Image';

const Videos = ({ data = [], isUserProfile }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(null);

	const { isLoading, createVideo: handleCreate, deleteVideo: handleDelete } = useRecommends();

	console.log(data);

	const handleVideoURLs = async (videosURL) => {
		closeCreateModal();
		if (isLoading || !videosURL) {
			return;
		}

		const videos = Object.values(videosURL);
		for (let i = 0; i < videos.length; i++) {
			if (videos[i].valid) {
				await handleCreate({ url: videos[i].url });
			}
		}
	};

	const closeCreateModal = () => {
		setShowCreateModal(false);
	};

	const deleteVideo = async () => {
		await handleDelete({ id: confirmDelete.id });
		setConfirmDelete(null);
	};

	const getDuration = (dur) => {
		let res = '';
		const { hours, minutes } = parseDuration(dur);
		if (hours) {
			res += `${hours}h`;
		}
		if (minutes) {
			res += `${minutes}m`;
		}

		return res;
	};

	return (
		<div>
			<div className="flex items-center gap-4 mb-5">
				<Typography variant="h2" className="!pb-0">
					Videos
				</Typography>
				{isUserProfile && (
					<Button
						variant="outline"
						className="text-primary rounded-full w-[30px] h-[30px] p-1"
						onClick={() => setShowCreateModal(true)}
					>
						<Icon icon="ic:round-plus" className="text-2xl" />
					</Button>
				)}
			</div>
			{!data.length && !isUserProfile ? (
				<div>
					<Typography variant="muted">There are no videos added.</Typography>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data.map((video) => (
						<a key={video.id} href={video.videoUrl} target="_blank" rel="noreferrer">
							<Card className="h-full flex">
								<CardHeader className="px-4 py-4 w-1/3 shrink-0">
									<Image
										proxyEnabled
										src={video?.preview}
										className="rounded-md object-cover aspect-square w-full"
										// onError={(e) => {
										// 	e.target.onerror = null;
										// 	e.target.src = `${BASE_URL}/static/external?url=${video.preview}`;
										// }}
									/>
								</CardHeader>
								<CardContent className="px-0 pr-4 py-4">
									<CardTitle className="text-lg leading-snug font-bold text-wrap flex gap-5">
										<span>{video.title}</span>
										<span className="shrink-0">{getDuration(video.duration)}</span>
									</CardTitle>
									<CardDescription className="text-black pt-2 line-clamp-6 ">{video.description}</CardDescription>
									{isUserProfile && (
										<CardFooter className="mt-auto p-0">
											<div className="w-full flex justify-end">
												<Button
													variant="ghost"
													className="rounded-full w-[40px] h-[40px] p-1"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														setConfirmDelete(video);
													}}
												>
													<Icon className="text-gray-500 text-xl" icon="mi:delete" />
												</Button>
											</div>
										</CardFooter>
									)}
								</CardContent>
							</Card>
						</a>
					))}
				</div>
			)}
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete video: ${confirmDelete?.title}?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={deleteVideo}
			/>
			<VideoAddURLModal show={showCreateModal} onClose={handleVideoURLs} />
		</div>
	);
};

export default Videos;
