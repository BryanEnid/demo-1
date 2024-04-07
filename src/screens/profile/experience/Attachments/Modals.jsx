import { Typography } from '@/chadcn/Typography';
import ConfirmDialog from '@/components/ConfirmDialog';
import { CredentiallessIFrame } from '@/components/CredentiallessIFrame';
import { DocumentIcon } from '@/components/DocumentIcon';
import { FileUploadButton } from '@/components/FileUploadButton';
import { PageModal } from '@/components/PageModal';
import { useProfile } from '@/hooks/useProfile';
import { Icon } from '@iconify/react';
import React from 'react';
import { useExperience } from '../useExperience';

export const PreviewFileModal = ({ show, onClose, fileUrl }) => {
	return (
		<PageModal show={show} width="100%" maxWidth="100vw" onClose={onClose}>
			<div className="relative flex justify-center items-center">
				<CredentiallessIFrame
					className="w-[90vw] h-[90vh]"
					src={fileUrl}
					// src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
				/>
			</div>
		</PageModal>
	);
};

export const DeleteModal = ({ show, file, onClose, onConfirm }) => {
	return (
		<ConfirmDialog
			show={show}
			title="Are you saure you want to delete this file?"
			submitBtnVariant="destructive"
			submitLabel="Delete"
			onCancel={onClose}
			onConfirm={() => onConfirm(file.id)}
		>
			<div className="flex flex-row items-center gap-2">
				<DocumentIcon size={30} extension={file?.documentType} />
				<Typography variant="small">{file?.fileName}</Typography>
			</div>
		</ConfirmDialog>
	);
};

export const AttachmentModal = ({ show, onConfirm, onCancel }) => {
	// Hooks

	const { isUserProfile, data: profile } = useProfile();
	const { updateProfile, deleteFile } = useExperience();

	// State
	const [isDragOver, setIsDragOver] = React.useState(false);
	const [files, setFiles] = React.useState([]);

	// Refs
	const validExtension = ['.pdf'];
	const dropZoneRef = React.useRef();

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

		// Check if the dropped file is one of the accepted formats
		for (const item of files) {
			const isInvalidFormat = !validExtension.includes('.' + item.name.split('.')[1].toLowerCase());
			if (isInvalidFormat) return alert(`Please drop a valid file. Valid extensions: ${validExtension.join(', ')}`);
		}

		setFiles((prev) => [...prev, ...files]);
	};

	const handleUploadFiles = async () => {
		// Upload files
		const body = new FormData();
		files.forEach((item) => body.append('documents', item, item.name));
		updateProfile({ body, section: 'attachments', id: profile.uid });

		// CB
		onConfirm();

		// Cleaning function
		setFiles([]);
	};

	const handleRemoveFile = (index) => {
		const filteredFiles = files.filter((_, itemIndex) => itemIndex !== index);
		setFiles(filteredFiles);
	};

	return (
		<ConfirmDialog
			show={show}
			title="Attachments"
			onConfirm={handleUploadFiles}
			onCancel={() => {
				onCancel();
				setFiles([]);
			}}
		>
			<div
				ref={dropZoneRef}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				style={{ transition: '0.5s' }}
				className={[
					'border-dashed border-2  rounded-lg p-4 m-6 transition relative overflow-hidden min-h-[200px] flex flex-col gap-2',
					isDragOver && 'bg-primary',
					!files.length && 'flex justify-center items-center'
				].join(' ')}
			>
				{files.map((file, index) => {
					return (
						<div key={index} className="flex flex-row items-center border rounded-sm py-2 px-3 gap-3 ">
							<DocumentIcon extension={file.type} size={50} />

							<Typography variant="p" className="flex-1 truncate">
								{file.name}
							</Typography>

							<Icon
								icon="gridicons:cross-circle"
								fontSize={25}
								color="#c42b2b"
								onClick={() => handleRemoveFile(index)}
							/>
						</div>
					);
				})}

				<div className="flex flex-row justify-center items-center rounded-sm py-5 px-3 gap-3 border-dashed border-2 ">
					<Typography variant="p" className="px-8">
						Drop your files here
					</Typography>

					<FileUploadButton accept={validExtension} onUpload={(files) => setFiles((prev) => [...prev, ...files])} />
				</div>
			</div>
		</ConfirmDialog>
	);
};
