import { Icon } from '@iconify/react';
import React from 'react';
import { Button } from '@/chadcn/Button';

export function VideoUploadButton({ onUpload, disabled }) {
	const inputRef = React.useRef();

	const handleFileChange = (e) => {
		const { files } = e.target;

		for (const file of files) {
			const extension = '.' + file.name.split('.').at(-1).toLowerCase();
			const accept = ['.mp4', '.insv', '.mov', '.webm', '.avi', '.ogg', '.mkv', '.mpg', '.mpeg', '.3gp'];

			if (!accept.includes(extension)) return alert(`Not supported format: ${extension}`);
		}

		if (files.length) onUpload(files);
	};

	return (
		<div>
			<input
				multiple
				type="file"
				accept=".mp4, .insv, .mov, .webm, .avi, .ogg, .mkv, .mpg, .mpeg, .3gp"
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
