import { handleFetch, fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const getBuckets = (auth, params) => fetchWithAuth(auth, `${BASE_URL}/api/buckets`, { params });
// export const getBuckets = (auth, params) => handleFetch(`${BASE_URL}/api/buckets`, { params });

export const getBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'GET' });

export const createBucket = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/buckets`, { method: 'POST', body });

export const deleteBucket = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'DELETE' });

export const updateBucket = (auth, { body, id }) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}`, { method: 'PUT', body });

export const uploadVideo = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/video`, { method: 'POST', body });

export const uploadVideoURLs = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/videoURLs`, { method: 'POST', body });

export const getBucketViewers = (auth, id) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/viewers`, { method: 'GET' });

export const markBucketViewed = (auth, id) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/viewers`, { method: 'PUT' });

export const updateBucketsCategory = (auth, { body, category, params }) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/categories/${category}`, { method: 'PUT', body, params });

export const deleteBucketsCategory = (auth, category, params) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/categories/${category}`, { method: 'DELETE', params });

export const createBucketPrice = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/price`, { method: 'POST', body });

export const updateBucketPrice = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/buckets/${id}/price`, { method: 'PUT', body });
