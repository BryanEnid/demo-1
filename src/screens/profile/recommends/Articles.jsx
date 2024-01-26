import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

import { parseDuration } from '@/lib/utils.js';
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Carousel, CarouselContent, CarouselItem } from '@/chadcn/Carousel';
import { PageModal } from '@/components/PageModal.jsx';
import { Spinner } from '@/components/Spinner.jsx';
import useRecommends from '@/hooks/useRecommends.js';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';

const Articles = ({ data = [], isUserProfile }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [articleUrl, setArticleUrl] = useState('');
	const [confirmDelete, setConfirmDelete] = useState(null);

	const {
		articlePreview,
		isLoading,
		isArticleError,
		fetchArticlePreview,
		clearArticlePreview,
		createArticle,
		deleteArticle: handleDeleteArticle
	} = useRecommends();

	const isValid = !isLoading && !isArticleError && !!articlePreview?.title;

	const closeCreateModal = () => {
		setShowCreateModal(false);
		setArticleUrl('');
	};

	const saveArticle = async () => {
		await createArticle({ url: articleUrl });
		closeCreateModal();
	};

	const deleteArticle = async () => {
		await handleDeleteArticle({ id: confirmDelete.id });
		setConfirmDelete(null);
	};

	useEffect(() => {
		let timerId;
		if (articleUrl?.length) {
			timerId = setTimeout(() => {
				fetchArticlePreview(articleUrl);
			}, 300);
		} else {
			clearArticlePreview();
		}

		return () => timerId && clearTimeout(timerId);
	}, [articleUrl]);

	return (
		<div className="w-full">
			<div className="flex items-center gap-4 mb-5">
				<Typography variant="h2" className="!pb-0">
					Articles
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
					<Typography variant="muted">There are no articles added.</Typography>
				</div>
			) : (
				<Carousel
					opts={{
						align: 'start',
						dragFree: true
					}}
					className="w-full"
				>
					<CarouselContent>
						{data.map((article) => (
							<CarouselItem key={article.id} className="basis-1/2 lg:basis-1/4">
								<Card className="h-full flex flex-col">
									<CardHeader className="px-4 py-4">
										<a href={article.url} target="_blank" rel="noreferrer">
											<img src={article.picture} className="rounded-md object-cover aspect-square w-full" />
										</a>
									</CardHeader>
									<CardContent className="px-4 pb-4">
										<CardTitle className="text-lg leading-snug font-bold text-wrap">
											<a href={article.url} target="_blank" rel="noreferrer">
												{article.title}
											</a>
										</CardTitle>
										<Typography className="text-xs !mt-0 text-wrap">
											<span className="mr-2">Reading Time</span>
											<span>{article.readingTime ? `${parseDuration(article.readingTime)?.minutes} mins` : 'N/A'}</span>
										</Typography>
										<CardDescription className="text-black pt-2 line-clamp-6 ">{article.description}</CardDescription>
									</CardContent>
									{isUserProfile && (
										<CardFooter className="mt-auto px-4 pb-4">
											<div className="w-full flex justify-center">
												<Button
													variant="ghost"
													className="rounded-full w-[40px] h-[40px] p-1"
													onClick={() => setConfirmDelete(article)}
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
			)}
			<PageModal show={showCreateModal} onClose={closeCreateModal} width="600px">
				<div className="flex flex-col justify-center p-8 gap-5">
					<div className="flex justify-between items-center pb-2">
						<Typography variant="h3">Add Article</Typography>
						<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={closeCreateModal}>
							<Icon icon="mingcute:close-fill" className="text-2xl" />
						</Button>
					</div>
					<div className="relative w-full">
						<Input
							value={articleUrl}
							placeholder="Paste article URL"
							onChange={({ target }) => setArticleUrl(target.value)}
						/>
						{!isArticleError && articlePreview?.title && (
							<div className="absolute right-1 top-1 p-1 rounded-full bg-white z-10">
								<Icon fontSize={20} icon="tabler:check" className="text-green-600 h-full" />
							</div>
						)}
					</div>
					<div className="min-h-[80px]">
						{isLoading && (
							<div className="flex justify-center items-center h-full">
								<Spinner size={24} />
							</div>
						)}
						{!isLoading && isArticleError && <Typography className="text-red-500">Invalid URL</Typography>}
						{!isLoading && articlePreview && (
							<div className="flex gap-4">
								<div className="w-[80px] h-[80px]">
									<img src={articlePreview.picture} className="rounded-md object-cover aspect-square w-full" />
								</div>
								<div>
									<Typography className="font-bold leading-none">{articlePreview.title}</Typography>
									<Typography className="text-sm !mt-2 !leading-snug">{articlePreview.description}</Typography>
								</div>
							</div>
						)}
					</div>
					<div className="flex justify-end gap-2 w-full">
						<Button variant="secondary" onClick={closeCreateModal}>
							Cancel
						</Button>
						<Button className="px-10" disabled={!isValid} onClick={saveArticle}>
							{isLoading ? <Spinner size={24} /> : 'Save'}
						</Button>
					</div>
				</div>
			</PageModal>
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete article: ${confirmDelete?.title}?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={deleteArticle}
			/>
		</div>
	);
};

export default Articles;
