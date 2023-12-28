import { handleFetch, fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const getBuckets = (auth, ownerId) => {
	let parameters = '';
	if (ownerId) parameters = '?' + new URLSearchParams({ ownerId }).toString();

	return fetchWithAuth(auth, `${BASE_URL}/api/buckets${parameters}`, { method: 'GET' });
};

export const getBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'GET' });

export const createBucket = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/buckets`, { method: 'POST', body });

export const deleteBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'DELETE' });

export const updateBucket = (auth, { body, id }) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'PUT', body });

export const uploadVideo = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/video`, { method: 'POST', body });
