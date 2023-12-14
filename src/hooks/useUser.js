import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createUser as handleCreateUser, getUser } from '@/hooks/api/users.js';

export const useUser = (auth, id) => {
	const [user, setUser] = React.useState(null);
	const [isLoading, setLoading] = React.useState(true);

	const { data, isLoading: isUserLoading } = useQuery({
		gcTime: Infinity,
		queryKey: [auth.authToken, id],
		queryFn: () => (id && auth.authToken ? getUser(auth, id) : null)
	});

	useEffect(() => {
		if (data) {
			setUser((val) => ({ ...val, ...data }));
		}
	}, [data]);

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
		isLoading: isLoading || isUserLoading,
		setUser,
		setLoading,
		createUser
	};
};
