import React from 'react';
import { Icon } from '@iconify/react';
import { Typography } from '@/chadcn/Typography';
import PreviewBucket from '@/components/PreviewBucket';
import { useSearchParams } from 'react-router-dom';
import { isYouTubeUrl } from '@/lib/utils';

export const BucketItem = ({
	name,
	preview,
	data,
	documentId,
	onClick,
	width = 'w-[200px]',
	iconProps,
	defaultIcon = 'solar:gallery-circle-broken'
}) => {
	// State
	const [open, setOpen] = React.useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	React.useEffect(() => {
		if (searchParams.get('bucketid') === documentId && open === false) {
			setOpen(true);
		}
		// if (searchParams)
	}, [searchParams]);

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

	return (
		<>
			<div className="flex flex-col items-center">
				<button
					onClick={onClick ? () => onClick(data) : handleOpenPreview}
					className={`${width} transition ease-in-out hover:scale-110`}
				>
					<div className="flex object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full transition ease-in-out hover:shadow-md hover:shadow-primary justify-center items-center">
						{preview && !isYouTubeUrl(preview) && (
							<video
								type="video/mp4"
								autoPlay
								muted
								loop
								src={handleSrc(preview)}
								// crossOrigin="anonymous"
								className="object-cover aspect-square rounded-full w-full h-full"
							/>
						)}

						{handleSrc(preview) && (
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
			</div>

			{!onClick && <PreviewBucket show={open} onClose={handleExit} data={data} documentId={documentId} />}
		</>
	);
};
