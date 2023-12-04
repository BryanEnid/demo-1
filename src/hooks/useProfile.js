import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCollection } from '@/hooks/useCollection';
import { useUser } from './useUser';

export const useProfile = () => {
	// Hooks
	const { pathname } = useLocation();
	const { user } = useUser();

	const data = useCollection('users', {
		keys: [pathname.slice(1).split('/')[0]],
		query: ['where', 'username', '==', pathname.slice(1).split('/')[0]],
		select: (item) => item[0],
		enabled: !!pathname.slice(1).split('/')[0]
	});

	return { ...data, isUserProfile: user?.uid === data.data?.uid };
};
