import React from "react";
import { db } from "@/config/firebase";
import { collection, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, deleteDoc, where, query } from "firebase/firestore";
import { useAuthentication } from "./useAuthentication";
import { useQuery, useMutation } from "@tanstack/react-query";

const configDefaults = { keys: [], query: false };

export const useCollection = (collectionName, config = configDefaults) => {
  const { user } = useAuthentication();

  // Define query key for useQuery
  const queryKey = ["collection", collectionName, ...config?.keys];
  const queries = { where }; // Define Firestore query functions (e.g., where)

  // Use useQuery to fetch the data
  const queryProps = useQuery({
    queryKey,
    queryFn: async () => {
      // Setup necessary references
      const collectionRef = collection(db, collectionName);

      const params = [collectionRef];
      // Add optional parameters for specific/complex queries
      if (config?.query) {
        console.log("fired");
        // TODO: add a less opinionated API
        const { queryType, property, operation, value } = config.query;
        params.push(queries[queryType](property, operation, value));
      }

      // Prepare query
      const userQuery = query(...params);
      const q = query(userQuery);

      // Construct object and read data
      const querySnapshot = await getDocs(q);
      const documents = {};
      querySnapshot.forEach((doc) => {
        console.log(">>>>", doc);
        const data = doc.data();
        documents[doc.id] = { id: doc.id, ...data };
      });

      return new Promise((res) => res(documents));
    },

    ...config,
  });

  // Use useMutation for creating, updating, and deleting documents
  const createDocumentMutation = useMutation({
    mutationFn: (documentData) => {
      if (!user) throw new Error("User is not authenticated.");

      documentData.creatorId = user.uid;
      return addDoc(collection(db, collectionName), documentData);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: ({ documentId, documentData }) => {
      if (!user) throw new Error("User is not authenticated.");

      const docRef = doc(collection(db, collectionName), documentId);
      return setDoc(docRef, documentData, { merge: true });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId) => {
      if (!user) throw new Error("User is not authenticated.");

      const docRef = doc(collection(db, collectionName), documentId);

      return getDoc(docRef).then((docSnap) => {
        if (!docSnap.exists()) throw new Error("Document does not exist.");

        return deleteDoc(docRef);
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
    },
  });

  const appendVideoMutation = useMutation({
    mutationFn: ({ documentId, videoData }) => {
      if (!user) throw new Error("User is not authenticated.");
      const docRef = doc(collection(db, collectionName), documentId);

      return getDoc(docRef).then((docSnap) => {
        if (!docSnap.exists()) throw new Error("Document does not exist.");
        const creatorId = docSnap.data().creatorId;

        if (creatorId !== user.uid) throw new Error("User does not have permission to append to this document.");

        const currentData = docSnap.data();
        const currentVideos = (currentData && currentData.videos) || [];
        return updateDoc(docRef, { videos: [...currentVideos, videoData] });
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
    },
  });

  // const getBy = async (queryType, property, operation, value) => {
  //   const queries = { where }; // Define Firestore query functions (e.g., where)
  //   const userQuery = query(collectionRef, queries[queryType](property, operation, value));

  //   const querySnapshot = await getDocs(userQuery);

  //   if (querySnapshot.empty) return;

  //   const output = [];
  //   querySnapshot.forEach((doc) => output.push({ id: doc.id, ...doc.data() }));

  //   return output;
  // };

  // Define a function to check available username
  const checkAvailableUsername = async (username) => {
    if (!(username.length > 3)) return false;
    const userQuery = query(collection(db, collectionName), where("username", "==", username));
    const querySnapshot = await getDocs(userQuery);
    return querySnapshot.empty;
  };

  return {
    ...queryProps,
    createDocument: createDocumentMutation.mutate,
    updateDocument: updateDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    appendVideo: appendVideoMutation.mutate,
    // getBy: checkAvailableUsername,
  };
};
