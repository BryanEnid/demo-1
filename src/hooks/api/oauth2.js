import { BASE_URL } from '@/config/api.js';
import { handleFetch } from '@/hooks/api/fetchWithAuth';

export const linkedInCB = (code, redirectUrl) =>
	handleFetch(`${BASE_URL}/api/auth/linkedin/cb`, {
		method: 'GET',
		params: { code, redirectUrl }
	});

export const googleCB = (accessToken) => {
	const url = 'https://www.googleapis.com/oauth2/v1/userinfo';
	const headers = { Authorization: `Bearer ${accessToken}` };

	return handleFetch(url, {
		headers: headers
	});
};
