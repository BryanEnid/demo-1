import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/providers/Authentication.jsx';
import {
	createOrganization as handleCreateOrganization,
	getOrganization as handleGetOrganization,
	updateOrganization as handleUpdateOrganization,
	uploadOrgPicture as handleUploadOrgPicture,
	uploadOrgBgPicture as handleUploadOrgBgPicture,
	deleteOrganization as handleDeleteOrganization,
	getOrganizations as handleGetOrganizations
} from './api/organizations.js';

const COLLECTION_NAME = 'Organizations';

const useOrganizations = ({ id, search, fullList } = {}) => {
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, auth.authToken];

	const listParams = {
		...(search && { search }),
		...(typeof fullList === 'boolean' && { fullList })
	};
	const { data: dataList, isLoading: isListLoading } = useQuery({
		gcTime: Infinity,
		queryKey: [...queryKey, search, fullList],
		queryFn: async () => handleGetOrganizations(auth, listParams),
		enabled: true
	});

	const { data, isLoading: isDataLoading } = useQuery({
		gcTime: Infinity,
		queryKey: [...queryKey, id],
		queryFn: async () => (id ? handleGetOrganization(auth, id) : null),
		enabled: Boolean(id)
	});

	const { mutateAsync: create, isPending: isCreateLoading } = useMutation({
		mutationFn: ({ data }) => handleCreateOrganization(auth, data)
	});

	const { mutateAsync: uploadOrgPicture, isPending: isUploadLoading } = useMutation({
		mutationFn: ({ data, id }) => handleUploadOrgPicture(auth, id, data)
	});

	const { mutateAsync: uploadOrgBgPicture, isPending: isBgUploadLoading } = useMutation({
		mutationFn: ({ data, id }) => handleUploadOrgBgPicture(auth, id, data)
	});

	const { mutateAsync: update, isPending: isUpdateLoading } = useMutation({
		mutationFn: ({ data }) => handleUpdateOrganization(auth, data.id, data)
	});

	const { mutateAsync: deleteOrganization, isPending: isDeleteLoading } = useMutation({
		mutationFn: ({ id }) => handleDeleteOrganization(auth, id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});

	const createOrganization = async ({ picture, ...data }) => {
		try {
			const { id } = await create({ data });
			await uploadOrgPicture({ id, data: picture });

			await queryClient.invalidateQueries({ queryKey });
		} catch (err) {
			console.log(err);
		}
	};

	const updateOrganization = async ({ picture, bgPicture, ...data }) => {
		try {
			await update({ id: data.id, data });

			if (picture instanceof FormData) {
				await uploadOrgPicture({ id: data.id, data: picture });
			}
			if (bgPicture instanceof FormData) {
				await uploadOrgBgPicture({ id: data.id, data: bgPicture });
			}

			await queryClient.invalidateQueries({ queryKey });
		} catch (e) {
			console.log(e);
		}
	};

	return {
		selected: data,
		list: dataList || [],
		isLoading:
			isDataLoading ||
			isListLoading ||
			isCreateLoading ||
			isUpdateLoading ||
			isDeleteLoading ||
			isUploadLoading ||
			isBgUploadLoading,
		createOrganization,
		updateOrganization,
		deleteOrganization
	};
};

export default useOrganizations;
