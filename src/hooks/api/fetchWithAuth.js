const formatBody = (body) => {
	// If multipart return FormData instance
	if (body instanceof FormData) return [body, {}];

	// If valid JSON
	if (body) return [JSON.stringify(body), { 'Content-Type': 'application/json' }];

	// [body, headers]
	return [null, null];
};

const getUrlWithParams = (url, params) => {
	if (!params) {
		return url;
	}

	const query = new URLSearchParams(params).toString();
	if (query?.length) {
		return `${url}?${query}`;
	}

	return url;
};

export const handleFetch = (url, opts = {}) => {
	const { body, ...options } = opts;
	const [payload, headers] = formatBody(body);

	return fetch(getUrlWithParams(url, opts.params), {
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
