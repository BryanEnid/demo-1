import React, { createContext, useContext } from 'react';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';

// Create the authentication context
const AuthContext = createContext({
	user: null,
	authToken: null,
	isLoading: false,
	loginWithGoogle: () => {},
	loginWithLinkedIn: () => {},
	logout: () => {}
});

// Create a custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export function AuthProvider({ children }) {
	const { user, authToken, isLoading, signInWithGoogle, signInWithLinkedIn, signOutUser } =
		useAuthenticationProviders();

	// Function to log in
	const loginWithGoogle = () => {
		// Perform your actual login logic here
		return signInWithGoogle();
	};

	const loginWithLinkedIn = () => {
		return signInWithLinkedIn();
	};

	// Function to log out
	const logout = () =>
		// Perform your actual logout logic here
		signOutUser();

	// Context value
	const contextValue = {
		user: !isLoading && user ? user : null,
		authToken,
		loginWithGoogle,
		loginWithLinkedIn,
		logout,
		isLoading
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
