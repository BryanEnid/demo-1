import React, { createContext, useContext } from 'react';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';

// Create the authentication context
const AuthContext = createContext({
	user: null,
	authToken: null,
	isLoading: false,
	login: () => {},
	logout: () => {}
});

// Create a custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export function AuthProvider({ children }) {
	const { user, authToken, isLoading, signInWithGoogle, signOutUser } = useAuthenticationProviders();

	// Function to log in
	const login = () => {
		// Perform your actual login logic here
		return signInWithGoogle();
	};
	// Function to log out
	const logout = () =>
		// Perform your actual logout logic here
		signOutUser();

	// Context value
	const contextValue = {
		user: !isLoading && user ? user : null,
		authToken,
		login,
		logout,
		isLoading
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
