const formatBody = (body) => {
	// If multipart return FormData instance
	if (body instanceof FormData) return [body, {}];

	// If valid JSON
	if (body) return [JSON.stringify(body), { 'Content-Type': 'application/json' }];

	// [body, headers]
	return [null, null];
};

export const handleFetch = (url, opts = {}) => {
	const [body, headers] = formatBody(opts.body);

	return fetch(url, {
		...opts,
		body,
		headers: { ...headers, ...opts.headers }
	}).then((res) => res.json());
};

export const fetchWithAuth = async ({ authToken, logout }, url, opts = {}) => {
	try {
		return handleFetch(url, {
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
