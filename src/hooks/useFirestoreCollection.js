import React from "react";
import { db, storage } from "@/config/firebase"; // Assuming you have Firebase Storage configured
import {
  collection,
  addDoc,
  doc, // Add this import
  setDoc, // Add this import
  onSnapshot,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  const deleteDocument = async (documentId) => {
    try {
      const docRef = doc(collection(db, collectionName), documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        return true; // Document deleted successfully
      } else {
        console.error("Document does not exist.");
        return false; // Document does not exist, deletion failed
      }
    } catch (err) {
      console.error("Error deleting document: ", err);
      return false; // Deletion failed
    }
  };

  const appendVideo = async (videoData, documentId) => {
    try {
      const docRef = doc(collection(db, collectionName), documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const currentVideos = (currentData && currentData.videos) || [];
        await updateDoc(docRef, { videos: [...currentVideos, videoData] });
        return documentId;
      } else {
        console.error("Document does not exist.");
        return null;
      }
    } catch (err) {
      console.error("Error appending video to document: ", err);
    }
  };

  const uploadVideo = async (file) => {
    try {
      // Generate a unique identifier for the filename
      const documentId = Date.now().toString(); // Use a timestamp or any other unique identifier

      // Create a reference with the generated document ID as the filename
      const videoRef = ref(storage, `videos/${documentId}`);

      // Upload the file
      await uploadBytes(videoRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(videoRef);

      return downloadURL;
    } catch (err) {
      console.error("Error uploading video: ", err);
      throw err; // Re-throw the error so the caller can handle it if needed
    }
  };

  const uploadPicture = async (file) => {
    try {
      // Generate a unique identifier for the filename
      const documentId = Date.now().toString(); // Use a timestamp or any other unique identifier

      // Create a reference with the generated document ID as the filename
      const videoRef = ref(storage, `pictures/${documentId}`);

      // Upload the file
      await uploadBytes(videoRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(videoRef);

      return downloadURL;
    } catch (err) {
      console.error("Error uploading video: ", err);
      throw err; // Re-throw the error so the caller can handle it if needed
    }
  };

  return { data, loading, error, addDocument, uploadVideo, uploadPicture, appendVideo, deleteDocument };
};
