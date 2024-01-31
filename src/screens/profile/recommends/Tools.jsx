import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { Icon } from '@iconify/react';

import { cn, groupBy } from '@/lib/utils.js';
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown';
import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Carousel, CarouselContent, CarouselItem } from '@/chadcn/Carousel';
import { PageModal } from '@/components/PageModal.jsx';
import { Spinner } from '@/components/Spinner.jsx';
import useRecommends from '@/hooks/useRecommends.js';
import useEmoji from '@/hooks/useEmoji.js';
import { BASE_URL } from '@/config/api.js';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';

// TODO:... move to components dir
const EditableLabel = ({
	controls,
	value,
	className,
	onSave: handleSave = () => {},
	onCancel: handleCancel = () => {}
}) => {
	const [inputVal, setInputVal] = useState(value);
	const [editing, setEditing] = useState(false);

	const onSave = () => {
		if (!inputVal) {
			setInputVal(value);
			return handleCancel();
		}

		if (value !== inputVal) {
			handleSave(inputVal);
		}
	};

	const onCancel = () => {
		setEditing(false);
		setInputVal(value);
		handleCancel();
	};

	const onFocus = () => {
		setEditing(true);
	};

	const onBlur = () => {
		if (!controls) {
			setEditing(false);
			onSave();
		}
	};

	return (
		<div className="flex items-center gap-1 max-w-full">
			<div className="flex relative h-[44px] overflow-hidden">
				<div className={cn('px-3 mr-3 bar border-l border-r border-transparent invisible', className)}>{inputVal}</div>
				<Input
					value={inputVal}
					className={cn(
						!controls || !editing ? 'border-transparent shadow-none focus:border-input focus:shadow-sm' : '',
						'absolute top-[1px] left-[1px] right-[1px] w-auto',
						className
					)}
					onChange={(e) => setInputVal(e.target.value)}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</div>
			{controls && editing && (
				<>
					<Button className="w-[36px] h-[36px] p-1 shrink-0" onClick={() => onSave(inputVal)}>
						<Icon icon="ci:check-big" className="text-2xl" />
					</Button>
					<Button variant="secondary" className="rounded-full shrink-0 w-[36px] h-[36px] p-1" onClick={onCancel}>
						<Icon icon="mingcute:close-fill" className="text-2xl" />
					</Button>
				</>
			)}
		</div>
	);
};

const initialToolState = {
	title: '',
	category: '',
	picture: null,
	externalImg: false
};

const Tools = ({ data = [], isUserProfile }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [toolCreate, setToolCreate] = useState(initialToolState);
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [newCategoryValue, setNewCategoryValue] = useState('');
	const [tmpCategories, setTmpCategories] = useState([]);
	const [confirmDelete, setConfirmDelete] = useState(null);

	const [isDragOver, setIsDragOver] = React.useState(false);

	const { isLoading, createTool, deleteTool: handleDeleteTool, updateToolsCategory } = useRecommends();
	const { data: emojis } = useEmoji(toolCreate.title);

	const fileInpRef = useRef();
	const newCategoryInpRef = useRef();

	const isValid = !!(toolCreate.title && toolCreate.picture && toolCreate.category);

	const toolsGrouped = useMemo(() => groupBy(data, ({ category }) => category), [data]);

	useEffect(() => {
		const filteredCategories = tmpCategories.filter((category) => !toolsGrouped[category]);
		setTmpCategories(filteredCategories);
	}, [data]);

	useEffect(() => {
		let timerId;
		if (showNewCategory) {
			timerId = setTimeout(() => {
				newCategoryInpRef.current?.focus();
			}, 300);
		}

		return () => timerId && clearTimeout(timerId);
	}, [showNewCategory]);

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
		setToolCreate((val) => ({
			...val,
			picture: { file, url: URL.createObjectURL(file) },
			externalImg: false
		}));
	};

	const closeCreateModal = () => {
		setShowCreateModal(false);
		setToolCreate(initialToolState);
	};

	const getFormData = (file) => {
		const fd = new FormData();
		fd.append('picture', file);
		return fd;
	};

	const saveTool = async () => {
		const { picture, ...data } = toolCreate;
		await createTool({
			...data,
			picture: typeof picture === 'string' ? picture : getFormData(picture.file)
		});
		closeCreateModal();
	};

	const deleteTool = async () => {
		await handleDeleteTool({ id: confirmDelete.id });
		setConfirmDelete(null);
	};

	const handleChange = (e) => {
		setToolCreate((val) => ({ ...val, [e.target.name]: e.target.value }));
	};

	const selectImage = (url) => {
		if (fileInpRef.current) {
			fileInpRef.current.value = null;
		}
		setToolCreate((val) => ({ ...val, picture: url, externalImg: true }));
	};

	const addCategory = (value) => {
		setTmpCategories((val) => [value, ...val]);
	};
	const cancelAddingCategory = () => {
		setTmpCategories((val) => val.filter((item) => !!item));
	};
	const submitNewCategory = (oldCategory, newCategory) => {
		setTmpCategories((val) => val.map((item) => (item === oldCategory ? newCategory : item)));
	};

	const submitEditCategory = (oldCategory, newCategory) => {
		updateToolsCategory({ category: encodeURIComponent(oldCategory), data: { label: newCategory } });
	};

	return (
		<div>
			<div className="flex items-center gap-4 mb-5">
				<Typography variant="h2" className="!pb-0">
					Tools
				</Typography>
				{isUserProfile && (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="outline"
								className="text-primary rounded-full w-[30px] h-[30px] p-1"
								onClick={() => setShowCreateModal(true)}
							>
								<Icon icon="mi:options-horizontal" className="text-2xl" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className="py-3 px-3"
								onClick={() => {
									setShowNewCategory(true);
									setNewCategoryValue('');
								}}
							>
								<Icon icon="ic:round-plus" className="pr-1 text-xl" />
								Add section
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
					{showNewCategory && (
						<CarouselItem className="basis-1/2 lg:basis-1/3">
							<div>
								<div className="mb-5 max-w-full">
									<Input
										autofocus
										ref={newCategoryInpRef}
										value={newCategoryValue}
										className="font-bold text-2xl tracking-tight h-[40px]"
										onChange={(e) => setNewCategoryValue(e.target.value)}
										onBlur={() => {
											if (newCategoryValue) {
												addCategory(newCategoryValue);
											}
											setNewCategoryValue('');
											setShowNewCategory(false);
										}}
									/>
								</div>
							</div>
						</CarouselItem>
					)}
					{!!tmpCategories.length &&
						tmpCategories.map((category) => (
							<CarouselItem key={category} className="basis-1/2 lg:basis-1/3">
								<div>
									<div className="mb-5 max-w-full">
										{isUserProfile ? (
											<div className="flex items-center gap-1 max-w-full">
												<EditableLabel
													value={category}
													className="font-bold text-2xl tracking-tight h-[40px]"
													onSave={(newVal) => submitNewCategory(category, newVal)}
												/>
												{!!category.length && (
													<Button
														variant="outline"
														className="text-primary rounded-full w-[30px] h-[30px] p-1"
														onClick={() => {
															setShowCreateModal(true);
															setToolCreate((val) => ({ ...val, category }));
														}}
													>
														<Icon icon="ic:round-plus" className="text-2xl" />
													</Button>
												)}
											</div>
										) : (
											<Typography variant="h3" className="!font-bold px-3 !py-1 bar border-l border-transparent">
												{category}
											</Typography>
										)}
									</div>
									<div></div>
								</div>
							</CarouselItem>
						))}
					{Object.keys(toolsGrouped).map((category) => (
						<CarouselItem key={category} className="basis-1/2 lg:basis-1/3">
							<div>
								<div className="mb-5 max-w-full">
									{isUserProfile ? (
										<div className="flex items-center gap-1 max-w-full">
											<EditableLabel
												value={category}
												className="font-bold text-2xl tracking-tight h-[40px]"
												onSave={(newVal) => submitEditCategory(category, newVal)}
											/>
											<Button
												variant="outline"
												className="text-primary rounded-full w-[30px] h-[30px] p-1"
												onClick={() => {
													setShowCreateModal(true);
													setToolCreate((val) => ({ ...val, category }));
												}}
											>
												<Icon icon="ic:round-plus" className="text-2xl" />
											</Button>
										</div>
									) : (
										<Typography variant="h3" className="!font-bold px-3 !py-1 bar border-l border-transparent">
											{category}
										</Typography>
									)}
								</div>
								<div>
									{toolsGrouped[category].map((tool) => (
										<Card key={tool.id} className="h-[130px] w-full flex items-center gap-5 mb-4 px-10">
											{!!tool.picture && (
												<div className="w-[100px] h-[80px] flex items-center justify-center">
													<img
														src={tool.picture}
														className="max-w-full max-h-full "
														onError={(e) => {
															e.target.onerror = null;
															e.target.src = `${BASE_URL}/static/external?url=${tool.picture}`;
														}}
													/>
												</div>
											)}
											<div>
												<Typography className="text-xl">{tool.title}</Typography>
											</div>
											<Button
												variant="ghost"
												className="rounded-full w-[40px] h-[40px] p-1 ml-auto"
												onClick={() => setConfirmDelete(tool)}
											>
												<Icon className="text-gray-500 text-xl" icon="mi:delete" />
											</Button>
										</Card>
									))}
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<PageModal show={showCreateModal} onClose={closeCreateModal} width="600px">
				<div className="flex flex-col justify-center p-8 gap-5 w-screen">
					<div className="flex justify-between items-center pb-2">
						<Typography variant="h3">Add Tool</Typography>
						<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={closeCreateModal}>
							<Icon icon="mingcute:close-fill" className="text-2xl" />
						</Button>
					</div>
					<div className="flex flex-col gap-5 w-full">
						<Input name="title" value={toolCreate.title} placeholder="Title" onChange={handleChange} />
						<Input name="category" value={toolCreate.category} placeholder="Category" onChange={handleChange} />

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
									{toolCreate.picture?.url && (
										<div className="flex justify-center items-center rounded-lg w-[60px] h-[60px]">
											<img src={toolCreate.picture.url} className="rounded-md max-w-full max-h-full" />
										</div>
									)}
									<Typography variant="muted">Choose Tool picture</Typography>
								</div>
							</div>
							{!!emojis?.length && (
								<div>
									<Typography className="font-bold flex justify-center py-1">Or select</Typography>
									<div className="flex gap-2">
										{emojis.slice(0, 5).map(({ iconUrl }) => (
											<div
												key={iconUrl}
												className="cursor-pointer border border-1 w-1/5 p-2 relative"
												onClick={() => selectImage(iconUrl)}
											>
												<img src={`${BASE_URL}/static/external?url=${iconUrl}`} className="max-w-full max-h-full " />
												{typeof toolCreate.picture === 'string' && toolCreate?.picture === iconUrl && (
													<Icon icon="ci:check-big" className="text-2xl text-green-500 absolute top-0 right-0" />
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="flex justify-end gap-2 w-full">
						<Button variant="secondary" onClick={closeCreateModal}>
							Cancel
						</Button>
						<Button className="px-10" disabled={!isValid || isLoading} onClick={saveTool}>
							{isLoading ? <Spinner size={24} /> : 'Save'}
						</Button>
					</div>
				</div>
			</PageModal>
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete tool: ${confirmDelete?.title}?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={deleteTool}
			/>
		</div>
	);
};

export default Tools;
