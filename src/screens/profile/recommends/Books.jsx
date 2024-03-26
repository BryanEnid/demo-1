import React, { useState, useEffect, useRef } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Icon } from '@iconify/react';

import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography';
import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input.jsx';
import { Textarea } from '@/chadcn/Textarea.jsx';
import { Carousel, CarouselContent, CarouselItem } from '@/chadcn/Carousel';
import { PageModal } from '@/components/PageModal';
import { Spinner } from '@/components/Spinner.jsx';
import useRecommends from '@/hooks/useRecommends.js';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Image } from '@/components/Image';

const initialBookState = {
	title: '',
	author: '',
	description: '',
	photos: []
};

const Books = ({ data = [], isUserProfile }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [bookCreate, setBookCreate] = useState(initialBookState);
	const [editMode, setEditMode] = useState(false);
	const [activePicture, setActivePicture] = useState(0);
	const [isDragOver, setIsDragOver] = React.useState(false);
	const [confirmDelete, setConfirmDelete] = useState(null);

	const { isLoading, createBook, updateBook, deleteBook: handleDelete } = useRecommends();

	const isValid = !!(bookCreate.photos.length && bookCreate.title && bookCreate.author && bookCreate.description);

	const dropZoneRef = useRef();
	const fileInpRef = useRef();

	const showBookDetails = (book, editMode = false) => {
		setShowCreateModal(true);
		setBookCreate({ ...book });
		setEditMode(editMode);
		setActivePicture(0);
	};

	const openCreateModal = () => {
		setShowCreateModal(true);
		setEditMode(true);
	};

	const closeCreateModal = () => {
		setShowCreateModal(false);
		setBookCreate(initialBookState);
		setEditMode(false);
		setActivePicture(0);
	};

	const saveBook = async () => {
		const { id, photos, ...data } = bookCreate;

		if (id) {
			await updateBook({
				id,
				...data,
				photos: photos.map((item) => {
					if (item.file) {
						const photo = new FormData();
						photo.append('photo', item.file);
						return photo;
					}
					return item;
				})
			});
		} else {
			await createBook({
				...data,
				photos: photos.map(({ file }) => {
					const photo = new FormData();
					photo.append('photo', file);
					return photo;
				})
			});
		}
		closeCreateModal();
	};

	const deleteBook = async () => {
		await handleDelete({ id: confirmDelete.id });
		setConfirmDelete(null);
		closeCreateModal();
	};

	const openFileExplorer = () => {
		fileInpRef.current?.click?.();
	};

	const prepareFiles = (files) => {
		const newPhotos = Array.prototype.map.call(files, (file) => ({ file, url: URL.createObjectURL(file) }));
		setBookCreate((val) => ({ ...val, photos: [...val.photos, ...newPhotos] }));
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

		for (const item of files) {
			if (!item.type.startsWith('image/')) return alert('Please drop a valid image files.');
		}

		prepareFiles(files);
	};

	const handleFilesChange = (e) => {
		prepareFiles(e.target.files);
	};

	const handleChange = (e) => {
		setBookCreate((val) => ({ ...val, [e.target.name]: e.target.value }));
	};

	const removePhoto = (photo) => {
		setBookCreate((val) => ({
			...val,
			photos: val.photos.filter((item) => {
				if (photo.file) {
					return item.url !== photo.url;
				} else {
					return item.imgUrl !== photo.imgUrl;
				}
			})
		}));
	};

	return (
		<div>
			<div className="flex items-center gap-4 mb-5 ">
				<Typography variant="h2" className="!pb-0">
					Books
				</Typography>
				{isUserProfile && (
					<Button
						variant="outline"
						className="text-primary rounded-full w-[30px] h-[30px] p-1"
						onClick={() => openCreateModal()}
					>
						<Icon icon="ic:round-plus" className="text-2xl" />
					</Button>
				)}
			</div>
			{!data.length && !isUserProfile ? (
				<div>
					<Typography variant="muted">There are no books added.</Typography>
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
						{data.map((book) => (
							<CarouselItem key={book.id} className="basis-1/2 lg:basis-1/4">
								<Card className="h-full flex flex-col cursor-pointer" onClick={() => showBookDetails(book)}>
									<CardHeader className="px-4 py-4">
										<div className="w-full">
											<div className="aspect-square flex justify-center items-center">
												<Image src={book.photos[0]?.imgUrl} className="rounded-md max-w-full max-h-full" />
											</div>
										</div>
									</CardHeader>
									<CardContent className="px-4 pb-4">
										<CardTitle className="text-lg leading-snug font-bold">{book.title}</CardTitle>
										<Typography className="text-xs !mt-0">{book.author}</Typography>
										<CardDescription className="text-black pt-2 line-clamp-6">{book.description}</CardDescription>
									</CardContent>
									{isUserProfile && (
										<CardFooter className="mt-auto px-4 pb-4">
											<div className="w-full flex justify-center gap-2">
												<Button
													variant="ghost"
													className="rounded-full w-[40px] h-[40px] p-1"
													onClick={(e) => {
														e.stopPropagation();
														e.preventDefault();
														showBookDetails(book);
														setEditMode(true);
													}}
												>
													<Icon className="text-gray-500 text-xl" icon="material-symbols:edit" />
												</Button>
												<Button
													variant="ghost"
													className="rounded-full w-[40px] h-[40px] p-1"
													onClick={(e) => {
														e.stopPropagation();
														e.preventDefault();
														setConfirmDelete(book);
													}}
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
								<Card className="flex justify-center items-center cursor-pointer" onClick={() => openCreateModal()}>
									<div className="flex justify-center items-center object-cover aspect-square w-full">
										<Icon icon="ph:plus-bold" className=" text-7xl text-primary"></Icon>
									</div>
								</Card>
							</CarouselItem>
						)}
					</CarouselContent>
				</Carousel>
			)}
			<PageModal show={showCreateModal} onClose={closeCreateModal} width="600px" maxWidth="100vw">
				<div className="flex flex-col justify-center p-8 gap-5 w-full">
					<div className="flex justify-between items-center pb-2">
						<Typography variant="h3">{bookCreate?.id ? `Book / ${bookCreate.title}` : 'Add Book'}</Typography>
						<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={closeCreateModal}>
							<Icon icon="mingcute:close-fill" className="text-2xl" />
						</Button>
					</div>
					<div className="flex flex-col gap-5 w-full">
						{editMode ? (
							<>
								<Input name="title" value={bookCreate.title} placeholder="Title" onChange={handleChange} />
								<Input name="author" value={bookCreate.author} placeholder="Author" onChange={handleChange} />
								<Textarea
									name="description"
									value={bookCreate.description}
									placeholder="Description"
									className="min-h-[200px] border-input"
									onChange={handleChange}
								/>
								<input
									multiple
									type="file"
									className="hidden"
									accept="image/*"
									ref={fileInpRef}
									onChange={handleFilesChange}
								/>
								<div
									ref={dropZoneRef}
									onClick={openFileExplorer}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									style={{ transition: '0.5s' }}
									className={[
										'border-dashed border border-black/30 rounded-lg p-2 transition relative overflow-hidden cursor-pointer min-h-[100px]',
										isDragOver && 'bg-primary'
									].join(' ')}
								>
									<ReactSortable
										className="flex flex-wrap w-full h-full relative"
										list={bookCreate.photos}
										setList={(state) => setBookCreate((prev) => ({ ...prev, photos: state }))}
										group="1"
										animation={500}
										delayOnTouchStart
										delay={0}
										draggable=".draggable"
										filter=".undraggable"
										ghostClass="opacity-0"
									>
										{bookCreate.photos.map((photo) => (
											<div
												key={photo.url || photo.imgUrl}
												className="draggable relative w-1/5 aspect-square p-1"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
											>
												<div className="flex justify-center items-center aspect-square rounded-lg object-cover border-dashed border border-black/10">
													<Image src={photo.url || photo.imgUrl} className="rounded-md max-w-full max-h-full" />
												</div>
												<Button
													variant="destructive"
													className="absolute -top-[2px] -right-[2px] rounded-full w-[15px] h-[15px] p-1 opacity-50 hover:opacity-70"
													onClick={() => removePhoto(photo)}
												>
													<Icon icon="mingcute:close-fill" fontSize={10} />
												</Button>
											</div>
										))}
									</ReactSortable>
									<div className="flex justify-center items-center w-full pt-4">
										<Typography variant="muted">Choose files or drag it here</Typography>
									</div>
								</div>
							</>
						) : (
							<>
								<div>
									<div className="w-full">
										<div className="aspect-square flex justify-center items-center">
											<Image
												src={bookCreate.photos[activePicture]?.imgUrl}
												className="rounded-md max-w-full max-h-full "
											/>
										</div>
									</div>
									<div className="w-full flex gap-1">
										{bookCreate.photos.map((photo, i) => (
											<div
												key={photo.imgUrl}
												className="w-[50px] aspect-square flex justify-center items-center"
												onClick={() => setActivePicture(i)}
											>
												<Image src={bookCreate.photos[i]?.imgUrl} className="rounded-md max-w-full max-h-full " />
											</div>
										))}
									</div>
								</div>
								<div>
									<Typography className="!mt-0 font-bold">{bookCreate.title}</Typography>
									<Typography className="!mt-0">{bookCreate.author}</Typography>
								</div>
								<Typography className="!mt-0">{bookCreate.description}</Typography>
							</>
						)}
					</div>
					{isUserProfile && !editMode && (
						<div className="flex gap-2">
							<Button
								variant="secondary"
								className="rounded-md"
								iconBegin={<Icon icon="material-symbols:edit" />}
								onClick={() => setEditMode(true)}
							>
								Edit
							</Button>
							<Button
								variant="destructive"
								className="rounded-md"
								iconBegin={<Icon icon="mingcute:close-fill" />}
								onClick={() => setConfirmDelete(bookCreate)}
							>
								Delete
							</Button>
						</div>
					)}
					{isUserProfile && editMode && (
						<div className="flex justify-end gap-2 w-full">
							<Button variant="secondary" onClick={closeCreateModal}>
								Cancel
							</Button>
							<Button className="px-10" disabled={!isValid || isLoading} onClick={saveBook}>
								{isLoading ? <Spinner size={24} /> : 'Save'}
							</Button>
						</div>
					)}
					{showCreateModal && (
						<ConfirmDialog
							show={!!confirmDelete}
							title={`Are you sure you want to delete book: ${confirmDelete?.title}?`}
							submitLabel="Delete"
							onClose={() => setConfirmDelete(null)}
							onConfirm={deleteBook}
						/>
					)}
				</div>
			</PageModal>
			{!showCreateModal && (
				<ConfirmDialog
					show={!!confirmDelete}
					title={`Are you sure you want to delete book: ${confirmDelete?.title}?`}
					submitLabel="Delete"
					onClose={() => setConfirmDelete(null)}
					onConfirm={deleteBook}
				/>
			)}
		</div>
	);
};

export default Books;
