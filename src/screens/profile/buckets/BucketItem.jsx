import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { cn, isYouTubeUrl } from '@/lib/utils';
import PreviewBucket from '@/components/PreviewBucket';
import ShareModal from '@/components/ShareModal.jsx';
import { Typography } from '@/chadcn/Typography';
import {
	// DropdownMenu,
	// DropdownMenuTrigger,
	// DropdownMenuContent,
	// DropdownMenuItem,
	DropdownMenuGroup
	// DropdownMenuSeparator
} from '@/chadcn/DropDown.jsx';
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
	updateBucket,
	showBucketInfo,
	className
}) => {
	// Hooks
	const [searchParams, setSearchParams] = useSearchParams();
	const { isMobile } = useMobile();

	// State
	const [open, setOpen] = useState(false);
	const [contextMenu, setContextMenu] = useState(null);
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
									<ContextMenuItem className="text-md">Open in New Tab</ContextMenuItem>
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
								</ContextMenuContent>
							</div>
						</ContextMenuTrigger>
					</ContextMenu>
				</button>

				{name && <Typography className="text-center">{name}</Typography>}
			</div>

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
