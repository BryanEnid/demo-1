import { Typography } from '@/chadcn/Typography';
import { Image } from '@/components/Image';
import { useProfile } from '@/hooks/useProfile';
import { Icon } from '@iconify/react';
import React from 'react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger
} from '@/chadcn/ContextMenu';
import { DocumentIcon } from '@/components/DocumentIcon';

export const AttachmentItem = ({ previewUrl, onClick, file, onDelete }) => {
	const { isUserProfile } = useProfile();

	const previewURL = `https://docs.google.com/viewer?url=${file.fileUrl}&embedded=true`;

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className="relative hover:scale-105 transition-all cursor-pointer h-[250px] border rounded-lg flex justify-center items-center"
					onClick={onClick}
				>
					{previewUrl && (
						<Image src={previewUrl} style={{ aspectRatio: 8 / 12 }} className="h-full w-full object-cover " />
					)}

					{!previewUrl && <DocumentIcon extension={file.documentType} size={80} className="mb-14" />}

					<div className="absolute bottom-6 text-wrap w-full text-center break-words px-2">
						<Typography variant="small" className="">
							{file.fileName}
						</Typography>
					</div>
				</div>
			</ContextMenuTrigger>

			<ContextMenuContent>
				<ContextMenuItem className="text-md">
					<Typography>
						<a href={previewURL} target="_blank" rel="noreferrer">
							Open in New Tab
						</a>
					</Typography>
				</ContextMenuItem>

				<ContextMenuSeparator />

				{isUserProfile && (
					<ContextMenuItem className="text-md text-destructive focus:text-destructive" onClick={() => onDelete(file)}>
						<Icon icon="mi:delete" className="pr-1 text-2xl" />
						Delete
					</ContextMenuItem>
				)}
			</ContextMenuContent>
		</ContextMenu>
	);
};
