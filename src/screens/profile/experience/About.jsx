import { Textarea } from '@/chadcn/Textarea';
import { Typography } from '@/chadcn/Typography';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import React from 'react';
import { useExperience } from './useExperience';
import { Button } from '@/chadcn/Button';

export const AboutSection = ({ data }) => {
	// Hooks
	const { isUserProfile, data: profile } = useProfile();
	const { updateProfile } = useExperience();

	// State
	const [value, setValue] = React.useState();
	const [show, setShow] = React.useState(false);
	const [initialData, setInitialData] = React.useState();
	const [editMode, setEditMode] = React.useState(Boolean(!data));
	const [rows, setRows] = React.useState(4);

	// Refs
	const textAreaRef = React.useRef();

	React.useEffect(() => {
		if (data) {
			setValue(data);
			setShow(Boolean(data.length));
			setInitialData(data); // Save initial data

			// Set the new height based on the scrollHeight
			adjustTextareaHeight();
		}
	}, [data]);

	React.useEffect(() => {
		adjustTextareaHeight();
	}, [value]);

	React.useEffect(() => {
		if (textAreaRef.current) {
			if (!data) textAreaRef.current.focus();
		}
	}, [show]);

	const handleEditContent = () => {
		setShow(true);
		// textAreaRef.current.focus();
	};

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleSave = () => {
		const trimmedValue = value
			?.trim()
			?.replace(/ {2,}/g, ' ')
			?.replace(/(\r?\n)+/g, '\n\n');

		if (trimmedValue !== initialData) {
			const body = { value: trimmedValue };
			updateProfile({ body, id: profile.uid, section: 'about' });
			setInitialData(trimmedValue); // Update initial data
		}

		if (!trimmedValue?.length) setShow(false);
		setValue(trimmedValue);
		setEditMode(false);
	};

	const handleValueChange = ({ target }) => {
		setValue(target.value);
	};

	const adjustTextareaHeight = () => {
		if (textAreaRef.current) {
			const { scrollHeight, rows } = textAreaRef.current;
			textAreaRef.current.style.height = 'auto';
			textAreaRef.current.style.height = `${scrollHeight + 2}px`;

			// Update the number of rows based on the content
			const newRows = textAreaRef.current.value.split('\n').length;
			setRows(newRows > 4 ? newRows : 4);
		}
	};

	if (!isUserProfile && !value) return;

	return (
		<div>
			<Typography variant="h2" className="mb-5">
				About
			</Typography>

			{/* TODO: Handle empty state */}
			{isUserProfile && (
				<Textarea
					className={cn(
						!editMode && 'resize-none cursor-pointer overflow-hidden ',
						!show && 'hidden',
						editMode && 'min-h-[172px]'
					)}
					rows={rows}
					ref={textAreaRef}
					onBlur={handleSave}
					onClick={handleEdit}
					onChange={handleValueChange}
					value={value}
					suppressStyles={!editMode}
				/>
			)}

			{!isUserProfile && <Typography className="whitespace-pre-line">{value}</Typography>}

			{!show && (
				<div className="rounded-xl p-10 border-dashed border-2 border-primary flex flex-col text-center text-slate-500">
					Discover more about me! Let others know who you are, what you're passionate about, and what makes you unique.
					The world is eager to learn more about you!
					<Button variant="link" onClick={handleEditContent}>
						🌐 Click on this section to share a brief bio or tell your story.
					</Button>
				</div>
			)}
		</div>
	);
};
