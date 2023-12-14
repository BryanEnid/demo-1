import React from 'react';

import { useCollection } from '@/hooks/useCollection';
import { useProfile } from './useProfile';
import { useAuth } from '@/providers/Authentication.jsx';

export const useBuckets = (owner) => {
	// Hooks
	const { data: profile } = useProfile();
	const { user } = useAuth();

	const content = owner === 'user' ? [user?.uid] : [profile?.uid];
	const enabled = !!user?.uid || !!profile?.uid;

	const {
		data: buckets,
		createDocument,
		deleteDocument
	} = useCollection('buckets', {
		keys: [...content],
		query: ['where', 'creatorId', '==', content[0]],
		enabled
	});

	return { buckets, createDocument, deleteDocument };
};
