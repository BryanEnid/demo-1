import React from 'react';

import { useCollection } from '@/hooks/useCollection';
import { useProfile } from './useProfile';
import { useAuth } from '@/providers/Authentication.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

const collectionName = 'Buckets';

export const useBuckets = (owner) => {
	// Hooks
	const { data: profile, user } = useProfile();
	// const { user } = useAuth();
	const { ...auth } = useAuth();
	const queryClient = useQueryClient();

	// const content = owner === 'user' ? [user?.uid] : [profile?.uid];
	// const enabled = !!user?.uid || !!profile?.uid;

	// const {
	// 	data: buckets,
	// 	createDocument,
	// 	deleteDocument
	// } = useCollection('buckets', {
	// 	keys: [...content],
	// 	query: ['where', 'creatorId', '==', content[0]],
	// 	enabled
	// });

	const { data } = useQuery({
		gcTime: Infinity,
		queryKey: [collectionName, owner],
		queryFn: async () => {}
	});

	const createDocument = useMutation({
		mutationFn: ({ data, documentId }) => {}
		// onSuccess: () => {
		// 	// Invalidate and refetch
		// 	queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		// }
	});

	const deleteDocument = useMutation({
		mutationFn: ({ data, documentId }) => {}
		// onSuccess: () => {
		// 	// Invalidate and refetch
		// 	queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		// }
	});

	return { buckets: data, createDocument: createDocument.mutate, deleteDocument: deleteDocument.mutate };
};
