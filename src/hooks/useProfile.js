import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAuth } from '@/providers/Authentication.jsx';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/hooks/api/users.js';
import useOrganizations from '@/hooks/useOrganizations.js';

export const useProfile = () => {
	const { id } = useParams();
	const { pathname } = useLocation();
	const { user, ...auth } = useAuth();

	const isOrganization = pathname.includes('/organizations');

	const { selected, isLoading: isOrgLoading } = useOrganizations(isOrganization ? { id } : undefined);

	const enabled = id && id != 'profile' && !isOrganization;
	const {
		data: profile,
		isLoading: userProfileLoading,
		...rest
	} = useQuery({
		gcTime: Infinity,
		queryKey: ['Profile', id],
		queryFn: () => (enabled ? getUser(id) : null)
	});

	return {
		...rest,
		isLoading: userProfileLoading || isOrgLoading,
		data: isOrganization ? selected : profile,
		isOrganization,
		isUserProfile: isOrganization ? selected?.creatorId === user?.id : user?.uid === id
	};
};
