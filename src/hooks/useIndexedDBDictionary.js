import React from 'react';

export const useIndexedDBDictionary = (dbName, dbVersion = 1) => {
	const [dictionary, setDictionary] = React.useState({});

	React.useEffect(() => {
		const retrieveDictionary = async () => {
			const db = await openDB();

			const transaction = db.transaction(['dictionary'], 'readonly');
			const objectStore = transaction.objectStore('dictionary');

			const getAllRequest = objectStore.getAll();

			getAllRequest.onsuccess = function () {
				const savedDictionary = {};
				getAllRequest.result.forEach((entry) => {
					savedDictionary[entry.key] = entry.value;
				});
				setDictionary(savedDictionary);
			};

			// Close the database after the transaction
			transaction.oncomplete = function () {
				db.close();
			};
		};

		retrieveDictionary();

		return () => {
			setDictionary({});
		};
	}, []); // Run only once on mount

	const saveKeyValue = React.useCallback(async (key, value) => {
		const db = await openDB();

		const transaction = db.transaction(['dictionary'], 'readwrite');
		const objectStore = transaction.objectStore('dictionary');

		const addRequest = objectStore.put({ key, value });

		addRequest.onsuccess = function () {
			console.log('Key-value pair saved successfully');
		};

		addRequest.onerror = function (error) {
			console.error('Error saving key-value pair:', error);
		};

		// Close the database after the transaction
		transaction.oncomplete = function () {
			db.close();
		};

		return addRequest;
	}, []);

	const getValueByKey = React.useCallback(async (key) => {
		const db = await openDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['dictionary'], 'readonly');
			const objectStore = transaction.objectStore('dictionary');

			const getRequest = objectStore.get(key);

			getRequest.onsuccess = function (event) {
				const retrievedEntry = getRequest.result;

				// Close the database after the transaction
				transaction.oncomplete = function () {
					db.close();
				};

				if (retrievedEntry) {
					resolve(retrievedEntry.value);
				} else {
					reject(new Error(`Value with key ${key} not found`));
				}
			};

			getRequest.onerror = function (event) {
				reject(event.target.error);
			};
		});
	}, []);

	const openDB = async () => {
		const request = window.indexedDB.open(dbName, dbVersion);

		return new Promise((resolve, reject) => {
			request.onupgradeneeded = function (event) {
				const db = event.target.result;

				// Create an object store
				db.createObjectStore('dictionary', { keyPath: 'key' });
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

	return { dictionary: React.useMemo(() => dictionary, [dictionary]), saveKeyValue, getValueByKey };
};
