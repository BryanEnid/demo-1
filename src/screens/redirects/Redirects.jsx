import React from 'react';
import { useLinkedInAuth } from '@/hooks/useLinkedInAuth';
import { useQueryParams } from '@/hooks/useQueryParams';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/providers/Authentication';

export const Redirects = () => {
	const params = useQueryParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (user) navigate('/profile');
	}, [user]);

	return <></>;

	// if (params.provider === 'linkedin')
	// 	return (
	// 		<pre>
	// 			<code>{JSON.stringify(params, null, 2)}</code>
	// 		</pre>
	// 	);

	// return (
	// 	<pre>
	// 		<code>{JSON.stringify(params, null, 2)}</code>
	// 	</pre>
	// );
};
