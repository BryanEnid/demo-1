import React from 'react';
import {
	collection,
	addDoc,
	doc,
	setDoc,
	updateDoc,
	getDoc,
	getDocs,
	deleteDoc,
	where,
	query
} from 'firebase/firestore';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useAuthenticationProviders } from './useAuthenticationProviders';
import { useAuth } from '@/providers/Authentication.jsx';
import { db, storage } from '@/config/firebase';

const configDefaults = { keys: [], query: [] };

export const useCollection = (collectionName, config = configDefaults) => {
	// const { user: _user } = useAuthenticationProviders();
	const { user } = useAuth();
	const queryClient = useQueryClient();

	// Define query key for useQuery
	const queryKey = ['collection', collectionName];
	if (config?.keys) queryKey.push(config.keys);
	const queries = { where }; // Define Firestore query functions (e.g., where)

	// Use useQuery to fetch the data
	const queryProps = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: async () => {
			try {
				// Setup necessary references
				const collectionRef = collection(db, collectionName);

				const params = [collectionRef];

				// Add optional parameters for specific/complex queries
				if (config?.query.every(Boolean) && config?.query?.length === 4) {
					// TODO: create a less opinionated API
					const [queryType, property, operation, value] = config.query;
					params.push(queries[queryType](property, operation, value));
				}

				// Prepare query
				const userQuery = query(...params);
				const q = query(userQuery);

				// Construct object and read data
				const querySnapshot = await getDocs(q);
				const documents = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					documents.push({ /*id: doc.id,*/ ...data });
				});

				return new Promise((res) => res(documents));
			} catch (e) {
				console.log(e);
			}
		},

		...config
	});

	// Use useMutation for creating, updating, and deleting documents
	const createDocumentMutation = useMutation({
		mutationFn: async ({ data }) => {
			if (!user) throw new Error('User is not authenticated.');

			data.creatorId = user.uid;
			const document = await addDoc(collection(db, collectionName), data);
			return document.id;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		}
	});

	const updateDocumentMutation = useMutation({
		mutationFn: ({ data, documentId }) => {
			if (!user) throw new Error('User is not authenticated.');

			const docRef = doc(collection(db, collectionName), documentId);
			return setDoc(docRef, data, { merge: true });
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		}
	});

	const deleteDocumentMutation = useMutation({
		mutationFn: (documentId) => {
			if (!user) throw new Error('User is not authenticated.');

			const docRef = doc(collection(db, collectionName), documentId);

			return getDoc(docRef).then((docSnap) => {
				if (!docSnap.exists()) throw new Error('Document does not exist.');

				return deleteDoc(docRef);
			});
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['collection', collectionName] });
		}
	});

	const appendVideoMutation = useMutation({
		mutationFn: async ({ videoData, documentId }) => {
			if (!user) throw new Error('User is not authenticated.');
			const docRef = doc(collection(db, collectionName), documentId);

			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) throw new Error('Document does not exist.');

			const { creatorId } = docSnap.data();
			if (creatorId !== user.uid) throw new Error('User does not have permission to append to this document.');

			const currentData = docSnap.data();
			const currentVideos = (currentData && currentData.videos) || [];
			return updateDoc(docRef, { videos: [...currentVideos, videoData] });
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
			queryClient.setQueryData(queryKey, (oldData) => {});
		}
	});

	const uploadResumableFileMutation = useMutation({
		mutationFn: async ({ file, fileType }) => {
			const documentId = Date.now().toString();
			const fileRef = ref(storage, `${fileType}/${documentId}`);
			const uploadTask = uploadBytesResumable(fileRef, file);

			return { uploadTask, getDownloadURL: () => getDownloadURL(fileRef) };
		}
	});

	const uploadFileMutation = useMutation({
		mutationFn: async ({ file, fileType }) => {
			const documentId = Date.now().toString();
			const fileRef = ref(storage, `${fileType}/${documentId}`);
			await uploadBytes(fileRef, file);
			const url = await getDownloadURL(fileRef);
			return url;
		}
	});

	// Define a function to check available username
	const checkAvailableUsername = async (username) => {
		if (!(username.length > 3)) return false;
		const userQuery = query(collection(db, collectionName), where('username', '==', username));
		const querySnapshot = await getDocs(userQuery);
		return querySnapshot.empty;
	};

	return {
		...queryProps,
		createDocument: createDocumentMutation.mutate,
		updateDocument: updateDocumentMutation.mutate,
		deleteDocument: deleteDocumentMutation.mutate,
		appendVideo: appendVideoMutation.mutate,
		uploadResumableFile: uploadResumableFileMutation.mutateAsync,
		uploadFile: uploadFileMutation.mutateAsync
		// getBy: checkAvailableUsername,
	};
};
