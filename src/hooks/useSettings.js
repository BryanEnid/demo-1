import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/providers/Authentication.jsx';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings, handleUpdate, handleUpload } from './api/settings.js';

const COLLECTION_NAME = 'Settings';

const useSettings = () => {
	const { id } = useParams();
	// id:  93ef0bf2-d8ac-4508-b5a9-956335c4ca6e

	const { pathname } = useLocation();
	// pathname:  /93ef0bf2-d8ac-4508-b5a9-956335c4ca6e/settings

	const { user, ...auth } = useAuth();
	// id: 65f1172dd5a7732d8037d161
	// uid:  93ef0bf2-d8ac-4508-b5a9-956335c4ca6e
	// username:  93ef0bf2-d8ac-4508-b5a9-956335c4ca6e

	const queryClient = useQueryClient();
	const queryKey = [COLLECTION_NAME, auth.authToken];

	// GET SETTINGS
	const { data: settings, isLoading: settingsLoading } = useQuery({
		gcTime: Infinity,
		queryKey: queryKey,
		queryFn: () => getSettings(auth),
		enabled: true
	});

	const { mutateAsync: create } = useMutation({
		mutationFn: (data) => handleUpdate(auth, data)
	});

	const { mutateAsync: upload } = useMutation({
		mutationFn: (image) => handleUpload(auth, image)
	});

	const uploadUserProfilePicture = async (image) => {
		try {
			await upload(image);
			await queryClient.invalidateQueries({ queryKey });
		} catch (error) {
			console.error(error);
		}
	};

	const updateSettings = async (data) => {
		try {
			await create(data);
			await queryClient.invalidateQueries({ queryKey });
		} catch (error) {
			console.error(error);
		}
	};

	// TODO: delete

	return {
		data: settings || [],
		updateSettings,
		uploadUserProfilePicture,
		isLoading: settingsLoading || false
	};
};

export default useSettings;
