import { BASE_URL } from '@/config/api.js';

export default {
	clientId: import.meta.env.VITE_SERVER_LI_CLIENT_ID,
	redirectUrl: `${window.location.origin}/linkedin/redirect`,
	oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
	scope: 'profile%20email%20openid'
};
