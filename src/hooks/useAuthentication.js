import React from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export const useAuthentication = () => {
  // Initialize Firebase Auth
  const auth = getAuth();

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    setUser(user);

    // await addDocument(user);

    return user;
  };

  // Function to sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    signInWithGoogle,
    signOutUser,
  };
};
