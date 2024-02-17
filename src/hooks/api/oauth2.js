import { BASE_URL } from '@/config/api.js';
import { handleFetch } from '@/hooks/api/fetchWithAuth';

export const linkedInCB = (code, redirectUrl) =>
	handleFetch(`${BASE_URL}/api/auth/linkedin/cb`, {
		method: 'GET',
		params: { code, redirectUrl }
	});
