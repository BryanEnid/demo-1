import React from "react";
import { db } from "@/config/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export const useFirestoreCollection = (collectionName) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const collectionRef = collection(db, collectionName);

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error getting documents: ", err);
        setData([]);
        setLoading(false);
        setError(err);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (documentData) => {
    try {
      const collectionRef = collection(db, collectionName);
      await addDoc(collectionRef, documentData);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  return { data, loading, error, addDocument };
};
