import React, { createContext, useContext, useState } from 'react';

const initialState = {
	bucketInfoOpen: null,
	bucketCreateOpen: false,
	bucketData: null,
	showCreateBucketModal: () => {},
	closeCreateBucketModal: () => {},
	showBucketInfo: () => {},
	closeBucketInfo: () => {}
};

const LayoutContext = createContext({ ...initialState });

export const useLayout = () => useContext(LayoutContext);

const LayoutProvider = ({ children }) => {
	const [bucketInfoOpen, setBucketInfoOpen] = useState(initialState.bucketInfoOpen);
	const [bucketCreateOpen, setBucketCreateOpen] = useState(initialState.bucketCreateOpen); // old show state
	const [bucketData, setBucketData] = useState(initialState.bucketData);

	const handleCreateBucket = (data) => {
		setBucketCreateOpen(true);
		setBucketData(data);
	};

	const handleCancel = () => {
		setBucketCreateOpen(false);
		setBucketData(null);
	};

	const contextValue = {
		bucketInfoOpen,
		bucketCreateOpen,
		bucketData,

		showCreateBucketModal: handleCreateBucket,
		closeCreateBucketModal: handleCancel,
		showBucketInfo: (bucket) => setBucketInfoOpen(bucket),
		closeBucketInfo: () => setBucketInfoOpen(null)
	};

	return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

export default LayoutProvider;
