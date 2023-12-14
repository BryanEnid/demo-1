import React from 'react';

import { useCollection } from '@/hooks/useCollection';
import { useProfile } from './useProfile';
import { useUser } from './useUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticationProviders } from './useAuthenticationProviders';

const DOMAIN_NAME = import.meta.env.VITE_HTTP_BASE_URL;
const collectionName = 'Buckets';

export const useBuckets = (owner) => {
	// Hooks
	// const { data: profile } = useProfile();
	// const { user } = useUser();
	const { user, isLoading } = useAuthenticationProviders();
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

	const { data, error } = useQuery({
		queryKey: [collectionName],
		queryFn: async () => {
			const url = new URL('/api/buckets', DOMAIN_NAME);
			const res = await fetch(url, {
				method: 'GET',
				headers: { Authorization: 'Bearer ' + user.stsTokenManager.accessToken }
			});
			return res.json();
		},
		enabled: !isLoading
	});

	const createDocument = useMutation({
		mutationFn: ({ data, documentId }) => {},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		}
	});

	const deleteDocument = useMutation({
		mutationFn: ({ data, documentId }) => {},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		}
	});

	return { buckets: data, createDocument: createDocument.mutate, deleteDocument: deleteDocument.mutate };
};
