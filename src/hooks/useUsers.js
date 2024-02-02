import React from 'react';
import { BASE_URL } from '@/config/api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getUsers as handleGetUsers } from '@/hooks/api/users.js';

export const useUsers = () => {
	const { data: users, isLoading } = useQuery({
		gcTime: Infinity,
		queryKey: ['Users', 'All'],
		queryFn: handleGetUsers,
		select: (arr) => arr.sort((a, b) => a.name.localeCompare(b.name))
	});

	// React.useEffect(() => {
	// 	const getUsers = async () => {
	// 		const res = await fetch(`${BASE_URL}/api/users`);
	// 		const data = await res.json();

	// 		return data.sort((a, b) => a.name.localeCompare(b.name));
	// 	};

	// 	getUsers().then(setData);
	// }, []);

	return { users, isLoading };
};
