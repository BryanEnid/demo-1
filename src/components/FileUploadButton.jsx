import { Icon } from '@iconify/react';
import React from 'react';
import { Button } from '@/chadcn/Button';

export function FileUploadButton({ onUpload, disabled, accept }) {
	const inputRef = React.useRef();
	const [key, setKey] = React.useState(0);
	const filesMapRef = React.useRef(new Map());

	const handleFileChange = (e) => {
		const { files } = e.target;
		const filesMap = filesMapRef.current;

		for (const file of files) {
			const extension = '.' + file.name.split('.').pop().toLowerCase();
			if (!accept.includes(extension)) {
				alert(`Not supported format: ${extension}`);
				continue;
			}

			if (filesMap.has(file.name)) {
				renameDuplicateFile(file);
			} else {
				filesMap.set(file.name, file);
			}
		}

		onUpload([...filesMap.values()]);
		filesMap.clear();
		setKey(key + 1); // Force re-render to replace input element
	};

	const renameDuplicateFile = (file) => {
		const filesMap = filesMapRef.current;

		// Extract file name and extension
		const fileName = file.name.split('.').slice(0, -1).join('.');
		const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

		let count = 1;
		let newFileName = fileName + `(${count})` + fileExtension;

		// Generate a new unique name
		while (filesMap.has(newFileName)) {
			count++;
			newFileName = fileName + `(${count})` + fileExtension;
		}

		// Update filesMap with the new name
		filesMap.set(newFileName, file);
	};

	return (
		<div>
			<input
				key={key}
				multiple
				type="file"
				accept={accept.join(', ')}
				onInput={handleFileChange}
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
