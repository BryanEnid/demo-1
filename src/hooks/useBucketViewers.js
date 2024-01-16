import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/providers/Authentication.jsx';
import { getBucketViewers as handleGetBucketViewers } from '@/hooks/api/buckets.js';

const COLLECTION_NAME = 'Buckets';

export const useBucketViewers = (bucketId) => {
	const { user, ...auth } = useAuth();

	const { data, isLoading } = useQuery({
		gcTime: Infinity,
		queryKey: [COLLECTION_NAME, bucketId],
		queryFn: async () => (bucketId ? handleGetBucketViewers(auth, bucketId) : null),
		enabled: Boolean(bucketId)
	});

	return {
		data,
		isLoading
	};
};
