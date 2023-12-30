import React from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/providers/Authentication.jsx';
import { useQuery } from '@tanstack/react-query';
import { createUser as handleCreateUser, getUser } from '@/hooks/api/users.js';

export const useProfile = () => {
	const { id } = useParams();
	const { user, ...auth } = useAuth();

	const enabled = id && id != 'profile';

	const { data: profile, ...rest } = useQuery({
		gcTime: Infinity,
		queryKey: ['Profile', id],
		queryFn: () => (enabled ? getUser(id) : null)
	});

	return { ...rest, data: profile, isUserProfile: user?.uid === id };
};
