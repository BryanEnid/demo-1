import React from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/providers/Authentication.jsx';
import { useUser } from './useUser';

export const useProfile = () => {
	const { id } = useParams();
	const { user, ...auth } = useAuth();
	const { user: profile, ...restData } = useUser(auth, id);

	return { ...restData, data: profile, isUserProfile: user?.uid === profile?.uid };
};
