import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/Authentication';
import { useMutation, useQuery, QueryObserverResult } from '@tanstack/react-query';
import { getProfile, updateProfile as handleUpdateProfile, deleteFile as handleDeleteFile } from '@/hooks/api/profile';
import { ProfileBody } from '@/types/profileTypes';

type UseExperienceHook = {
	data: ProfileBody | undefined;
	isLoading: boolean;
	error: any;

	updateProfile: (params: { body: ProfileBody; id: string; section: string }) => void;
	deleteFile: (params: { id: string }) => void;
};

export const useExperience = (): UseExperienceHook => {
	// Hooks
	const { id: userId } = useParams<{ id: string }>();
	const { user, ...auth } = useAuth();
	const queryClient = useQueryClient();

	// Var
	const enabled = userId && userId !== 'profile';
	const queryKey = ['Profile', 'Experience', userId];

	// State
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<any>(null);

	const handleErrors = (err: any) => {
		setError(err);
		setIsLoading(false);
	};

	const { data: profileData, ...rest }: QueryObserverResult<ProfileBody, any> = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: () => (enabled ? getProfile(userId) : null)
	});

	const updateProfile = useMutation<void, any, { body: ProfileBody; id: string; section: string }>({
		mutationFn: (params) => handleUpdateProfile(auth, params),
		// TODO: Optimistic updates
		onSuccess: () => queryClient.invalidateQueries({ queryKey }),
		onError: handleErrors
	});

	const deleteFile = useMutation<void, any, { id: string }>({
		mutationFn: ({ id: documentId }) => handleDeleteFile(auth, { userId, documentId }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey }),
		onError: handleErrors
	});

	return {
		...rest,
		data: profileData,
		isLoading,
		error,

		updateProfile: updateProfile.mutate,
		deleteFile: deleteFile.mutate
	};
};
