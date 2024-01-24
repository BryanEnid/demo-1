import { fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

const RESOURCE_URL = `${BASE_URL}/api/recommends`;

export const fetchRecommends = (auth, userId) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/findByUser/${userId}`, { method: 'GET' });

export const fetchArticlePreview = (auth, url) =>
	fetchWithAuth(auth, `${BASE_URL}/api/articles/preview`, { method: 'GET', params: { url } });

export const createArticle = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/articles`, { method: 'POST', body });

export const deleteArticle = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/articles/${id}`, { method: 'DELETE' });

export const createVideo = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/videos`, { method: 'POST', body });

export const deleteVideo = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/videos/${id}`, { method: 'DELETE' });

export const createBook = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/books`, { method: 'POST', body });

export const updateBook = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/books/${id}`, { method: 'PUT', body });

export const deleteBook = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/books/${id}`, { method: 'DELETE' });

export const uploadBookPhoto = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/books/${id}/photos/upload`, { method: 'POST', body });

export const createTool = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/tools`, { method: 'POST', body });

export const deleteTool = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/tools/${id}`, { method: 'DELETE' });

export const uploadToolPicture = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/tools/${id}/upload`, { method: 'PUT', body });

export const updateToolsCategory = (auth, { body, category }) =>
	fetchWithAuth(auth, `${BASE_URL}/api/tools/categories/${category}`, { method: 'PUT', body });

export const createPeople = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/people`, { method: 'POST', body });

export const deletePeople = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/people/${id}`, { method: 'DELETE' });

export const uploadPeoplePicture = (auth, id, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/people/${id}/upload`, { method: 'PUT', body });

export const createPodcast = (auth, body) => fetchWithAuth(auth, `${BASE_URL}/api/podcasts`, { method: 'POST', body });

export const deletePodcast = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/podcasts/${id}`, { method: 'DELETE' });

export const searchPodcasts = (auth, params) =>
	fetchWithAuth(auth, `${BASE_URL}/api/podcasts/search`, { method: 'GET', params });
