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
import { useAuthentication } from "./useAuthentication";

export const useCollection = (collectionName) => {
  // Hooks
  const { user } = useAuthentication();

  // State
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Get the Firestore collection reference
  const collectionRef = collection(db, collectionName);

  const addDocument = async (documentData, documentId = null) => {
    try {
      if (!user) {
        // Handle the case where there's no authenticated user
        console.error("User is not authenticated.");
        return null;
      }

      // Include the user's UID in the document data
      documentData.creatorId = user.uid;

      if (documentId) {
        // If a documentId is provided, update the existing document
        return updateDocument(documentId, documentData);
      } else {
        // If no documentId is provided, create a new document
        return createDocument(documentData);
      }
    } catch (err) {
      console.error("Error adding/updating document: ", err);
    }
  };

  const createDocument = async (documentData) => {
    const newDocRef = await addDoc(collectionRef, documentData);
    return newDocRef.id;
  };

  const updateDocument = async (documentId, documentData) => {
    try {
      const docRef = doc(collectionRef, documentId);
      await setDoc(docRef, documentData, {
        merge: true,
      });
      return documentId;
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      if (!user) {
        // Handle the case where there's no authenticated user
        console.error("User is not authenticated.");
        return false;
      }

      const docRef = doc(collection(db, collectionName), documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const creatorId = docSnap.data().creatorId;

        if (creatorId === user.uid) {
          await deleteDoc(docRef);
          return true; // Document deleted successfully
        } else {
          console.error("User does not have permission to delete this document.");
          return false; // User doesn't have permission to delete this document
        }
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
      if (!user) {
        // Handle the case where there's no authenticated user
        console.error("User is not authenticated.");
        return null;
      }

      const docRef = doc(collection(db, collectionName), documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const creatorId = docSnap.data().creatorId;

        if (creatorId === user.uid) {
          const currentData = docSnap.data();
          const currentVideos = (currentData && currentData.videos) || [];
          await updateDoc(docRef, { videos: [...currentVideos, videoData] });
          return documentId;
        } else {
          console.error("User does not have permission to append to this document.");
          return null; // User doesn't have permission to append to this document
        }
      } else {
        console.error("Document does not exist.");
        return null;
      }
    } catch (err) {
      console.error("Error appending video to document: ", err);
    }
  };

  const uploadFile = async (file, fileType) => {
    try {
      const documentId = Date.now().toString();
      const fileRef = ref(storage, `${fileType}/${documentId}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (err) {
      console.error(`Error uploading ${fileType}: `, err);
      throw err;
    }
  };

  // TODO: Replace realtime data with regular fetch
  // Fetch the data and set up the snapshot listener
  React.useEffect(() => {
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

  return { data, loading, error, addDocument, uploadFile, appendVideo, deleteDocument };
};
