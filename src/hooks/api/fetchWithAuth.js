import CircularJSON from 'circular-json';

const formatBody = (body) => {
	// If multipart return FormData instance
	if (body instanceof FormData) return [body, {}];

	// If valid JSON
	if (body) return [JSON.stringify(body), { 'Content-Type': 'application/json' }];

	// [body, headers]
	return [null, null];
};

export const handleFetch = (url, opts) => {
	const { body, ...options } = opts;
	const [payload, headers] = formatBody(body);

	return fetch(url, {
		...options,
		body: payload,
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
		if (err.response?.status === 401) logout();

		throw err;
	}
};
