import React from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Assuming you have Firebase Storage configured

export const useAuthenticationProviders = () => {
	// Initialize Firebase Auth
	const auth = getAuth();
	const [user, setUser] = React.useState(null);
	const [isLoading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			setUser(authUser);
			setLoading(false);
		});
		return () => {
			unsubscribe();
			setLoading(true);
			setUser(null);
		};
	}, []);

	const createUser = async (documentData, documentId) => {
		const collectionRef = collection(db, 'users');
		const docRef = doc(collectionRef, documentId);
		return setDoc(docRef, documentData);
	};

	// Function to sign in with Google
	const signInWithGoogle = async () => {
		// Get from provider
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth, provider);
		setUser(user);
		return user;
	};

	// Function to sign out
	const signOutUser = async () => signOut(auth).then(() => setUser(null));

	return {
		user,
		isLoading,
		signInWithGoogle,
		signOutUser,
		createUser
	};
};
