import React, { useEffect } from 'react';
import { useImageCache } from '@/providers/ImageCacheProvider';
import { BASE_URL } from '@/config/api';
import { cn, isRelativePath } from '@/lib/utils';
import { Spinner } from './Spinner';
import { Skeleton } from '@/chadcn/Skeleton';

const BYPASS_IMAGES_WITH_PROXY_URL = `${BASE_URL}/api/images?url=`;

export const Image = ({ src, proxyEnabled = false, className, ...props }) => {
	const [isLoading, setLoading] = React.useState(true);
	const imageRef = React.useRef();

	React.useEffect(() => {
		setTimeout(() => setLoading(false), 20000);
	}, []);

	return (
		<div className="flex justify-center items-center relative h-full w-full">
			{isLoading && (
				<div className="absolute">
					<Spinner size={30} />
				</div>
			)}
			<img
				ref={imageRef}
				crossOrigin="anonymous"
				src={proxyEnabled ? BYPASS_IMAGES_WITH_PROXY_URL + src : src}
				className={cn('z-10', className)}
				{...props}
			/>
		</div>
	);

	// ? With caching
	// const { addToCache, isCached } = useImageCache();

	// useEffect(() => {
	// 	const fetchImage = async (url) => {
	// 		try {
	// 			const imageUrl = proxyEnabled ? BYPASS_IMAGES_WITH_PROXY_URL + url : url;
	// 			const response = await fetch(imageUrl);
	// 			if (response.ok) {
	// 				const blob = await response.blob();
	// 				addToCache(url, blob);
	// 			} else {
	// 				const response = await fetch(url);
	// 				const blob = await response.blob();
	// 				addToCache(url, blob);
	// 			}
	// 		} catch (e) {
	// 			throw { nativeError: e, url, message: e.message };
	// 		}
	// 	};

	// 	if (!isCached(src) && !isRelativePath(src)) fetchImage(src).catch((e) => console.log(e));
	// }, [src, addToCache, isCached, isRelativePath, proxyEnabled]);

	// const handleCachedURL = (src) => {
	// 	if (proxyEnabled) return isCached(src) ? URL.createObjectURL(isCached(src)) : BYPASS_IMAGES_WITH_PROXY_URL + src;
	// 	return isCached(src) ? URL.createObjectURL(isCached(src)) : src;
	// };

	// if (isRelativePath(src)) return <img src={src} {...props} />;

	// return <img crossOrigin="anonymous" src={handleCachedURL(src)} {...props} />;
};
