import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import useLinkedInAuth from './useLinkedInAuth';

import { useUser } from '@/hooks/useUser.js';
import { app } from '@/config/firebase';

export const useAuthenticationProviders = () => {
	// Initialize Firebase Auth
	const auth = getAuth(app);
	const {
		signInWithPopup: signInWithLinkedIn,
		onAuthStateChanged: onLIAuthStateChanged,
		signOut: linkedInSignOut
	} = useLinkedInAuth();
	const [authToken, setAuthToken] = useState(null);

	// Function to sign out
	const signOutUser = async () => {
		return Promise.all([signOut(auth), linkedInSignOut()]).then(() => {
			setUser(null);
			setAuthToken(null);
		});
	};

	const {
		user,
		isLoading: isUserLoading,
		createUser,
		setUser,
		setLoading
	} = useUser({
		authToken,
		logout: signOutUser
	});

	useEffect(() => {
		const unsubscribeLinkedIn = onLIAuthStateChanged(async ({ accessToken, user: authUser }) => {
			const data = {
				username: authUser?.sub,
				photoURL: authUser?.picture,
				name: authUser?.name,
				displayName: authUser?.name,
				email: authUser?.email,
				uid: authUser?.sub
			};

			if (authUser && !user?.id) {
				await createUser(data);
			}

			if (authUser) {
				setAuthToken(accessToken);
				setUser((_user) => ({ ..._user, ...data, id: _user?.id }));
			}
			setLoading(false);
		});

		const unsubscribeGoogle = onAuthStateChanged(auth, async (authUser) => {
			if (authUser && !user?.id) {
				const data = {
					username: authUser.uid,
					photoURL: authUser.photoURL,
					name: authUser.displayName,
					email: authUser.email,
					providerData: authUser.providerData,
					reloadUserInfo: authUser.reloadUserInfo,
					uid: authUser.uid
				};
				await createUser(data);
			}

			if (authUser) {
				setAuthToken(authUser?.accessToken);
				setUser((_user) => ({ ..._user, ...authUser, id: _user?.id }));
			}
			setLoading(false);
		});

		return () => {
			unsubscribeLinkedIn();
			unsubscribeGoogle();
			// setLoading(true);
			setUser(null);
		};
	}, []);

	// Function to sign in with Google
	const signInWithGoogle = async () => {
		// Get from provider
		const provider = new GoogleAuthProvider();

		await signInWithPopup(auth, provider);
	};

	return {
		user,
		authToken,
		isLoading: isUserLoading,
		signInWithGoogle,
		signInWithLinkedIn,
		signOutUser,
		createUser
	};
};
