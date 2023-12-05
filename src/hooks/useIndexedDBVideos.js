import React from 'react';

export const useIndexedDBVideos = (dbName, dbVersion = 1) => {
	const [videos, setVideos] = React.useState([]);

	React.useEffect(() => {
		const retrieveVideos = async () => {
			const db = await openDB();

			const transaction = db.transaction(['videos'], 'readonly');
			const objectStore = transaction.objectStore('videos');

			const getAllRequest = objectStore.getAll();

			getAllRequest.onsuccess = function () {
				const savedVideos = getAllRequest.result;
				setVideos(savedVideos);
			};

			// Close the database after the transaction
			transaction.oncomplete = function () {
				db.close();
			};
		};

		retrieveVideos();

		return () => {
			setVideos([]);
		};
	}, []); // Run only once on mount

	const saveVideo = React.useCallback(async (recordedVideoBlob) => {
		const db = await openDB();

		const transaction = db.transaction(['videos'], 'readwrite');
		const objectStore = transaction.objectStore('videos');

		const videoData = {
			blob: recordedVideoBlob,
			timestamp: new Date().getTime()
		};

		const addRequest = objectStore.add(videoData);

		addRequest.onsuccess = function () {
			console.log('Video saved successfully');
		};

		addRequest.onerror = function (error) {
			console.error('Error saving video:', error);
		};

		// Close the database after the transaction
		transaction.oncomplete = function () {
			db.close();
		};

		return addRequest;
	}, []);

	const getVideo = React.useCallback(async (key) => {
		const db = await openDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['videos'], 'readonly');
			const objectStore = transaction.objectStore('videos');

			const getRequest = objectStore.get(key);

			getRequest.onsuccess = function (event) {
				const videoData = getRequest.result;

				// Close the database after the transaction
				transaction.oncomplete = function () {
					db.close();
				};

				if (videoData) {
					resolve(videoData);
				} else {
					reject(new Error(`Video with key ${key} not found`));
				}
			};

			getRequest.onerror = function (event) {
				reject(event.target.error);
			};
		});
	}, []);

	const openDB = async () => {
		// const dbVersion = 1;
		// const dbName = "local-unlisted-videos";

		const request = window.indexedDB.open(dbName, dbVersion);

		return new Promise((resolve, reject) => {
			request.onupgradeneeded = function (event) {
				const db = event.target.result;

				// Create an object store
				db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
			};

			request.onsuccess = function (event) {
				const db = event.target.result;
				resolve(db);
			};

			request.onerror = function (event) {
				reject(event.target.error);
			};
		});
	};

	return { videos: React.useMemo(() => videos.toReversed(), [videos]), saveVideo, getVideo };
};
