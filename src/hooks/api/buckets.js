import { handleFetch, fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const getBuckets = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets`, { method: 'GET' });

export const getBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'GET' });

export const createBucket = (bucket) => handleFetch(`${BASE_URL}/api/buckets`, { method: 'POST', body: bucket });

export const updateBucket = (bucket, id) =>
	handleFetch(`${BASE_URL}/api/buckets/${id}`, { method: 'PUT', body: bucket });
