import { useAuth } from '@/providers/Authentication.jsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createBucket as handleCreateBucket,
	getBucket as handleGetBucket,
	getBuckets as handleGetBuckets,
	updateBucket as handleUpdateBucket,
	markBucketViewed as handleMarkBucketViewed,
	deleteBucket as handleDeleteBucket,
	uploadVideo as handleUploadVideo,
	uploadVideoURLs as handleUploadVideoURLs,
	updateBucketsCategory as handleUpdateBucketsCategory,
	deleteBucketsCategory as handleDeleteBucketsCategory,
	createBucketPrice as handleCreateBucketPrice,
	updateBucketPrice as handleUpdateBucketPrice
} from './api/buckets';

const COLLECTION_NAME = 'Bucket';

export const useBucket = (bucketId, { owner, isOrganization } = {}) => {
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, bucketId];

	const { data, refetch, isLoading } = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: async () => (bucketId ? handleGetBucket(auth, bucketId) : null),
		enabled: Boolean(bucketId)
	});

	const createBucket = useMutation({
		mutationFn: async ({ data }) => handleCreateBucket(auth, data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey: ['Buckets'] });
		}
	});

	const updateBucket = useMutation({
		mutationFn: ({ data: body, documentId: id }) => handleUpdateBucket(auth, { body, id }),
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey: ['Buckets'] });
		}
	});

	const markBucketViewed = useMutation({
		mutationFn: ({ id }) => handleMarkBucketViewed(auth, id),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const deleteBucket = useMutation({
		mutationFn: ({ documentId }) => handleDeleteBucket(auth, documentId),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const uploadVideo = useMutation({
		mutationFn: ({ id, data }) => {
			const body = new FormData();
			body.append('video', data.video);
			body.append('image', data.image);
			body.append('videoType', data.videoType);
			return handleUploadVideo(auth, id, body);
		},
		onMutate: ({ onLoading }) => {
			onLoading && onLoading(); // This is a callback that fires when onMutate fires
		},
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const saveVideoURLs = useMutation({
		mutationFn: ({ id, data }) => handleUploadVideoURLs(auth, id, data),
		onMutate: ({ onLoading }) => {
			onLoading && onLoading(); // This is a callback that fires when onMutate fires
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const createBucketPrice = useMutation({
		mutationFn: async ({ data, bucketId }) => handleCreateBucketPrice(auth, bucketId, data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const updateBucketPrice = useMutation({
		mutationFn: async ({ data, bucketId }) => handleUpdateBucketPrice(auth, bucketId, data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	return {
		data,
		refetch,
		isLoading,
		updateBucket: updateBucket.mutate,
		createBucket: createBucket.mutate,
		uploadVideo: uploadVideo.mutate
	};
};
