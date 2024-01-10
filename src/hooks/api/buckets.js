import { handleFetch, fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

// export const getBuckets = (auth, params) => fetchWithAuth(auth, `${BASE_URL}/api/buckets`, { params });
export const getBuckets = (auth, params) => handleFetch(`${BASE_URL}/api/buckets`, { params });

export const getBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'GET' });

export const createBucket = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/buckets`, { method: 'POST', body });

export const deleteBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'DELETE' });

export const updateBucket = (auth, { body, id }) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'PUT', body });

export const uploadVideo = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/video`, { method: 'POST', body });

export const uploadVideoURLs = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/videoURLs`, { method: 'POST', body });
