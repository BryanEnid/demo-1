import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Carousel, CarouselContent, CarouselItem } from '@/chadcn/Carousel';
import { PageModal } from '@/components/PageModal.jsx';
import { Spinner } from '@/components/Spinner.jsx';
import useRecommends from '@/hooks/useRecommends.js';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';

const Podcasts = ({ data = [], isUserProfile }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [search, setSearch] = useState('');
	const [selectedPodcast, setSelectedPodcast] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(null);

	const {
		podcastsPreview,
		isLoading,
		isPodcastsError,
		searchPodcastsPreview,
		clearPodcastsPreview,
		createPodcast: handleCreatePodcast,
		deletePodcast: handleDeletePodcast
	} = useRecommends();

	const isValid = !isLoading && !isPodcastsError && !!selectedPodcast;

	const closeCreateModal = () => {
		setShowCreateModal(false);
		setSearch('');
		setSelectedPodcast(null);
	};

	const savePodcast = async () => {
		await handleCreatePodcast({ id: selectedPodcast.id });
		closeCreateModal();
	};

	const deletePodcast = async () => {
		await handleDeletePodcast({ id: confirmDelete.id });
		setConfirmDelete(null);
	};

	useEffect(() => {
		let timerId;
		if (search?.length) {
			timerId = setTimeout(() => {
				searchPodcastsPreview(search);
			}, 300);
		} else {
			clearPodcastsPreview();
		}

		return () => timerId && clearTimeout(timerId);
	}, [search]);

	return (
		<div>
			<div className="flex items-center gap-4 mb-5">
				<Typography variant="h2" className="!pb-0">
					Podcasts
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
			<Carousel
				opts={{
					align: 'start',
					dragFree: true
				}}
				className="w-full"
			>
				<CarouselContent>
					{data.map((podcast) => (
						<CarouselItem key={podcast.id} className="basis-1/2 lg:basis-1/4">
							<Card className="h-full flex flex-col">
								<CardHeader className="px-4 py-4">
									<a href={podcast.url} target="_blank" rel="noreferrer">
										<img src={podcast.picture} className="rounded-md object-cover aspect-square w-full" />
									</a>
								</CardHeader>
								<CardContent className="px-4 pb-4">
									<CardTitle className="text-lg leading-snug font-bold text-wrap">
										<a href={podcast.url} target="_blank" rel="noreferrer">
											{podcast.name}
										</a>
									</CardTitle>
								</CardContent>
								{isUserProfile && (
									<CardFooter className="mt-auto px-4 pb-4">
										<div className="w-full flex justify-center">
											<Button
												variant="ghost"
												className="rounded-full w-[40px] h-[40px] p-1"
												onClick={() => setConfirmDelete(podcast)}
											>
												<Icon className="text-gray-500 text-xl" icon="mi:delete" />
											</Button>
										</div>
									</CardFooter>
								)}
							</Card>
						</CarouselItem>
					))}
					{isUserProfile && (
						<CarouselItem className="basis-1/2 lg:basis-1/4">
							<Card
								className="flex justify-center items-center cursor-pointer"
								onClick={() => setShowCreateModal(true)}
							>
								<div className="flex justify-center items-center object-cover aspect-square w-full">
									<Icon icon="ph:plus-bold" className=" text-7xl text-primary"></Icon>
								</div>
							</Card>
						</CarouselItem>
					)}
				</CarouselContent>
			</Carousel>
			<PageModal show={showCreateModal} onClose={closeCreateModal} width="600px">
				<div className="flex flex-col justify-center px-8 gap-5 relative">
					<div className="flex flex-col justify-center pt-8 pb-4 gap-5 sticky top-0 bg-white z-10">
						<div className="flex justify-between items-center pb-2">
							<Typography variant="h3">Add Podcast</Typography>
							<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={closeCreateModal}>
								<Icon icon="mingcute:close-fill" className="text-2xl" />
							</Button>
						</div>
						<div className="w-full">
							<Input
								value={search}
								placeholder="Paste article URL"
								onChange={({ target }) => setSearch(target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-5 w-full">
						<div className="min-h-[80px]">
							{isLoading && (
								<div className="flex justify-center items-center h-full">
									<Spinner size={24} />
								</div>
							)}
							{!isLoading && isPodcastsError && !podcastsPreview?.length && (
								<Typography className="text-red-500">Podcasts not found</Typography>
							)}
							{!isLoading && !!podcastsPreview?.length && (
								<div>
									{podcastsPreview.map((podcast) => (
										<div
											key={podcast.id}
											className="flex gap-4 items-center mb-1 cursor-pointer"
											onClick={() => setSelectedPodcast(podcast)}
										>
											<div className="w-[50px] h-[50px] relative shrink-0">
												<img src={podcast.picture} className="rounded-md object-cover aspect-square w-full" />
												{podcast.id === selectedPodcast?.id && (
													<div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-900/50 rounded-md flex items-center justify-center">
														<Icon icon="ci:check-big" className="text-green-500 text-3xl" />
													</div>
												)}
											</div>
											<div>
												<Typography className="font-bold leading-none">{podcast.name}</Typography>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
					<div className="flex justify-end gap-2 w-full pb-8 pt-4 sticky bottom-0 bg-white z-10">
						<Button variant="secondary" onClick={closeCreateModal}>
							Cancel
						</Button>
						<Button className="px-10" disabled={!isValid} onClick={savePodcast}>
							{isLoading ? <Spinner size={24} /> : 'Save'}
						</Button>
					</div>
				</div>
			</PageModal>
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete podcast: ${confirmDelete?.name}?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={deletePodcast}
			/>
		</div>
	);
};

export default Podcasts;
