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
import { useMobile } from '@/hooks/useMobile';

export const BucketItem = ({
	name,
	preview,
	data,
	documentId,
	onClick,
	width = 'size-[200px]',
	iconProps,
	defaultIcon = 'solar:gallery-circle-broken',
	isUserProfile,
	defaultContextMenu,
	updateBucket,
	deleteBucket,
	showBucketInfo,
	className
}) => {
	// Hooks
	const [searchParams, setSearchParams] = useSearchParams();
	const { isMobile } = useMobile();

	// State
	const [open, setOpen] = useState(false);
	const [contextMenu, setContextMenu] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	const wrapperElRef = useRef();

	React.useEffect(() => {
		if (searchParams.get('bucketid') === documentId && open === false) {
			setOpen(true);
		}
		// if (searchParams)
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
			<div ref={wrapperElRef} className={cn('flex flex-col  items-center relative select-none', className)}>
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
									/>
								)}

								{handleSrc(preview) && isYouTubeUrl(preview) && (
									<img
										draggable={false}
										src={handleSrc(preview)}
										className="aspect-video object-cover rounded-full w-full h-full"
									/>
								)}

								{!preview && (
									<div className="flex h-full w-full justify-center items-center text-gray-300 p-3">
										<Icon fontSize="130" icon={defaultIcon} {...iconProps} />
									</div>
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
