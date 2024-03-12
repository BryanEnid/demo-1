import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { cn, isYouTubeUrl } from '@/lib/utils';
import PreviewBucket from '@/components/PreviewBucket';
import ShareModal from '@/components/ShareModal.jsx';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';
import { Typography } from '@/chadcn/Typography';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger
} from '@/chadcn/ContextMenu';
import { Image } from '@/components/Image';
import { useBucket } from '@/hooks/useBucket';

export const BucketItem = ({
	name,
	preview,
	documentId,
	onClick,
	width = 'size-[200px]',
	isUserProfile,
	updateBucket,
	deleteBucket,
	showBucketInfo,
	className
}) => {
	// Hooks
	const [searchParams, setSearchParams] = useSearchParams();

	const { data, refetch } = useBucket(documentId);

	// State
	const [open, setOpen] = useState(false);
	const [contextMenu, setContextMenu] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	const wrapperElRef = useRef();

	// Watch for videos still uploading
	React.useEffect(() => {
		if (data) {
			const found = data?.videos?.find(({ process }) => process?.status === 'UPLOADING');
			if (found) {
				const instance = setInterval(refetch, [5000]);
				const clear = () => clearInterval(instance);
				return clear;
			}
		}
	}, [data]);

	React.useEffect(() => {
		if (searchParams.get('bucketid') === documentId && open === false) {
			setOpen(true);
		}
	}, [searchParams]);

	const updateBucketSettings = ({ contributors, isPrivate }) => {
		updateBucket(
			{ data: { ...data, contributors, private: isPrivate }, documentId: data.id },
			{
				onSuccess: () => setShareModalOpen(false)
			}
		);
	};

	const handleExit = () => {
		setOpen(false);
		setSearchParams('');
	};

	const handleOnClick = (openedThroughContextMenu) => {
		if (openedThroughContextMenu) return;

		setSearchParams('bucketid=' + documentId);
		setOpen(true);
		onClick && onClick(data);
	};

	const handleSrc = (src) => {
		if (isYouTubeUrl(src)) return data.videos[0].image;

		return src;
	};

	const openNewWindow = () => {
		window.open(
			`${window.location.href}?bucketid=${documentId}`,
			'_blank',
			`popup=1, fullscreen=1, menubar=1, status=1, toolbar=1, menubar=1, noopener noreferrer, width=${window.screen.width}, height=${window.screen.height}`
		);
	};

	return (
		<>
			<div ref={wrapperElRef} className={cn('flex flex-col items-center relative select-none', className)}>
				<button
					onClick={() => handleOnClick(contextMenu)}
					className={`${width} transition ease-in-out hover:scale-105 select-none`}
				>
					<ContextMenu open={!!contextMenu} onOpenChange={setContextMenu}>
						<ContextMenuTrigger>
							<div
								className={`${width} flex object-cover aspect-square shadow drop-shadow-xl rounded-full p-1 bg-white transition ease-in-out hover:shadow-md hover:shadow-primary justify-center items-center`}
							>
								{preview && !isYouTubeUrl(preview) && (
									<video
										type="video/mp4"
										autoPlay
										muted
										loop
										draggable={false}
										src={handleSrc(preview)}
										className="object-cover aspect-square rounded-full w-full h-full"
										crossOrigin="anonymous"
									/>
								)}

								{handleSrc(preview) && isYouTubeUrl(preview) && (
									<Image
										draggable={false}
										proxyEnabled
										src={handleSrc(preview)}
										className="aspect-square object-cover rounded-full w-full h-full"
									/>
								)}

								<ContextMenuContent>
									<ContextMenuItem className="text-md">
										<a
											href={`${window.location.href}?bucketid=${documentId}`}
											target="_blank"
											rel="noreferrer"
											className="w-full px-2 py-1.5"
										>
											Open in New Tab
										</a>
									</ContextMenuItem>
									<ContextMenuItem className="text-md">Open in New Window</ContextMenuItem>

									<ContextMenuSeparator />

									{isUserProfile && (
										<ContextMenuItem className="text-md" onClick={() => setShareModalOpen(true)}>
											<Icon icon="mdi:user-plus-outline" className="pr-1 text-2xl" />
											Share
										</ContextMenuItem>
									)}
									<ContextMenuItem className="text-md" onClick={() => showBucketInfo(data)}>
										<Icon icon="ci:info" className="pr-1 text-2xl" />
										Info
									</ContextMenuItem>

									{isUserProfile && (
										<ContextMenuItem
											className="text-md text-destructive focus:text-destructive"
											onClick={() => setConfirmDelete(true)}
										>
											<Icon icon="mi:delete" className="pr-1 text-2xl" />
											Delete
										</ContextMenuItem>
									)}
								</ContextMenuContent>
							</div>
						</ContextMenuTrigger>
					</ContextMenu>
				</button>

				{name && <Typography className="text-center">{name}</Typography>}
			</div>

			<ConfirmDialog
				show={confirmDelete}
				title={`Are you sure you want to delete this bucket: ${name}?`}
				subTitle={`This bucket ${name} includes ${data?.videos?.length} videos`}
				submitLabel="Delete"
				submitBtnVariant="destructive"
				onClose={() => setConfirmDelete(false)}
				onCancel={() => setConfirmDelete(false)}
				onConfirm={() => deleteBucket({ documentId })}
			>
				{null}
			</ConfirmDialog>

			{data && shareModalOpen && (
				<ShareModal
					open={shareModalOpen}
					bucket={data}
					onClose={() => setShareModalOpen(false)}
					saveBucketSettings={updateBucketSettings}
				/>
			)}

			{!onClick && <PreviewBucket show={open} onClose={handleExit} data={data} documentId={documentId} />}
		</>
	);
};
