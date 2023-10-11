import React from "react";
import { db } from "@/config/firebase"; // Assuming you have Firebase Storage configured
import {
  collection,
  addDoc,
  doc, // Add this import
  setDoc, // Add this import
  onSnapshot,
} from "firebase/firestore";

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

  const addDocument = async (documentData, documentId = null) => {
    try {
      const collectionRef = collection(db, collectionName);

      if (documentId) {
        // If a documentId is provided, update the existing document
        const docRef = doc(collectionRef, documentId); // Use the doc method
        await setDoc(docRef, documentData, { merge: true }); // Use setDoc with merge option
        return documentId; // Return the document ID for reference
      } else {
        // If no documentId is provided, create a new document
        const newDocRef = await addDoc(collectionRef, documentData);
        return newDocRef.id; // Return the new document's ID for reference
      }
    } catch (err) {
      console.error("Error adding/updating document: ", err);
    }
  };

  const uploadVideo = async (file) => {
    try {
      const storageRef = storage.ref();
      const videoRef = storageRef.child(`videos/${file.name}`);
      await videoRef.put(file);
      const downloadURL = await videoRef.getDownloadURL();
      return downloadURL;
    } catch (err) {
      console.error("Error uploading video: ", err);
    }
  };

  return { data, loading, error, addDocument, uploadVideo };
};
