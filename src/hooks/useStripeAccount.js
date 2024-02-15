import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/providers/Authentication.jsx';
import {
	getStripeAccount,
	createStripeAccount as handleCreateStripeAccount,
	updateStripeAccount as handleUpdateStripeAccount,
	uploadStripeAccountDocs as handleUploadStripeAccountDocs
} from './api/stripe.js';

const COLLECTION_NAME = 'StripeAccount';

const useStripeAccount = () => {
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, user?.id, auth.authToken];

	const { data, isLoading } = useQuery({
		queryKey,
		gcTime: Infinity,
		enabled: Boolean(user?.id),
		queryFn: () => getStripeAccount(auth)
	});

	const createAccountMutation = useMutation({
		mutationFn: async ({ data }) => handleCreateStripeAccount(auth, data)
	});

	const updateAccountMutation = useMutation({
		mutationFn: async ({ data }) => handleUpdateStripeAccount(auth, data)
	});

	const uploadAccountDocsMutation = useMutation({
		mutationFn: async ({ data }) => handleUploadStripeAccountDocs(auth, data)
	});

	const createAccount = async (payload) => {
		const { verificationFileFront, verificationFileBack, verificationFileAdditionalFront, ...data } = payload;
		try {
			await createAccountMutation.mutateAsync({ data });

			const fd = new FormData();
			verificationFileFront && fd.append('verificationFileFront', verificationFileFront);
			verificationFileBack && fd.append('verificationFileBack', verificationFileBack);
			verificationFileAdditionalFront && fd.append('verificationFileAdditionalFront', verificationFileAdditionalFront);
			await uploadAccountDocsMutation.mutateAsync({ data: fd });
			await queryClient.invalidateQueries({ queryKey });
		} catch (e) {
			console.log(e);
		}
	};

	const updateAccount = async (payload) => {
		const { verificationFileFront, verificationFileBack, verificationFileAdditionalFront, ...data } = payload;
		try {
			await updateAccountMutation.mutateAsync({ data });

			if (verificationFileFront || verificationFileBack || verificationFileAdditionalFront) {
				const fd = new FormData();
				verificationFileFront && fd.append('verificationFileFront', verificationFileFront);
				verificationFileBack && fd.append('verificationFileBack', verificationFileBack);
				verificationFileAdditionalFront &&
					fd.append('verificationFileAdditionalFront', verificationFileAdditionalFront);
				await uploadAccountDocsMutation.mutateAsync({ data: fd });
			}
			await queryClient.invalidateQueries({ queryKey });
		} catch (e) {
			console.log(e);
		}
	};

	return {
		data: data || {},
		isLoading:
			isLoading ||
			createAccountMutation.isPending ||
			updateAccountMutation.isPending ||
			uploadAccountDocsMutation.isPending,
		createAccount,
		updateAccount
	};
};

export default useStripeAccount;
