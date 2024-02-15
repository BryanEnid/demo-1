import React from 'react';
import { useLinkedInAuth } from './useLinkedInAuth';
import { useUser } from '@/hooks/useUser.js';
// import { useGoogleAuth } from './useGoogleAuth'; // Importing useGoogleAuth hook

export const useAuthenticationProviders = () => {
	// const { signInWithGoogle, onGoogleAuthStateChanged } = useGoogleAuth(); // Using useGoogleAuth hook
	const { signInWithLinkedIn, signOut: linkedInSignOut, onAuthStateChanged: onLIAuthStateChanged } = useLinkedInAuth();

	// State
	const [authToken, setAuthToken] = React.useState(null);

	const { user, isLoading: isUserLoading, createUser, setUser, setLoading } = useUser({ authToken });

	React.useEffect(() => {
		const unsubscribeLinkedIn = onLIAuthStateChanged(async ({ accessToken, user: authUser }) => {
			const data = {
				username: authUser?.sub,
				photoURL: authUser?.picture,
				name: authUser?.name,
				displayName: authUser?.name,
				email: authUser?.email,
				uid: authUser?.sub
			};

			if (authUser && !user?.id) await createUser(data);

			if (authUser) {
				setAuthToken(accessToken);
				setUser((_user) => ({ ..._user, ...data, id: _user?.id }));
			}

			setLoading(false);
		});

		setLoading(false);

		return () => {
			unsubscribeLinkedIn();
			setUser(null);
		};
	}, []);

	// Function to sign out
	const signOutUser = async () => {
		return Promise.all([linkedInSignOut()]).then(() => {
			setUser(null);
			setAuthToken(null);
		});
	};

	return {
		user,
		authToken,
		isLoading: isUserLoading,
		signInWithGoogle: null,
		signInWithLinkedIn,
		signOutUser,
		createUser
	};
};
