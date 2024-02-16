import { fetchWithAuth } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const getStripeAccount = (auth) => fetchWithAuth(auth, `${BASE_URL}/api/stripe`, { method: 'GET' });

export const createStripeAccount = (auth, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/stripe`, { method: 'POST', body });

export const updateStripeAccount = (auth, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/stripe`, { method: 'PUT', body });

export const uploadStripeAccountDocs = (auth, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/stripe/upload-documents`, { method: 'PUT', body });

export const checkoutBucket = (auth, body) =>
	fetchWithAuth(auth, `${BASE_URL}/api/stripe/checkout-bucket`, { method: 'POST', body });
