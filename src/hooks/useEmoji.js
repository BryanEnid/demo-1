import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { findEmoji as handleFindEmoji } from './api/emoji';

const COLLECTION_NAME = 'Emoji';

const useEmoji = (search) => {
	const queryKey = [COLLECTION_NAME, search];

	const { data } = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: async () => (search ? handleFindEmoji(search) : null),
		enabled: Boolean(search?.length)
	});

	return {
		data: data || []
	};
};

export default useEmoji;
