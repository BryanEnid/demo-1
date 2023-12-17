import React, { useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

import { useUser } from '@/hooks/useUser.js';
import { app } from '@/config/firebase';

export const useAuthenticationProviders = () => {
	// Initialize Firebase Auth
	const auth = getAuth(app);
	const [authToken, setAuthToken] = useState(null);

	// Function to sign out
	const signOutUser = async () => signOut(auth).then(() => setUser(null));

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

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			setAuthToken(authUser?.accessToken);
			setUser((_user) => (authUser ? { ...authUser, id: _user?.id } : null));
			setLoading(false);
		});

		return () => {
			unsubscribe();
			// setLoading(true);
			setUser(null);
		};
	}, []);

	// Function to sign in with Google
	const signInWithGoogle = async () => {
		// Get from provider
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth, provider);

		const data = {
			username: user.uid,
			photoURL: user.photoURL,
			name: user.displayName,
			email: user.email,
			providerData: user.providerData,
			reloadUserInfo: user.reloadUserInfo,
			uid: user.uid
		};
		await createUser(data);
	};

	return {
		user,
		authToken,
		isLoading: isUserLoading,
		signInWithGoogle,
		signOutUser,
		createUser
	};
};
