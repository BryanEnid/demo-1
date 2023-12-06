import React from 'react';
import { useCollection } from './useCollection';
import { useAuthenticationProviders } from './useAuthenticationProviders';

export const useUser = () => {
	// Initialize Firebase Auth
	const { user, isLoading: providerLoading } = useAuthenticationProviders();

	const { data } = useCollection('users', {
		keys: [user?.uid],
		query: ['where', 'uid', '==', user?.uid],
		select: (item) => item[0],
		enabled: !!user?.uid
	});

	const isLoading = (() => {
		// if loading is false, has user, and not data -> it still loading -> TRUE
		// if loading is false, and not user, and data -> stop loading -> FALSE
		// if loading is false, has user, and data -> stop loading -> FALSE
		if (providerLoading && user && !data) return true;
		if (!providerLoading && !user && !data) return false;
		if (!providerLoading && user && data) return false;
		return true;
	})();

	return {
		user: !isLoading && user && data ? { ...user, ...data } : null,
		isLoading
	};
};
