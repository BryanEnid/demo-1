import { Icon } from '@iconify/react';
import React from 'react';
import { Button } from '@/chadcn/Button';

export function VideoUploadButton({ onUpload, disabled }) {
	const inputRef = React.useRef();

	const handleFileChange = (e) => {
		const { files } = e.target;

		if (files.length) onUpload(files);
	};

	return (
		<div>
			<input
				multiple
				type="file"
				accept="video/*"
				onChange={handleFileChange}
				style={{ display: 'none' }}
				ref={inputRef}
			/>
			<Button
				disabled={disabled}
				iconBegin={<Icon icon="ic:round-upload" />}
				variant="secondary"
				onClick={() => inputRef.current.click()}
			>
				Upload
			</Button>
		</div>
	);
}
