import { BASE_URL } from '@/config/api.js';
import { handleFetch } from '@/hooks/api/fetchWithAuth';
import linkedInConfig from '@/config/linkedIn';

export const getLinkedInUser = (code) =>
	handleFetch(`${BASE_URL}/api/auth/linkedin/getUser`, {
		method: 'GET',
		params: { code, redirectUrl: linkedInConfig.redirectUrl }
	});
