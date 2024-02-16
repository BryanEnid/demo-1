import React, { useEffect } from 'react';
import { useImageCache } from '@/providers/ImageCacheProvider';
import { BASE_URL } from '@/config/api';
import { isRelativePath } from '@/lib/utils';

const BYPASS_IMAGES_WITH_PROXY_URL = `${BASE_URL}/api/images?url=`;

export const Image = ({ src, proxyEnabled = false, ...props }) => {
	const { addToCache, isCached } = useImageCache();

	useEffect(() => {
		const fetchImage = async (url) => {
			try {
				const imageUrl = proxyEnabled ? BYPASS_IMAGES_WITH_PROXY_URL + url : url;
				const response = await fetch(imageUrl);
				const blob = await response.blob();
				addToCache(url, blob);
			} catch (e) {
				throw { nativeError: e, url, message: e.message };
			}
		};

		if (!isCached(src) && !isRelativePath(src)) fetchImage(src).catch((e) => console.log(e));
	}, [src, addToCache, isCached, isRelativePath, proxyEnabled]);

	const handleCachedURL = (src) => {
		if (proxyEnabled) return isCached(src) ? URL.createObjectURL(isCached(src)) : BYPASS_IMAGES_WITH_PROXY_URL + src;
		return isCached(src) ? URL.createObjectURL(isCached(src)) : src;
	};

	if (isRelativePath(src)) return <img src={src} {...props} />;

	return <img crossOrigin="anonymous" src={handleCachedURL(src)} {...props} />;
};
