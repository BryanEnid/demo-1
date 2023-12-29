import { fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

const RESOURCE_URL = `${BASE_URL}/api/questions`;

export const fetchQuestions = (auth, query) => fetchWithAuth(auth, RESOURCE_URL, { params: query });

export const createQuestion = (auth, data) => fetchWithAuth(auth, RESOURCE_URL, { body: data, method: 'POST' });

export const updateQuestion = (auth, id, data) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/${id}`, { body: data, method: 'PUT' });

export const upvoteQuestion = (auth, id) => fetchWithAuth(auth, `${RESOURCE_URL}/${id}/upvote`, { method: 'PUT' });

export const createAnswer = (auth, id, body) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/${id}/answer`, { body, method: 'POST' });

export const uploadVideoAnswer = (auth, id, body) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/${id}/answer/upload`, { body, method: 'POST' });
