import React, { useState, useRef } from 'react';
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

const initialPeopleState = {
	name: '',
	picture: null
};

const People = ({ data = [], isUserProfile }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [peopleCreate, setPeopleCreate] = useState(initialPeopleState);
	const [isDragOver, setIsDragOver] = React.useState(false);
	const [confirmDelete, setConfirmDelete] = useState(null);

	const { isLoading, createPeople: handleCreatePeople, deletePeople: handleDeletePeople } = useRecommends();

	const fileInpRef = useRef();

	const isValid = !!(peopleCreate.name && peopleCreate.picture);

	const closeCreateModal = () => {
		setShowCreateModal(false);
		setPeopleCreate(initialPeopleState);
	};

	const savePeople = async () => {
		const { picture, ...data } = peopleCreate;
		const fd = new FormData();
		fd.append('picture', picture.file);

		await handleCreatePeople({
			...data,
			picture: fd
		});
		closeCreateModal();
	};

	const deletePeople = async () => {
		await handleDeletePeople({ id: confirmDelete.id });
		setConfirmDelete(null);
	};

	const openFileExplorer = () => {
		fileInpRef.current?.click?.();
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
		const file = files[0];

		if (!file || !file.type.startsWith('image/')) return alert('Please drop a valid image files.');

		prepareFiles(file);
	};

	const handleFilesChange = (e) => {
		prepareFiles(e.target.files[0]);
	};

	const prepareFiles = (file) => {
		setPeopleCreate((val) => ({
			...val,
			picture: { file, url: URL.createObjectURL(file) }
		}));
	};

	const handleChange = (e) => {
		setPeopleCreate((val) => ({ ...val, [e.target.name]: e.target.value }));
	};

	return (
		<div>
			<div className="flex items-center gap-4 mb-5">
				<Typography variant="h2" className="!pb-0">
					People
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
					{data.map((people) => (
						<CarouselItem key={people.id} className="basis-1/2 lg:basis-1/4">
							<Card className="h-full flex flex-col">
								<CardHeader className="px-4 py-4">
									<div className="w-full">
										<div className="aspect-square flex justify-center items-center">
											<img src={people.picture} className="rounded-md max-w-full max-h-full " />
										</div>
									</div>
								</CardHeader>
								<CardContent className="px-4 pb-4">
									<CardTitle className="text-lg leading-snug font-bold text-wrap text-center">{people.name}</CardTitle>
								</CardContent>
								{isUserProfile && (
									<CardFooter className="mt-auto px-4 pb-4">
										<div className="w-full flex justify-center">
											<Button
												variant="ghost"
												className="rounded-full w-[40px] h-[40px] p-1"
												onClick={() => setConfirmDelete(people)}
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
				<div className="flex flex-col justify-center p-8 gap-5 w-screen">
					<div className="flex justify-between items-center pb-2">
						<Typography variant="h3">Add Person</Typography>
						<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={closeCreateModal}>
							<Icon icon="mingcute:close-fill" className="text-2xl" />
						</Button>
					</div>
					<div className="flex flex-col gap-5 w-full">
						<Input name="name" value={peopleCreate.name} placeholder="Name" onChange={handleChange} />
						<div>
							<input type="file" className="hidden" accept="image/*" ref={fileInpRef} onChange={handleFilesChange} />
							<div
								onClick={openFileExplorer}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								style={{ transition: '0.5s' }}
								className={[
									'border-dashed border border-black/30 rounded-lg p-2 transition relative overflow-hidden cursor-pointer min-h-[70px]',
									isDragOver && 'bg-primary'
								].join(' ')}
							>
								<div className="flex flex-col justify-center items-center w-full pt-4">
									{peopleCreate.picture?.url && (
										<div className="flex justify-center items-center rounded-lg w-[60px] h-[60px]">
											<img src={peopleCreate.picture.url} className="rounded-md max-w-full max-h-full" />
										</div>
									)}
									<Typography variant="muted">Choose Person picture</Typography>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-end gap-2 w-full">
						<Button variant="secondary" onClick={closeCreateModal}>
							Cancel
						</Button>
						<Button className="px-10" disabled={!isValid || isLoading} onClick={savePeople}>
							{isLoading ? <Spinner size={24} /> : 'Save'}
						</Button>
					</div>
				</div>
			</PageModal>
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete ${confirmDelete?.name} from people?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={deletePeople}
			/>
		</div>
	);
};

export default People;
