import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/providers/Authentication.jsx';
import { checkoutBucket as handleCheckoutBucket } from './api/stripe.js';

const useStripeCheckout = () => {
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const checkoutBucket = useMutation({
		mutationFn: async ({ data }) => handleCheckoutBucket(auth, data)
	});

	return { checkoutBucket: checkoutBucket.mutateAsync };
};

export default useStripeCheckout;
