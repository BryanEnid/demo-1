import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/chadcn/Select.jsx';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';
import { useBuckets } from '@/hooks/useBuckets.js';
import ShareModal from '@/components/ShareModal.jsx';
import { Image } from './Image';

const dateOpts = {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	hour12: true,
	hour: 'numeric',
	minute: 'numeric'
};

const BucketInfo = ({ bucket, canEdit, isUserProfile, onClose }) => {
	const navigate = useNavigate();
	const { updateBucket } = useBuckets();

	const [isPrivate, setIsPrivate] = useState(bucket.private.toString());
	const [confirmDelete, setConfirmDelete] = useState(null);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	useEffect(() => {
		setIsPrivate(bucket.private.toString());
	}, [bucket.id]);

	const openContributor = (user) => {
		navigate(`/${user.uid}`);
	};

	const saveBucketType = () => {
		updateBucket({ data: { ...bucket, private: isPrivate === 'true' }, documentId: bucket.id });
	};

	const updateBucketSettings = ({ contributors, isPrivate }) => {
		updateBucket(
			{ data: { ...bucket, contributors, private: isPrivate }, documentId: bucket.id },
			{
				onSuccess: () => {
					setConfirmDelete(false);
					setShareModalOpen(false);
				}
			}
		);
	};

	const removeContributor = () => {
		const contributors = bucket.contributors.filter(({ userId }) => userId !== confirmDelete.userId);
		updateBucketSettings({ contributors, isPrivate: bucket.private });
	};

	const copyLink = () => {
		const url = `${window.location.origin}/${bucket.creator.uid}/buckets?bucketid=${bucket.id}`;
		navigator.clipboard.writeText(url);
	};

	return (
		<div className="bg-[#FCFCFC] px-5 py-7 pb-28 sm:pb-7 h-full overflow-y-auto">
			<div>
				<div className="flex items-center justify-between mb-10">
					<Typography variant="h3" className="flex items-center gap-2">
						<Icon icon="fluent:info-28-filled"></Icon>
						Info
					</Typography>
					{typeof onClose === 'function' && (
						<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={onClose}>
							<Icon icon="mingcute:close-fill" className="text-2xl" />
						</Button>
					)}
				</div>
				<div>
					<Button
						variant="outline"
						className="text-primary rounded-md"
						iconBegin={<Icon icon="ic:round-link" className="text-2xl" />}
						onClick={copyLink}
					>
						Copy link
					</Button>
				</div>
				<Typography className="text-lg font-bold !mt-5">Your Bucket Details</Typography>
				<div className="mt-5">
					<Typography className="font-bold">Title</Typography>
					<Typography className="!mt-0">{bucket.title || bucket.name}</Typography>
				</div>
				<div className="mt-9">
					<Typography className="font-bold">Created</Typography>
					<Typography className="!mt-0">{new Date(bucket.createdAt).toLocaleDateString('en-En', dateOpts)}</Typography>
				</div>
				<div className="mt-9">
					<Typography className="font-bold">Bucket Type</Typography>
					{canEdit ? (
						<div className="flex items-center gap-1">
							<div className="w-[130px]">
								<Select value={isPrivate} onValueChange={setIsPrivate}>
									<SelectTrigger className="bg-white">
										<div className="truncate">
											<SelectValue placeholder="Select bucket type" />
										</div>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="false">Public</SelectItem>
										<SelectItem value="true">Private</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{bucket.private.toString() !== isPrivate && <Button onClick={saveBucketType}>Save</Button>}
						</div>
					) : (
						<Typography className="!mt-0">{bucket.private ? 'Private' : 'Public'}</Typography>
					)}
				</div>
				<div className="mt-9">
					<Typography className="font-bold">Owner</Typography>
					<div className="flex items-center gap-2">
						<div className="w-[40px] h-[40px]">
							<Image src={bucket.creator?.photoURL} className="rounded-full object-cover aspect-square w-48" />
						</div>
						<Typography className="!mt-0">
							{bucket.creator.name} {isUserProfile && '(you)'}
						</Typography>
					</div>
				</div>
				{(!!bucket.contributors.length || canEdit) && (
					<div className="mt-9">
						<Typography className="font-bold">Collaborators</Typography>
						{!!bucket.contributors.length && (
							<>
								<div className="flex flex-wrap gap-1 my-1">
									{bucket.contributors.slice(0, 5).map((item) => (
										<div
											key={item.id}
											className={`flex items-center gap-1 cursor-pointer text-sm bg-accent rounded-full border h-[24px] pl-2 ${
												canEdit ? '' : 'pr-2'
											}`}
											onClick={() => openContributor(item.user)}
										>
											<Typography className="!leading-none">{item.user.name}</Typography>
											{canEdit && (
												<Button
													variant="ghost"
													className="w-[24px] h-[24px] p-1"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														setConfirmDelete(item);
													}}
												>
													<Icon icon="mingcute:close-fill" className="text-sm" />
												</Button>
											)}
										</div>
									))}
								</div>
								<div className="flex flex-wrap gap-1">
									{bucket.contributors.slice(0, 5).map((item) => (
										<div key={item.id} className="w-[30px] h-[30px]" onClick={() => openContributor(item.user)}>
											<Image src={item.user?.photoURL} className="rounded-full object-cover aspect-square w-48" />
										</div>
									))}
								</div>
							</>
						)}
						{bucket.contributors.length - 5 > 0 && (
							<Typography className="!mt-1">{bucket.contributors.length - 5}+ others</Typography>
						)}
						{canEdit && (
							<Button
								variant="outline"
								className="text-primary rounded-md mt-2"
								iconBegin={<Icon icon="mdi:user-plus-outline" className="text-2xl" />}
								onClick={() => setShareModalOpen(true)}
							>
								Add user
							</Button>
						)}
					</div>
				)}
			</div>
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete access for ${confirmDelete?.user?.name}?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={removeContributor}
			/>
			{shareModalOpen && (
				<ShareModal
					open={shareModalOpen}
					bucket={bucket}
					onClose={() => setShareModalOpen(false)}
					saveBucketSettings={updateBucketSettings}
				/>
			)}
		</div>
	);
};

export default BucketInfo;
