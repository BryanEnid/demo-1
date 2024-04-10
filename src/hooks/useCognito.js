import React from 'react';
// import { googleCB } from './api/oauth2';
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
};

const ID_TOKEN_KEY = 'id_token';
const USER_KEY = 'cognito_user';
const REDIRECT_URI = `${window.location.origin}/sign-in`;

export const useCognito = () => {
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
			const idToken = localStorage.getItem(ID_TOKEN_KEY);
			const user = JSON.parse(localStorage.getItem(USER_KEY));

			res({ idToken, user });
		})
			.then((auth) => {
				if (auth?.idToken && auth?.user) emit(auth);
			})
			.catch(console.log);
	}, []);

	const handleSaveUserLocally = async (idToken) => {
		if (!loadingRef.current) {
			loadingRef.current = true;
			const user = decodeIdToken(idToken);
			localStorage.setItem(ID_TOKEN_KEY, idToken);
			localStorage.setItem(USER_KEY, JSON.stringify(user));

			emit({ idToken, user });
			loadingRef.current = false;
		}
	};

	const handleSignIn = async ({ identity_provider }) => {
		const params = querystring.stringify({
			// Cognito
			client_id: '3fu7gk23aupj8veu18m19b6j16',
			response_type: 'token',
			redirect_uri: REDIRECT_URI,
			identity_provider
		});

		const url = `https://observe.auth.us-east-1.amazoncognito.com/oauth2/authorize?${params}`;
		window.location.href = url;
	};

	const onAuthStateChanged = (cb) => {
		return subscribe(cb);
	};

	const handleLogout = () => {
		return new Promise((res) => {
			localStorage.removeItem(ID_TOKEN_KEY);
			localStorage.removeItem(USER_KEY);

			const params = querystring.stringify({
				client_id: '3fu7gk23aupj8veu18m19b6j16',
				logout_uri: REDIRECT_URI
			});

			const url = `https://observe.auth.us-east-1.amazoncognito.com/logout?${params}`;

			emit({});
			window.location.href = url;
			// res();
		});
	};

	return {
		onAuthStateChanged,
		signIn: handleSignIn,
		signOut: handleLogout,
		handleSaveUserLocally
	};
};
