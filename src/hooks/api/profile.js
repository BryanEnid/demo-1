import { handleFetch, fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const getProfile = (id) => handleFetch(`${BASE_URL}/api/profiles/${id}`, { method: 'GET' });

export const updateProfile = (auth, { id, body, section }, options) =>
	fetchWithAuth(auth, `${BASE_URL}/api/profiles/${id}/${section}`, { method: 'PUT', body, ...options });

export const deleteFile = (auth, { userId, documentId }) =>
	fetchWithAuth(auth, `${BASE_URL}/api/profiles/${userId}/attachments/${documentId}`, { method: 'DELETE' });
