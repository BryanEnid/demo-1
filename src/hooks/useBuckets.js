import { useProfile } from './useProfile';
import { useAuth } from '@/providers/Authentication.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createBucket as handleCreateBucket,
	getBucket as handleGetBucket,
	getBuckets as handleGetBuckets,
	updateBucket as handleUpdateBucket,
	deleteBucket as handleDeleteBucket,
	uploadVideo as handleUploadVideo
} from './api/buckets';

const COLLECTION_NAME = 'Buckets';

export const useBuckets = (owner) => {
	// Hooks
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const { data } = useQuery({
		gcTime: Infinity,
		queryKey: [COLLECTION_NAME, owner?.uid],
		queryFn: async () => handleGetBuckets(auth, owner.uid),
		enabled: Boolean(owner?.uid)
	});

	const createBucket = useMutation({
		mutationFn: async ({ data }) => handleCreateBucket(auth, data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME, owner?.uid] });
		}
	});

	const updateBucket = useMutation({
		mutationFn: ({ data: body, documentId: id }) => handleUpdateBucket(auth, { body, id }),
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME, owner?.uid] });
		}
	});

	const deleteBucket = useMutation({
		mutationFn: ({ documentId }) => handleDeleteBucket(auth, documentId),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME, owner?.uid] });
		}
	});

	const uploadVideo = useMutation({
		mutationFn: ({ id, data }) => {
			const body = new FormData();
			body.append('video', data.video);
			body.append('image', data.image);
			return handleUploadVideo(auth, id, body);
		},
		onMutate: ({ onLoading }) => {
			onLoading && onLoading(); // This is a callback that fires when onMutate fires
		},
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME, owner?.uid] });
		}
	});

	return {
		data,
		createBucket: createBucket.mutate,
		deleteBucket: deleteBucket.mutate,
		updateBucket: updateBucket.mutate,
		uploadVideo: uploadVideo.mutate

		// uploadFile: createBucket.mutate,
		// uploadResumableFile: createBucket.mutate,
		// appendVideo: createBucket.mutate
	};
};
