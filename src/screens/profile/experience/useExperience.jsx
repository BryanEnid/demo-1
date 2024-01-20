import React from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/Authentication.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfile, updateProfile as handleUpdateProfile } from '@/hooks/api/profile';

/**
 * Custom hook for managing user experience data.
 * @returns {{
 *   data: ExperienceType,
 *   isLoading: boolean,
 *   error: any,
 *   updateProfile: (params: { body: ProfileBody, id: string, section: string }) => Promise<void>
 * }}
 */
export const useExperience = () => {
	const { id } = useParams();
	const { user, ...auth } = useAuth();
	const queryClient = useQueryClient();

	const enabled = id && id != 'profile';

	const queryKey = ['Profile', 'Experience', 'About', id];

	const { data: Experience, ...rest } = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: () => (enabled ? getProfile(id) : null)
	});

	/**
	 * Update the user profile.
	 * @function
	 * @name updateProfile.mutate
	 * @param {Object} params - The parameters for updating the profile.
	 * @param {ProfileBody} params.body - The body of the profile update.
	 * @param {string} params.id - The user ID.
	 * @param {string} params.section - The section of the profile to update.
	 * @returns {Promise<void>} A promise that resolves once the update is complete.
	 */
	const updateProfile = useMutation({
		mutationFn: (params) => handleUpdateProfile(auth, params),
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	return {
		...rest,

		data: Experience,

		/**
		 * @param {asd} - lol
		 */
		updateProfile: updateProfile.mutate
	};
};
