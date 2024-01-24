import { Typography } from '@/chadcn/Typography';
import { ObserveIcon } from '@/components/ObserveIcon';
import React from 'react';

const example = [
	{
		id: '655b1c6ce664a8d355324cb8',
		fileUrl: 'https://....',
		previewUrl: 'https://designsystem.digital.gov/assets/img/templates/layout--docs.png',
		createdAt: '2023-11-21T10:47:55.753Z',
		updatedAt: '2023-11-21T10:47:55.753Z'
	},
	{
		id: '655b1c6ce664a8d355324cb5',
		fileUrl: 'https://....',
		previewUrl: 'https://images.examples.com/wp-content/uploads/2022/07/Electronic-Thesis.jpg',
		createdAt: '2023-11-21T10:47:55.753Z',
		updatedAt: '2023-11-21T10:47:55.753Z'
	}
];

export const AttachmentsSection = ({ data }) => {
	if (!data?.length) return <></>;

	return (
		<div>
			<Typography variant="h2" className="mb-5">
				Attachments
			</Typography>

			<div className="grid grid-cols-5 gap-9">
				{data.map(({ previewUrl, id }) => (
					<div key={id}>
						<img
							src={previewUrl}
							style={{ aspectRatio: 8 / 12 }}
							className="h-full w-full object-cover border rounded-lg transition-all hover:scale-105 cursor-pointer"
						/>
					</div>
				))}

				<div className="flex flex-col justify-center items-center gap-4 h-full w-full object-cover border rounded-lg transition-all hover:scale-105 cursor-pointer">
					<ObserveIcon size={80} rounded />

					<Typography variant="large" className="text-primary">
						Observe Export
					</Typography>
				</div>
			</div>
		</div>
	);
};
