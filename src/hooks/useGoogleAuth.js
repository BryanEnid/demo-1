import React from 'react';
import { googleCB } from './api/oauth2';
import querystring from 'querystring';
import { decodeIdToken } from '@/lib/utils';

const useSubscription = () => {
	const subscriptionsRef = React.useRef([]);

	const unsubscribe = (cb) => {
		subscriptionsRef.current = subscriptionsRef.current.filter((item) => item !== cb);
	};
	const subscribe = (cb) => {
		subscriptionsRef.current.push(cb);
		return () => unsubscribe(cb);
	};

	const emit = (val) => {
		subscriptionsRef.current.forEach((cb) => cb(val));
	};

	return {
		subscriptions: subscriptionsRef.current,
		emit,
		subscribe,
		unsubscribe
	};
};

const getAuthFromBrowser = () => {
	const location = window.location.href.replace('#', '?');
	const url = new URL(location);
	const obj = {};
	url.searchParams.forEach((value, key) => (obj[key] = value));

	return obj;
	// return popupWindowURL.searchParams.get('code');
};

// const REDIRECT_URI = `${window.location.origin}/redirects?provider=linkedin`;
// const REDIRECT_URI = `http://localhost:3300/api/auth/linkedin`;
const ACCESS_TOKEN_KEY = 'googleAccessToken';
const USER_KEY = 'googleInUser';
const REDIRECT_URI = `${window.location.origin}/sign-in`;

export const useGoogleAuth = () => {
	// Hooks
	const { emit, subscribe } = useSubscription();
	const loadingRef = React.useRef(false);

	React.useEffect(() => {
		if (window.location.pathname === '/sign-in') {
			const { id_token } = getAuthFromBrowser();
			if (id_token) handleSaveUserLocally(id_token);
		}
	}, []);

	React.useEffect(() => {
		new Promise((res) => {
			const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
			const user = JSON.parse(localStorage.getItem(USER_KEY));

			res({ accessToken, user });
		})
			.then((auth) => {
				if (auth?.accessToken && auth?.user) emit(auth);
			})
			.catch(console.log);
	}, []);

	const handleSaveUserLocally = async (accessToken) => {
		if (!loadingRef.current) {
			loadingRef.current = true;
			// const user = await googleCB(accessToken);
			const user = decodeIdToken(accessToken);
			console.log(user);
			localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
			localStorage.setItem(USER_KEY, JSON.stringify(user));

			emit({ accessToken, user });
			loadingRef.current = false;
		}
	};

	const handleGoogleAuth = async () => {
		const params = querystring.stringify({
			// Cognito
			client_id: '3fu7gk23aupj8veu18m19b6j16',
			// scope: 'email+openid+phone+profile',
			identity_provider: 'Linkedin',

			// OpenID
			// client_id: '720749345099-h6flca2l75vngrghrjsngf1lt8c03cov.apps.googleusercontent.com',
			// scope: 'email openid phone profile', // Not supported in cognito
			// prompt: 'select_account', // Not supported in cognito,
			// include_granted_scopes: 'true',

			// Cross
			response_type: 'token',
			redirect_uri: 'https://localhost:5173/sign-in'
		});

		const url = `https://observe.auth.us-east-1.amazoncognito.com/oauth2/authorize?${params}`;
		// const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
		window.location.href = url;
	};

	const onAuthStateChanged = (cb) => {
		return subscribe(cb);
	};

	const handleLogout = () => {
		return new Promise((res) => {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(USER_KEY);

			const params = querystring.stringify({
				// identity_provider: 'Linkedin',
				// response_type: 'token',
				client_id: '3fu7gk23aupj8veu18m19b6j16', // Cognito
				logout_uri: 'https://localhost:5173/sign-in'
				// redirect_uri: 'https://localhost:5173/sign-in'
			});

			const url = `https://observe.auth.us-east-1.amazoncognito.com/logout?${params}`;

			emit({});
			window.location.href = url;
			// res();
		});
	};

	return {
		onAuthStateChanged,
		signInWithGoogle: handleGoogleAuth,
		signOut: handleLogout,
		handleSaveUserLocally
	};
};
