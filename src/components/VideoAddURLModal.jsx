import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { extractYoutubeVideoId, isYouTubeUrl } from '@/lib/utils.js';
import { useToast } from '@/hooks/useToast.js';
import { getYouTubeVideoDetails } from '@/hooks/api/youtube.js';
import { PageModal } from '@/components/PageModal.jsx';
import { Typography } from '@/chadcn/Typography.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Button } from '@/chadcn/Button.jsx';

const VideoAddURLModal = ({ show, onClose }) => {
	// Hooks
	const { toast } = useToast();

	const [inputs, setInputs] = React.useState({
		0: { video: null, image: null, source: null, valid: false, type: 'url' }
	});

	const handleVideoAdded = async (url, index) => {
		if (isYouTubeUrl(url)) {
			// Extract video ID from the URL
			const videoId = extractYoutubeVideoId(url);

			const embedCode = videoId && (await getYouTubeVideoDetails(videoId));

			const body = { [index]: { ...embedCode, valid: !!embedCode, url } };

			setInputs((prev) => ({ ...prev, ...body }));

			if (!body[index].valid) return;

			const ToasterView = () => (
				<div className="flex flex-col gap-3 w-full">
					<img src={embedCode.thumbnail} className="w-full rounded-xl aspect-video object-cover" />

					<Typography variant="small" className="text-md font-extrabold leading-5 line-clamp-1">
						{embedCode?.title}
					</Typography>

					<Typography variant="small" className="text-sm font-extralight leading-5 line-clamp-3">
						{embedCode?.description}
					</Typography>

					<Typography variant="small" className="text-xs line-clamp-1">
						By {embedCode?.channelTitle}
					</Typography>
				</div>
			);

			toast({ customView: <ToasterView /> });

			return body;
		}

		// Default
		const { video, image } = inputs[index];
		if (video === null || image === null) return;

		const body = { [index]: { video: null, image: null } };
		setInputs((prev) => ({ ...prev, ...body }));
	};

	const handleAddNewItem = () => {
		const maxLength = 10;
		const currentLength = Object.values(inputs).length;
		if (currentLength >= maxLength) return;

		const newItem = { [currentLength]: { video: null, image: null } };
		setInputs((prev) => ({ ...prev, ...newItem }));
	};

	const handleDeleteItem = (propertyName) => {
		const byDifferentKey = ([key]) => key !== propertyName;
		const newState = Object.fromEntries(Object.entries(inputs).filter(byDifferentKey));
		setInputs(newState);
	};

	const handleClose = (inputs) => {
		setInputs({ 0: { video: null, image: null, source: null, valid: false, type: 'url' } });
		onClose(inputs);
	};

	const handleSaveDisabled = Object.values(inputs)
		.map(({ valid }) => valid)
		.every(Boolean);

	return (
		<PageModal show={show} width="600px" zIndex={30} onClose={() => onClose(inputs)}>
			<div className="flex flex-col justify-center items-center p-16 ">
				<div className="flex flex-col items-start gap-10 w-full min-h-[500px]">
					<Typography variant="h3">Add video urls</Typography>

					{Array.from(Object.keys(inputs)).map((key) => (
						<div key={key} className="flex flex-col w-full gap-2">
							<div key={key} className="flex flex-row items-center w-full gap-2">
								<div className="inline-flex items-center relative w-full h-full">
									<Input key={key} onChange={({ target }) => handleVideoAdded(target.value, key)} />
									{inputs[key].valid && (
										<div className="absolute right-1 p-1 rounded-full bg-white z-10">
											<Icon fontSize={20} icon="tabler:check" className="text-green-600 h-full" />
										</div>
									)}
								</div>

								<Icon fontSize={20} className="text-gray-500" icon="mi:delete" onClick={() => handleDeleteItem(key)} />
							</div>

							{inputs[key].title && (
								<Typography variant="small" className="text-sm font-bold leading-1 inline-flex">
									{inputs[key].title}
								</Typography>
							)}
						</div>
					))}

					<Button iconBegin={<Icon icon="ic:round-add" />} variant="default" onClick={handleAddNewItem}>
						Add new url
					</Button>
				</div>
				<div className="flex flex-row justify-end gap-2 w-full">
					<Button variant="secondary" onClick={() => handleClose()}>
						Cancel
					</Button>
					<Button
						variant="default"
						className="px-10"
						disabled={!handleSaveDisabled}
						onClick={() => handleClose(inputs)}
					>
						Save
					</Button>
				</div>
			</div>
		</PageModal>
	);
};

export default VideoAddURLModal;
