import { createContext, useContext, useState } from 'react';

// Context to store cached images
const ImageCacheContext = createContext({});

export const ImageCacheProvider = ({ children }) => {
	const [cache, setCache] = useState({});

	const addToCache = (src, blob) => {
		setCache((prevCache) => ({
			...prevCache,
			[src]: blob
		}));
	};

	const isCached = (src) => cache[src];

	return <ImageCacheContext.Provider value={{ addToCache, isCached }}>{children}</ImageCacheContext.Provider>;
};

export const useImageCache = () => useContext(ImageCacheContext);
