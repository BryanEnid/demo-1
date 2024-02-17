import React from 'react';
import { linkedInCB } from './api/oauth2';

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

const getCodeFromBrowser = () => {
	const popupWindowURL = new URL(window.location.href);
	return popupWindowURL.searchParams.get('code');
};

// const REDIRECT_URI = `${window.location.origin}/redirects?provider=linkedin`;
// const REDIRECT_URI = `http://localhost:3300/api/auth/linkedin`;
const ACCESS_TOKEN_KEY = 'linkedInAccessToken';
const USER_KEY = 'linkedInUser';
const REDIRECT_URI = `${window.location.origin}/sign-in`;

export const useLinkedInAuth = () => {
	// Hooks
	const { emit, subscribe } = useSubscription();
	const loadingRef = React.useRef(false);

	React.useEffect(() => {
		if (window.location.pathname === '/sign-in') {
			const code = getCodeFromBrowser();
			if (code) handleSaveUserLocally(code);
		}
	}, []);

	React.useEffect(() => {
		new Promise((res) => {
			const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
			const user = JSON.parse(localStorage.getItem(USER_KEY));

			res({ accessToken, user });
		})
			.then((auth) => {
				if (auth?.accessToken && auth?.user) {
					emit(auth);
				}
			})
			.catch(console.log);
	}, []);

	const handleSaveUserLocally = async (code) => {
		if (!loadingRef.current) {
			loadingRef.current = true;
			const { accessToken, user } = await linkedInCB(code, REDIRECT_URI);
			localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
			localStorage.setItem(USER_KEY, JSON.stringify(user));

			emit({ accessToken, user });
			loadingRef.current = false;
		}
	};

	const handleLinkedInAuthPopUp = () => {
		// ! COEP and COOP doesn't allow window.postMessage
		// const REDIRECT_URI = `${window.location.origin}/redirects?provider=linkedin`;
		// const width = 450;
		// const height = 730;
		// const left = window.screen.width / 2 - width / 2;
		// const top = window.screen.height / 2 - height / 2;
		// // Make a request to your backend server to initiate the OAuth2 flow
		// const response = await fetch(`http://localhost:3300/api/auth/linkedin?redirectUri=${REDIRECT_URI}`);
		// const url = await response.text();
		// // Open a popup window for LinkedIn authentication
		// popup = window.open(
		// 	url,
		// 	{ wait: true, app: 'Linkedin' },
		// 	`popup=1, menubar=no, location=no, resizable=no, scrollbars=no, status=no, width=${width}, height=${height}, top=${top}, left=${left}`
		// );
		// // Listen for messages from the popup window
		// window.addEventListener('message', handleMessage);
	};

	const handleLinkedInAuth = async () => {
		const endpoint = `http://localhost:3300/api/auth/linkedin?redirectUri=${REDIRECT_URI}`;
		window.location.href = endpoint;
	};

	const onAuthStateChanged = (cb) => {
		return subscribe(cb);
	};

	const handleLogout = () => {
		return new Promise((res) => {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(USER_KEY);

			emit({});
			res();
		});
	};

	return {
		// userData,
		onAuthStateChanged,
		signInWithLinkedIn: handleLinkedInAuth,
		signOut: handleLogout,
		handleSaveUserLocally
	};
};
