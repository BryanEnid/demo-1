import React, { useEffect } from 'react';
import { useImageCache } from '@/providers/ImageCacheProvider';
import { BASE_URL } from '@/config/api';
import { cn, isRelativePath } from '@/lib/utils';
import { Spinner } from './Spinner';
import { Skeleton } from '@/chadcn/Skeleton';
import default_image from '@/assets/default_image.png';

const BYPASS_IMAGES_WITH_PROXY_URL = `${BASE_URL}/api/images?url=`;

export const Image = ({ src, proxyEnabled = false, className, ...props }) => {
	const [isLoading, setLoading] = React.useState(true);
	const imageRef = React.useRef();
	const [dynamicStyles, setDynamicStyles] = React.useState({});
	const [source, setSource] = React.useState(default_image);

	React.useEffect(() => {
		setTimeout(() => setLoading(false), 30000);
	}, []);

	React.useEffect(() => {
		setSource(proxyEnabled ? BYPASS_IMAGES_WITH_PROXY_URL + src : src);
	}, [src]);

	const handleImageFailure = () => {
		if (isRelativePath(src)) return;
		// setDynamicStyles({ opacity: 0 });
		setSource(proxyEnabled ? src : BYPASS_IMAGES_WITH_PROXY_URL + src); // Invert proxy
	};

	const handleLoad = (e) => {
		setLoading(false);
	};

	return (
		<div className={cn('relative')}>
			{/* {isLoading && (
				<Spinner className="absolute z-20 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" size={30} />
			)} */}
			<img
				onLoad={handleLoad}
				onError={handleImageFailure}
				style={dynamicStyles}
				ref={imageRef}
				crossOrigin="anonymous"
				src={source}
				className={cn('relative z-10', className)}
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
