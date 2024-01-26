import React, { useMemo, useState, useRef, useEffect, forwardRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useBuckets } from '@/hooks/useBuckets';
import { useProfile } from '@/hooks/useProfile';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown';
import { Typography } from '@/chadcn/Typography.jsx';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@/chadcn/Button.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Separator } from '@/chadcn/Separator.jsx';
import { PageModal } from '@/components/PageModal.jsx';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';
import EditableLabel from '@/components/EditableLabel.jsx';
import { groupBy } from '@/lib/utils.js';
import { BucketItem } from './BucketItem';

const UNCATEGORIZED_BUCKETS_LABEL = 'Default';

const CategoryLabel = forwardRef(({ category, editable, onSubmit, onDelete }, ref) => {
	const [editing, setEditing] = useState(false);

	/** @type {React.MutableRefObject<number>} */
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
	const {
		data: buckets,
		updateBucket,
		updateBucketsCategory,
		deleteBucketsCategory,
		deleteBucket
	} = useBuckets(profile);
	const [{ isUserProfile, createBucket, bucketInfoOpen, showBucketInfo }] = useOutletContext();

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

		updateBucketsCategory({ category: encodeURIComponent(category), data: { label: newValue } });
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
				{ category: encodeURIComponent(confirmDelete), withBuckets },
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
				<div className="flex mb-8 min-h-[40px]">
					<Button
						variant="ghost"
						className="rounded-full border"
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
							<div className="grid grid-cols-5 gap-16">
								{isUserProfile && (
									<motion.div
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="flex items-center"
									>
										<BucketItem
											defaultContextMenu
											defaultIcon="ic:round-plus"
											width="w-[64px]"
											iconProps={{ color: '#06f', fontSize: '42px' }}
											onClick={() => createBucket({ category })}
										/>
									</motion.div>
								)}
							</div>
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
						<div className="grid grid-cols-5 gap-16">
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
									/>
								</motion.div>
							))}
							{isUserProfile && (
								<motion.div
									key="ADD NEW"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: groupedBucket[category].length * 0.05 }}
									className="flex items-center"
								>
									<BucketItem
										defaultContextMenu
										defaultIcon="ic:round-plus"
										width="w-[64px]"
										iconProps={{ color: '#06f', fontSize: '42px' }}
										onClick={() => createBucket({ category })}
									/>
								</motion.div>
							)}
						</div>
					</div>
				))}
				{!Object.keys(groupedBucket).length && isUserProfile && !tmpCategories.length && (
					<motion.div
						key="ADD NEW"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.05 }}
						className="flex items-center mt-10"
					>
						<BucketItem
							defaultContextMenu
							defaultIcon="ic:round-plus"
							width="w-[64px]"
							iconProps={{ color: '#06f', fontSize: '42px' }}
							onClick={() => createBucket({ category: 'Unlisted' })}
						/>
					</motion.div>
				)}
			</div>
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
