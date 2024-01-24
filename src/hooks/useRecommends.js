import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/Authentication.jsx';
import {
	fetchRecommends,
	fetchArticlePreview,
	createArticle as handleCreateArticle,
	deleteArticle as handleDeleteArticle,
	createVideo as handleCreateVideo,
	deleteVideo as handleDeleteVideo,
	createBook as handleCreateBook,
	updateBook as handleUpdateBook,
	deleteBook as handleDeleteBook,
	uploadBookPhoto as handleUploadBookPhoto,
	createTool as handleCreateTool,
	uploadToolPicture as handleUploadToolPicture,
	updateToolsCategory as handleUpdateToolsCategory,
	deleteTool as handleDeleteTool,
	createPeople as handleCreatePeople,
	uploadPeoplePicture as handleUploadPeoplePicture,
	deletePeople as handleDeletePeople,
	createPodcast as handleCreatePodcast,
	deletePodcast as handleDeletePodcast,
	searchPodcasts as handleSearchPodcasts
} from '@/hooks/api/recommends.js';

const COLLECTION_NAME = 'Recommends';

const useRecommends = (userId) => {
	const [searchArticlePreview, setSearchArticlePreview] = useState('');
	const [searchPodcastsPreview, setSearchPodcastsPreview] = useState('');
	const [mutationLoading, setMutationLoading] = useState(false);

	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, auth?.authToken];
	const recommendsQueryKey = [...queryKey, userId];

	const { data, isLoading: loadingRecommends } = useQuery({
		gcTime: Infinity,
		queryKey: recommendsQueryKey,
		queryFn: () => (auth?.authToken && userId ? fetchRecommends(auth, userId) : null)
	});

	const {
		data: articlePreview,
		isLoading: loadingArticlePreview,
		isError: isArticleError
	} = useQuery({
		gcTime: Infinity,
		queryKey: [COLLECTION_NAME, searchArticlePreview],
		queryFn: () => (searchArticlePreview ? fetchArticlePreview(auth, searchArticlePreview) : null)
	});

	const createArticle = useMutation({
		mutationFn: async (data) => {
			setMutationLoading(true);
			const res = await handleCreateArticle(auth, data);
			setSearchArticlePreview('');
			return res;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const deleteArticle = useMutation({
		mutationFn: ({ id }) => {
			setMutationLoading(true);
			return handleDeleteArticle(auth, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const {
		data: podcastsPreview,
		isLoading: loadingPodcastsPreview,
		isError: isPodcastsError
	} = useQuery({
		gcTime: Infinity,
		queryKey: [COLLECTION_NAME, searchPodcastsPreview],
		queryFn: () =>
			searchPodcastsPreview ? handleSearchPodcasts(auth, { q: encodeURIComponent(searchPodcastsPreview) }) : null
	});

	const createPodcast = useMutation({
		mutationFn: async (data) => {
			setMutationLoading(true);
			const res = await handleCreatePodcast(auth, data);
			setSearchPodcastsPreview('');
			return res;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const deletePodcast = useMutation({
		mutationFn: ({ id }) => {
			setMutationLoading(true);
			return handleDeletePodcast(auth, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const createVideo = useMutation({
		mutationFn: (data) => {
			setMutationLoading(true);
			return handleCreateVideo(auth, data);
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const deleteVideo = useMutation({
		mutationFn: ({ id }) => {
			setMutationLoading(true);
			return handleDeleteVideo(auth, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const createBookMutation = useMutation({
		mutationFn: async (data) => handleCreateBook(auth, data)
	});

	const updateBookMutation = useMutation({
		mutationFn: async ({ id, ...data }) => handleUpdateBook(auth, id, data)
	});

	const uploadBookPhotoMutation = useMutation({
		mutationFn: async ({ data, id }) => handleUploadBookPhoto(auth, id, data)
	});

	const createBook = async ({ photos, ...data }) => {
		setMutationLoading(true);
		try {
			const { id } = await createBookMutation.mutateAsync(data);

			for (let i = 0; i < photos.length; i += 1) {
				await uploadBookPhotoMutation.mutateAsync({ id, data: photos[i] });
			}
			await queryClient.invalidateQueries({ queryKey });
		} catch (err) {
			console.log(err);
		} finally {
			setMutationLoading(false);
		}
	};

	const updateBook = async ({ photos, ...data }) => {
		setMutationLoading(true);
		try {
			const newPhotos = [];

			for (let i = 0; i < photos.length; i += 1) {
				if (photos[i] instanceof FormData) {
					const res = await uploadBookPhotoMutation.mutateAsync({ id: data.id, data: photos[i] });
					newPhotos.push(res.photos.pop());
				} else {
					newPhotos.push(photos[i]);
				}
			}

			await updateBookMutation.mutateAsync({ ...data, photos: newPhotos });
			await queryClient.invalidateQueries({ queryKey });
		} catch (err) {
			console.log(err);
		} finally {
			setMutationLoading(false);
		}
	};

	const deleteBook = useMutation({
		mutationFn: ({ id }) => {
			setMutationLoading(true);
			return handleDeleteBook(auth, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const createToolMutation = useMutation({
		mutationFn: async (data) => handleCreateTool(auth, data)
	});

	const uploadToolPhotoMutation = useMutation({
		mutationFn: async ({ data, id }) => handleUploadToolPicture(auth, id, data)
	});

	const createTool = async ({ picture, ...data }) => {
		setMutationLoading(true);
		try {
			const { id } = await createToolMutation.mutateAsync({
				...data,
				...(typeof picture === 'string' && { picture })
			});

			if (picture instanceof FormData) {
				await uploadToolPhotoMutation.mutateAsync({ id, data: picture });
			}

			await queryClient.invalidateQueries({ queryKey });
		} catch (err) {
			console.log(err);
		} finally {
			setMutationLoading(false);
		}
	};

	const deleteTool = useMutation({
		mutationFn: ({ id }) => {
			setMutationLoading(true);
			return handleDeleteTool(auth, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const updateToolsCategory = useMutation({
		mutationFn: ({ data: body, category }) => {
			setMutationLoading(true);
			handleUpdateToolsCategory(auth, { body, category });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	const createPeopleMutation = useMutation({
		mutationFn: async (data) => handleCreatePeople(auth, data)
	});

	const uploadPeoplePictureMutation = useMutation({
		mutationFn: async ({ data, id }) => handleUploadPeoplePicture(auth, id, data)
	});

	const createPeople = async ({ picture, ...data }) => {
		setMutationLoading(true);
		try {
			const { id } = await createPeopleMutation.mutateAsync(data);
			await uploadPeoplePictureMutation.mutateAsync({ id, data: picture });

			await queryClient.invalidateQueries({ queryKey });
		} catch (err) {
			console.log(err);
		} finally {
			setMutationLoading(false);
		}
	};

	const deletePeople = useMutation({
		mutationFn: ({ id }) => {
			setMutationLoading(true);
			return handleDeletePeople(auth, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onSettled: () => {
			setMutationLoading(false);
		}
	});

	return {
		data,
		isLoading: loadingRecommends || loadingArticlePreview || loadingPodcastsPreview || mutationLoading,
		isArticleError,
		articlePreview: searchArticlePreview ? articlePreview : null,
		fetchArticlePreview: setSearchArticlePreview,
		clearArticlePreview: () => setSearchArticlePreview(''),
		createArticle: createArticle.mutateAsync,
		deleteArticle: deleteArticle.mutateAsync,
		podcastsPreview: searchPodcastsPreview ? podcastsPreview : null,
		isPodcastsError,
		searchPodcastsPreview: setSearchPodcastsPreview,
		clearPodcastsPreview: () => setSearchPodcastsPreview(''),
		createPodcast: createPodcast.mutateAsync,
		deletePodcast: deletePodcast.mutateAsync,
		createVideo: createVideo.mutateAsync,
		deleteVideo: deleteVideo.mutateAsync,
		createBook,
		updateBook,
		deleteBook: deleteBook.mutate,
		createTool,
		deleteTool: deleteTool.mutate,
		updateToolsCategory: updateToolsCategory.mutate,
		createPeople,
		deletePeople: deletePeople.mutate
	};
};

export default useRecommends;
