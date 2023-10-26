import React from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useCollection } from "./useCollection";

export const useAuthentication = () => {
  // Initialize Firebase Auth
  const auth = getAuth();
  const [user, setUser] = React.useState(null);
  // const { addDocument } = useCollection();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);

    return () => unsubscribe();
  }, []);

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    setUser(user);
    await addDocument(user, user.uid);
    return user;
  };

  const logInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    setUser(user);
    return user;
  };

  // Function to sign out
  const signOutUser = async () => {
    signOut(auth).then(() => setUser(null));
  };

  return {
    user,
    signInWithGoogle,
    signOutUser,
  };
};
