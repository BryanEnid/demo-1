import { BASE_URL } from '@/config/api.js';
import { handleFetch } from '@/hooks/api/fetchWithAuth';

export const getLinkedInUser = (code) =>
	handleFetch(`${BASE_URL}/api/auth/linkedin/getUser`, {
		method: 'GET',
		params: { code }
	});
