import React, { useMemo, useState, useRef, useEffect, forwardRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBuckets } from '@/hooks/useBuckets';
import { useProfile } from '@/hooks/useProfile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown';
import { Typography } from '@/chadcn/Typography';
import { Icon } from '@iconify/react/dist/iconify';
import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input';
import { Separator } from '@/chadcn/Separator';
import { PageModal } from '@/components/PageModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import EditableLabel from '@/components/EditableLabel';
import { groupBy } from '@/lib/utils';
import { BucketItem } from './BucketItem';
import { useMobile } from '@/hooks/useMobile';
import { useLayout } from '@/providers/LayoutProvider';

const UNCATEGORIZED_BUCKETS_LABEL = 'Default';
const AddBucketBtn = ({ onClick }) => (
	<div className="select-none">
		<button onClick={onClick} className={`size-[64px] transition ease-in-out hover:scale-105 select-none`}>
			<div
				className={`flex object-cover aspect-square shadow drop-shadow-xl rounded-full p-1 bg-white transition ease-in-out hover:shadow-md hover:shadow-primary justify-center items-center`}
			>
				<div className="flex h-full w-full justify-center items-center text-gray-300 p-3">
					<Icon icon="ic:round-plus" color="#06f" fontSize="42px" />
				</div>
			</div>
		</button>
	</div>
);
const CategoryLabel = forwardRef(({ category, editable, onSubmit, onDelete }, ref) => {
	const [editing, setEditing] = useState(false);
	// /** @type {React.MutableRefObject<number>} */
	const timeoutId = useRef();
	const handleSetEditing = () => {
		timeoutId.current = setTimeout(() => {
			setEditing(true);
		}, 300);
	};
	useEffect(() => {
		return () => timeoutId.current && clearTimeout(timeoutId.current);
	}, []);
	return (
		<div className="mb-9 flex gap-1 items-center">
			{!editable ? (
				<Typography variant="h3">{category}</Typography>
			) : (
				<>
					<EditableLabel
						value={category}
						focus={editing}
						className="text-2xl font-semibold tracking-tight h-[40px]"
						onSave={(val) => {
							setEditing(false);
							onSubmit(category, val);
						}}
						onCancel={() => setEditing(false)}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="secondary" className="rounded-full p-1 w-[40px] h-[40px]">
								<Icon icon="mi:options-horizontal" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem className="py-3 px-3" onClick={handleSetEditing}>
								<Icon icon="clarity:edit-line" className="pr-1 text-xl" />
								Rename section
							</DropdownMenuItem>
							<DropdownMenuItem
								className="py-3 px-3 text-red-500 hover:text-red-500 focus:text-red-500"
								onClick={onDelete}
							>
								<Icon icon="fluent:delete-48-regular" className="pr-1 text-xl" />
								Delete section
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)}
		</div>
	);
});
CategoryLabel.displayName = 'CategoryLabel';
export function Buckets() {
	// Hooks
	const { data: profile } = useProfile();
	const [{ isUserProfile, isOrganization }] = useOutletContext();
	const {
		data: buckets,
		updateBucket,
		updateBucketsCategory,
		deleteBucketsCategory,
		deleteBucket
	} = useBuckets(profile, isOrganization);
	const { isMobile } = useMobile();
	const { bucketInfoOpen, showBucketInfo, showCreateBucketModal } = useLayout();

	// State
	const [confirmDelete, setConfirmDelete] = useState(null);
	const [deleteWithBuckets, setDeleteWithBuckets] = useState(false);

	const [showNewCategory, setShowNewCategory] = useState(false);
	const [newCategoryValue, setNewCategoryValue] = useState('');
	const [tmpCategories, setTmpCategories] = useState([]);

	// Refs
	const newCategoryRef = useRef();

	const groupedBucket = useMemo(
		() => groupBy(buckets || [], ({ category }) => category || UNCATEGORIZED_BUCKETS_LABEL),
		[buckets]
	);

	useEffect(() => {
		if (bucketInfoOpen) {
			const bucket = buckets.find(({ id }) => id === bucketInfoOpen.id);
			showBucketInfo(bucket);
		}
	}, [buckets]);

	useEffect(() => {
		if (showNewCategory) {
			newCategoryRef.current?.focus?.();
		}
	}, [showNewCategory]);

	useEffect(() => {
		const filteredCategories = tmpCategories.filter((category) => !groupedBucket[category]);
		setTmpCategories(filteredCategories);
	}, [buckets]);

	const saveCategory = (e) => {
		e.preventDefault();

		if (!newCategoryValue?.length) {
			return;
		}

		setNewCategoryValue('');
		setShowNewCategory(false);
		setTmpCategories((val) => [newCategoryValue, ...val]);
	};

	const submitEditCategory = (category, newValue) => {
		if (!newValue?.length) {
			return;
		}

		updateBucketsCategory({
			category: encodeURIComponent(category),
			data: { label: newValue },
			ownerId: profile.id,
			isOrganization
		});
	};

	const submitEditTmpCategory = (category, newValue) => {
		if (!newValue?.length) {
			return;
		}

		setTmpCategories((val) => val.map((item) => (item === category ? newValue : item)));
		setNewCategoryValue('');
	};

	const deleteCategory = (withBuckets) => {
		if (tmpCategories.includes(confirmDelete)) {
			setTmpCategories((categories) => categories.filter((item) => item !== confirmDelete));
			setConfirmDelete(null);
			setDeleteWithBuckets(false);
		} else {
			deleteBucketsCategory(
				{
					category: encodeURIComponent(confirmDelete),
					withBuckets,
					ownerId: profile.id,
					isOrganization
				},
				{
					onSuccess: () => {
						setConfirmDelete(null);
						setDeleteWithBuckets(false);
					}
				}
			);
		}
	};

	return (
		<div>
			{isUserProfile && (
				<div className="justify-center flex mb-8 min-h-[40px] md:justify-start w-full">
					<Button
						variant="ghost"
						className="rounded-full border w-full md:w-auto"
						disabled={showNewCategory}
						iconBegin={<Icon icon="ic:round-plus" />}
						onClick={() => {
							setShowNewCategory(true);
							setNewCategoryValue('');
						}}
					>
						Add section
					</Button>
				</div>
			)}

			<div className="flex flex-col">
				{showNewCategory && (
					<form onSubmit={saveCategory}>
						<div className="mb-20 flex items-center gap-1">
							<Input
								ref={newCategoryRef}
								value={newCategoryValue}
								placeholder="Section Name"
								onChange={({ target }) => setNewCategoryValue(target.value)}
								className="bg-white/10 w-[300px] text-2xl font-semibold tracking-tight h-[40px]"
							/>
							<Button
								type="submit"
								variant="default"
								className="rounded-full border"
								disabled={!newCategoryValue?.length}
								iconBegin={<Icon icon="ic:round-plus" />}
							>
								Save
							</Button>
							<Button
								type="button"
								variant="secondary"
								className="rounded-full"
								onClick={() => setShowNewCategory(false)}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}

				{!!tmpCategories.length &&
					tmpCategories.map((category) => (
						<div key={category} className="mb-20">
							<CategoryLabel
								category={category}
								editable={isUserProfile}
								onDelete={() => setConfirmDelete(category)}
								onSubmit={submitEditTmpCategory}
							/>

							<div className="grid gap-16 grid-cols-3">
								{isUserProfile && !isMobile && (
									<motion.div
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="flex items-center"
									>
										<AddBucketBtn onClick={() => showCreateBucketModal({ category })} />
									</motion.div>
								)}
							</div>
							{isUserProfile && isMobile && (
								<div className="mt-10">
									<Button
										className="w-full"
										variant="secondary"
										iconBegin={<Icon name="ic:round-plus" />}
										onClick={() => showCreateBucketModal({ category })}
									>
										Add bucket
									</Button>
								</div>
							)}
						</div>
					))}

				{Object.keys(groupedBucket).map((category) => (
					<div key={category} className="mb-20">
						<CategoryLabel
							category={category}
							editable={isUserProfile}
							onDelete={() => setConfirmDelete(category)}
							onSubmit={submitEditCategory}
						/>
						{/* <div className="grid gap-16 grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5"> */}
						<div className="relative grid gap-1 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
							{groupedBucket[category].map((bucket, index) => (
								<motion.div
									key={bucket.id}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
								>
									<BucketItem
										data={bucket}
										name={bucket.name}
										preview={bucket.videos[0]?.videoUrl}
										documentId={bucket.id}
										isUserProfile={isUserProfile}
										updateBucket={updateBucket}
										deleteBucket={deleteBucket}
										showBucketInfo={showBucketInfo}
										width="size-36 md:size-[190px]"
									/>
								</motion.div>
							))}

							{isUserProfile && !isMobile && (
								<motion.div
									key="ADD NEW"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: groupedBucket[category].length * 0.05 }}
									className="flex items-center justify-center"
								>
									<AddBucketBtn onClick={() => showCreateBucketModal({ category })} />
								</motion.div>
							)}
						</div>

						{isUserProfile && isMobile && (
							<div className="mt-10">
								<Button
									className="w-full"
									variant="secondary"
									iconBegin={<Icon name="ic:round-plus" />}
									onClick={() => showCreateBucketModal({ category })}
								>
									Add bucket
								</Button>
							</div>
						)}
					</div>
				))}

				{!Object.keys(groupedBucket).length && isUserProfile && !tmpCategories.length && (
					<div className="mb-20">
						<motion.div
							key="ADD NEW"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.05 }}
							className="flex items-center mt-10"
						>
							<AddBucketBtn onClick={() => showCreateBucketModal({ category: 'Unlisted' })} />
						</motion.div>
					</div>
				)}
			</div>
			{/* 
			Remove ConfirmDialog and instead delete bucket list immediately 
			Then offer undo button to restore recently deleted bucket list
			onDelete will add timer 7days for bucket list deletion from database, after undo button disappears
			*/}
			<ConfirmDialog
				show={!!confirmDelete}
				title="Are you sure you want to delete this section?"
				subTitle={`This section ${confirmDelete} includes ${groupedBucket[confirmDelete]?.length || 0} buckets`}
				submitLabel="Delete section"
				submitBtnVariant="destructive"
				onClose={() => setConfirmDelete(null)}
				onCancel={() => setConfirmDelete(null)}
				onConfirm={() => deleteCategory(deleteWithBuckets)}
			>
				{!!groupedBucket[confirmDelete]?.length && (
					<div>
						<label className="flex items-center gap-1">
							<Input
								checked={!deleteWithBuckets}
								type="radio"
								name="deleteCategoryOption"
								className="w-auto"
								onChange={(e) => setDeleteWithBuckets(!e.target.checked)}
							/>
							Delete this section and keep these {groupedBucket[confirmDelete]?.length || 0} buckets
						</label>

						<label className="flex items-center gap-1">
							<Input
								checked={deleteWithBuckets}
								type="radio"
								name="deleteCategoryOption"
								className="w-auto"
								onChange={(e) => setDeleteWithBuckets(e.target.checked)}
							/>
							Delete this section and delete these {groupedBucket[confirmDelete]?.length || 0} buckets
						</label>
					</div>
				)}
			</ConfirmDialog>
		</div>
	);
}
