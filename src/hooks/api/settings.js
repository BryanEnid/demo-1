import { fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { handleFetch } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';
const RESOURCE_URL = `${BASE_URL}/api/settings`;

export const getSettings = (auth, userId) => fetchWithAuth(auth, `${RESOURCE_URL}/${userId}`, { method: 'GET' });

export const handleUpdate = (auth, settings) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/update`, { method: 'PUT', body: settings });

export const handleUpload = (auth, body) => fetchWithAuth(auth, `${RESOURCE_URL}/upload`, { body, method: 'PUT' });
