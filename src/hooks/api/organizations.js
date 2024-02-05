import { fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

const RESOURCE_URL = `${BASE_URL}/api/organizations`;

export const getOrganizations = (auth, params) => fetchWithAuth(auth, RESOURCE_URL, { params });

export const getOrganization = (auth, id) => fetchWithAuth(auth, `${RESOURCE_URL}/${id}`, { method: 'GET' });

export const createOrganization = (auth, body) => fetchWithAuth(auth, RESOURCE_URL, { method: 'POST', body });

export const updateOrganization = (auth, id, body) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/${id}`, { body, method: 'PUT' });

export const uploadOrgPicture = (auth, id, body) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/${id}/upload`, { body, method: 'PUT' });

export const uploadOrgBgPicture = (auth, id, body) =>
	fetchWithAuth(auth, `${RESOURCE_URL}/${id}/upload-bg`, { body, method: 'PUT' });

export const deleteOrganization = (auth, id) => fetchWithAuth(auth, `${RESOURCE_URL}/${id}`, { method: 'DELETE' });
