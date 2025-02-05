import { useProfile } from './useProfile';
import { useAuth } from '@/providers/Authentication.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
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

const COLLECTION_NAME = 'Buckets';

export const useBuckets = (owner, isOrganization) => {
	// Hooks
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, owner?.id, auth.authToken];

	const { data } = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: async () =>
			handleGetBuckets(auth, {
				ownerId: owner.id,
				...(typeof isOrganization === 'boolean' && { isOrganization })
			}),
		enabled: Boolean(owner?.id)
	});

	const createBucket = useMutation({
		mutationFn: async ({ data }) => handleCreateBucket(auth, data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const updateBucket = useMutation({
		mutationFn: ({ data: body, documentId: id }) => handleUpdateBucket(auth, { body, id }),
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
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

	// TODO: Optimistic updates
	const updateBucketsCategory = useMutation({
		mutationFn: ({ data: body, category, ownerId, isOrganization }) =>
			handleUpdateBucketsCategory(auth, {
				body,
				category,
				params: isOrganization ? { organizationId: ownerId } : { profileId: ownerId }
			}),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const deleteBucketsCategory = useMutation({
		mutationFn: ({ category, withBuckets, ownerId, isOrganization }) =>
			handleDeleteBucketsCategory(auth, category, {
				withBuckets,
				...(isOrganization ? { organizationId: ownerId } : { profileId: ownerId })
			}),
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
		createBucket: createBucket.mutate,
		deleteBucket: deleteBucket.mutate,
		updateBucket: updateBucket.mutate,
		markBucketViewed: markBucketViewed.mutate,
		uploadVideo: uploadVideo.mutate,
		saveVideoURLs: saveVideoURLs.mutate,
		updateBucketsCategory: updateBucketsCategory.mutate,
		deleteBucketsCategory: deleteBucketsCategory.mutate,
		createBucketPrice: createBucketPrice.mutate,
		updateBucketPrice: updateBucketPrice.mutate
	};
};
