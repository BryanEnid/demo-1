import { handleFetch } from '@/hooks/api/fetchWithAuth.js';
import { BASE_URL } from '@/config/api.js';

export const findEmoji = (search) => handleFetch(`${BASE_URL}/api/emojis`, { method: 'GET', params: { search } });
