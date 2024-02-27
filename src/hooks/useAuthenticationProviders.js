import React from 'react';
import { useLinkedInAuth } from './useLinkedInAuth';
import { useUser } from '@/hooks/useUser.js';
import { useGoogleAuth } from './useGoogleAuth'; // Importing useGoogleAuth hook
import { useCognito } from './useCognito';

export const useAuthenticationProviders = () => {
	const { signIn, signOut, onAuthStateChanged } = useCognito();

	// State
	const [authToken, setAuthToken] = React.useState(null);
	const { user, isLoading: isUserLoading, createUser, setUser, setLoading } = useUser({ authToken });

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(async ({ idToken, user: authUser }) => {
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
				setAuthToken(idToken);
				setUser((_user) => ({ ..._user, ...data, id: _user?.id }));
			}

			setLoading(false);
		});

		setLoading(false);

		return () => {
			unsubscribe();
			setUser(null);
		};
	}, []);

	// Function to sign out
	const signOutUser = async () => {
		return Promise.all([signOut()]).then(() => {
			setUser(null);
			setAuthToken(null);
		});
	};

	return {
		user,
		authToken,
		isLoading: isUserLoading,
		signOutUser,
		createUser,

		signInWithGoogle: () => signIn({ identity_provider: 'Google' }),
		signInWithLinkedIn: () => signIn({ identity_provider: 'Linkedin' })
	};
};
