import React from 'react';

import { useBucketViewers } from '@/hooks/useBucketViewers.js';
import { Spinner } from '@/components/Spinner.jsx';
import { Typography } from '@/chadcn/Typography.jsx';

const Views = ({ bucketId }) => {
	const { data, isLoading } = useBucketViewers(bucketId);

	return (
		<div className="flex flex-row flex-wrap gap-10 px-10 py-10 outline-none">
			{isLoading && (
				<div className="flex justify-center w-full">
					<Spinner size={36} />
				</div>
			)}
			{!isLoading &&
				data.map((user) => (
					<div key={user.id} className="flex items-center gap-2">
						<div className="w-[46px] h-[46px]">
							<img src={user.photoURL} className="rounded-full object-cover" crossOrigin="anonymous" />
						</div>
						<div>
							<Typography className="font-bold leading-none">{user.name}</Typography>
							<Typography className="!mt-2 text-sm leading-none ">{user.email}</Typography>
						</div>
					</div>
				))}
		</div>
	);
};

export default Views;
