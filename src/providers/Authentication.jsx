import React, { createContext, useContext, useState } from 'react';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';
import { useUser } from '@/hooks/useUser';

// Create the authentication context
const AuthContext = createContext();

// Create a custom hook to use the authentication context
export const useAuth = () => {
	const { user, logout, login, isLoggedIn, isLoading } = useContext(AuthContext);
	return {
		user,
		logout,
		login,
		isLoggedIn,
		isLoading
	};
};

// Create the AuthProvider component
export function AuthProvider({ children }) {
	const { signInWithGoogle, signOutUser, createUser } = useAuthenticationProviders();
	const { user, isLoading } = useUser();

	// Function to log in
	const login = () =>
		// Perform your actual login logic here
		signInWithGoogle().then((authUser) => {
			const data = {
				username: authUser.uid,
				photoURL: authUser.photoURL,
				name: authUser.displayName,
				email: authUser.email,
				providerData: authUser.providerData,
				reloadUserInfo: authUser.reloadUserInfo,
				uid: authUser.uid
			};
			return createUser(data, authUser.uid);
		});
	// Function to log out
	const logout = () =>
		// Perform your actual logout logic here
		signOutUser();
	// Context value
	const contextValue = {
		user,
		login,
		logout,
		isLoading
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
