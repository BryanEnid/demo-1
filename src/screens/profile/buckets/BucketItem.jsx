import React from 'react';
import { Icon } from '@iconify/react';
import { Typography } from '@/chadcn/Typography';
import { PreviewBucket } from '@/components/PreviewBucket';

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

	const handleExit = () => {
		setOpen(false);
	};

	return (
		<>
			<div className="flex flex-col items-center">
				<button
					onClick={onClick ? () => onClick(data) : () => setOpen(true)}
					className={`${width} transition ease-in-out hover:scale-110`}
				>
					<div className="object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full transition ease-in-out hover:shadow-md hover:shadow-primary">
						{preview && (
							<video
								type="video/mp4"
								autoPlay
								muted
								loop
								src={preview}
								// crossOrigin="use-credentials"
								className="object-cover aspect-square rounded-full w-full h-full"
							/>
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
