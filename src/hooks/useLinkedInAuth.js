import { useRef, useEffect, useCallback } from 'react';

import { getLinkedInUser } from '@/hooks/api/linkedinAuth.js';
import linkedInConfig from '@/config/linkedIn';

const getCodeFromWindowURL = (url) => {
	const popupWindowURL = new URL(url);
	return popupWindowURL.searchParams.get('code');
};

const useSubscription = () => {
	const subscriptionsRef = useRef([]);

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

const ACCESS_TOKEN_KEY = 'linkedInAccessToken';
const USER_KEY = 'linkedInUser';

const useLinkedInAuth = () => {
	const { emit, subscribe } = useSubscription();
	const loadingRef = useRef(false);

	const handlePostMessage = useCallback(
		async (event) => {
			if (event.data.type === 'code' && !loadingRef.current) {
				loadingRef.current = true;
				const { code } = event.data;

				const { accessToken, user } = await getLinkedInUser(code);

				localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
				localStorage.setItem(USER_KEY, JSON.stringify(user));

				emit({ accessToken, user });
				loadingRef.current = false;
			}
		},
		[emit]
	);

	const signInWithPopup = async () => {
		const { clientId, redirectUrl, oauthUrl, scope, state } = linkedInConfig;
		const url = `${oauthUrl}&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUrl}`;

		const width = 450;
		const height = 730;
		const left = window.screen.width / 2 - width / 2;
		const top = window.screen.height / 2 - height / 2;

		await window.open(
			url,
			{ wait: true, app: 'Linkedin' },
			`menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
		);
	};

	const onAuthStateChanged = (cb) => {
		return subscribe(cb);
	};

	const signOut = () => {
		return new Promise((res) => {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(USER_KEY);

			emit({});
			res();
		});
	};

	useEffect(() => {
		new Promise((res) => {
			const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
			const user = JSON.parse(localStorage.getItem(USER_KEY));

			res({ accessToken, user });
		}).then((auth) => {
			if (auth?.accessToken && auth?.user) {
				emit(auth);
			}
		});
	}, []);

	useEffect(() => {
		if (window.opener && window.opener !== window) {
			const code = getCodeFromWindowURL(window.location.href);
			window.opener.postMessage({ type: 'code', code: code }, '*');
			window.close();
		}

		window.addEventListener('message', handlePostMessage);

		return () => window.removeEventListener('message', handlePostMessage);
	}, [handlePostMessage]);

	return {
		signInWithPopup,
		onAuthStateChanged,
		signOut
	};
};

export default useLinkedInAuth;
