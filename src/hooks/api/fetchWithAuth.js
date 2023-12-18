export const handleFetch = (url, opts = {}) => {
	const body = opts.body ? JSON.stringify(opts.body) : undefined;

	return fetch(url, {
		...opts,
		body,
		headers: {
			'Content-Type': 'application/json',
			...opts.headers
		}
	}).then((res) => res.json());
};

export const fetchWithAuth = async ({ authToken, logout }, url, opts = {}) => {
	try {
		return await handleFetch(url, {
			...opts,
			headers: {
				Authorization: `Bearer ${authToken}`,
				...opts.headers
			}
		});
	} catch (err) {
		if (err.response.status === 401) {
			logout();
		}

		throw err;
	}
};
