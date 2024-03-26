import { Typography } from '@/chadcn/Typography';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ObserveIcon } from '@/components/ObserveIcon';
import { useProfile } from '@/hooks/useProfile';
import { Icon } from '@iconify/react';
import React from 'react';
import { useExperience } from '../useExperience';
import { Button } from '@/chadcn/Button';
import { FileUploadButton } from '@/components/FileUploadButton';
import { AttachmentModal, DeleteModal, PreviewFileModal } from './Modals';
import { AttachmentItem } from './AttachmentItem';
import { DocumentIcon } from '@/components/DocumentIcon';

// TODO: Make .doc, .docx, and .txt work

export const AttachmentsSection = ({ data }) => {
	// Hooks
	const { isUserProfile } = useProfile();
	const { deleteFile } = useExperience();

	// State
	const [show, setShow] = React.useState(false);
	const [fileToDelete, setFileToDelete] = React.useState(false);
	const [fileLoaded, setFileLoaded] = React.useState(false);

	const handleDeleteFile = (id) => {
		deleteFile({ id });
		setFileToDelete(null);
	};

	return (
		<>
			<div>
				<div>
					<div className="flex flex-row items-center mb-5 gap-2">
						<Typography variant="h2">Attachments</Typography>

						{isUserProfile && (
							<button onClick={() => setShow(true)}>
								<Icon icon="gravity-ui:plus" fontSize={30} className="mb-1 p-2" />
							</button>
						)}
					</div>
				</div>

				{!data?.length && isUserProfile && (
					<div className="rounded-xl p-10 border-dashed border-2 border-primary flex flex-col text-center text-slate-500">
						Customize your profile by listing the talents and expertise that define you. A modal will pop up, allowing
						you to effortlessly manage and showcase your skills. Let your strengths shine!
						<Button variant="link" onClick={() => setShow(true)}>
							🌟 Click on this link to add your skills.
						</Button>
					</div>
				)}

				{data && (
					<div className="grid grid-cols-5 gap-9">
						{data.map((file) => (
							<AttachmentItem
								file={file}
								onClick={() => setFileLoaded(file.fileUrl)}
								previewUrl={file.previewUrl}
								key={file.id}
								onDelete={setFileToDelete}
							/>
						))}

						{false && (
							<div className="flex flex-col justify-center items-center gap-4 h-full w-full object-cover border rounded-lg transition-all hover:scale-105 cursor-pointer">
								<ObserveIcon size={80} rounded />

								<Typography variant="large" className="text-primary">
									Observe Export
								</Typography>
							</div>
						)}
					</div>
				)}
			</div>

			{/* ! Overlays */}
			<DeleteModal
				show={Boolean(fileToDelete)}
				file={fileToDelete}
				onClose={() => setFileToDelete(null)}
				onConfirm={handleDeleteFile}
			/>

			<PreviewFileModal
				show={Boolean(fileLoaded)}
				fileUrl={fileLoaded}
				onClose={() => {
					setFileLoaded(null);
				}}
			/>

			<AttachmentModal show={show} onConfirm={() => setShow(false)} onCancel={() => setShow(false)} />
		</>
	);
};
