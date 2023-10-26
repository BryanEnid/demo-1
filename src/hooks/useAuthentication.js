import React from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { db } from "@/config/firebase"; // Assuming you have Firebase Storage configured
import { collection, doc, setDoc } from "firebase/firestore";

export const useAuthentication = () => {
  // Initialize Firebase Auth
  const auth = getAuth();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const createUser = async (documentData, documentId) => {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, documentId);
    return setDoc(docRef, documentData);
  };

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    setUser(user);
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
    createUser,
  };
};
