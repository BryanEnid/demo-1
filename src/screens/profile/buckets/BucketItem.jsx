import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { isYouTubeUrl } from '@/lib/utils';
import PreviewBucket from '@/components/PreviewBucket';
import ShareModal from '@/components/ShareModal.jsx';
import { Typography } from '@/chadcn/Typography';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuSeparator
} from '@/chadcn/DropDown.jsx';

export const BucketItem = ({
	name,
	preview,
	data,
	documentId,
	onClick,
	width = 'w-[200px]',
	iconProps,
	defaultIcon = 'solar:gallery-circle-broken',
	isUserProfile,
	updateBucket,
	showBucketInfo
}) => {
	// State
	const [open, setOpen] = useState(false);
	const [contextMenu, setContextMenu] = useState(null);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();

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

	const handleOpenPreview = () => {
		setSearchParams('bucketid=' + documentId);
		setOpen(true);
	};

	const handleSrc = (src) => {
		if (isYouTubeUrl(src)) return data.videos[0].image;

		return src;
	};

	const openContextMenu = (e) => {
		const wrapperPosition = wrapperElRef?.current?.getBoundingClientRect();
		const top = e.clientY - wrapperPosition.top;
		const left = e.clientX - wrapperPosition.left;

		e.preventDefault();
		setContextMenu({ open: true, y: top, x: left });
	};

	return (
		<>
			<div ref={wrapperElRef} className="flex flex-col items-center relative" onContextMenu={openContextMenu}>
				<button
					onClick={onClick ? () => onClick(data) : handleOpenPreview}
					className={`${width} transition ease-in-out hover:scale-105`}
				>
					<div className="flex object-cover aspect-square shadow drop-shadow-xl rounded-full transition ease-in-out hover:shadow-md hover:shadow-primary justify-center items-center">
						{preview && !isYouTubeUrl(preview) && (
							<video
								type="video/mp4"
								autoPlay
								muted
								loop
								src={handleSrc(preview)}
								className="object-cover aspect-square rounded-full w-full h-full"
							/>
						)}

						{handleSrc(preview) && isYouTubeUrl(preview) && (
							<img src={handleSrc(preview)} className="aspect-video object-cover rounded-full w-full h-full" />
						)}

						{!preview && (
							<div className="flex h-full w-full justify-center items-center text-gray-300">
								<Icon fontSize="130" icon={defaultIcon} {...iconProps} />
							</div>
						)}
					</div>
				</button>

				<Typography>{name}</Typography>
				<DropdownMenu open={!!contextMenu} onOpenChange={setContextMenu}>
					<DropdownMenuTrigger
						className={`absolute`}
						style={{ top: `${contextMenu?.y || 0}px`, left: `${contextMenu?.x || 0}px` }}
					/>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuItem className="text-md">Open in New Tab</DropdownMenuItem>
							<DropdownMenuItem className="text-md">Open in New Window</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{isUserProfile && (
								<DropdownMenuItem className="text-md" onClick={() => setShareModalOpen(true)}>
									<Icon icon="mdi:user-plus-outline" className="pr-1 text-2xl" />
									Share
								</DropdownMenuItem>
							)}
							<DropdownMenuItem className="text-md" onClick={() => showBucketInfo(data)}>
								<Icon icon="ci:info" className="pr-1 text-2xl" />
								Info
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
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
