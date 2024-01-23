import { handleFetch, fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const findUsers = (search) => handleFetch(`${BASE_URL}/api/users`, { method: 'GET', params: { search } });

// export const getUser = (auth, id) => fetchWithAuth(auth, `${BASE_URL}/api/users/${id}`, { method: 'GET' });
export const getUser = (id) => handleFetch(`${BASE_URL}/api/users/${id}`, { method: 'GET' });

export const getUsers = (id) => handleFetch(`${BASE_URL}/api/users`, { method: 'GET' });

export const createUser = (user) => handleFetch(`${BASE_URL}/api/users`, { method: 'POST', body: user });
