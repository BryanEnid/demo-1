import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getUser, createUser as handleCreateUser, findUsers as handleFindUsers } from '@/hooks/api/users.js';

export const useUser = (auth, id) => {
	const [user, setUser] = React.useState(null);
	const [isLoading, setLoading] = React.useState(true);
	const [usersSearch, setUsersSearch] = React.useState('');

	const enabled = id && auth.authToken && id != 'profile';

	const { data, isLoading: isUserLoading } = useQuery({
		gcTime: Infinity,
		queryKey: ['Users', id, auth?.authToken],
		queryFn: () => (enabled ? getUser(auth, id) : null),
		enabled: Boolean(enabled)
	});

	useEffect(() => {
		if (data) {
			setUser((val) => ({ ...val, ...data }));
		}
	}, [data]);

	const { data: users, isLoading: isUsersLoading } = useQuery({
		gcTime: Infinity,
		queryKey: ['Users', usersSearch, auth?.authToken],
		enabled: !!usersSearch.length,
		queryFn: () => (usersSearch.length ? handleFindUsers(usersSearch) : null)
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (data) => handleCreateUser(data)
	});

	const createUser = async (data) => {
		setLoading(true);

		const res = await mutateAsync(data);

		setUser((val) => ({ ...val, ...res }));
		setLoading(false);
	};

	return {
		user,
		users: users || [],
		isLoading: isLoading || isUserLoading || isUsersLoading,
		isUsersLoading,
		setUser,
		setLoading,
		createUser,
		findUsers: setUsersSearch
	};
};
