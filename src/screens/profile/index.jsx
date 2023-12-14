import React from 'react';
import { useNavigate, Outlet, useLocation, useMatches } from 'react-router-dom';

// Components
import { Icon } from '@iconify/react';
import { SideBar } from '@/components/SideBar';
import { NavBar } from '@/components/NavBar';

// Screens
import { Typography } from '@/chadcn/Typography';
import { Button } from '@/chadcn/Button';
import { useProfile } from '@/hooks/useProfile';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAuth } from '@/providers/Authentication.jsx';

function NavOption({ title }) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [, subscreen] = pathname.slice(1).split('/');

	return (
		<Button
			variant={subscreen === title.toLowerCase() ? 'secondary' : 'ghost'}
			onClick={() => navigate(title.toLowerCase())}
		>
			<Typography variant="large" className="capitalize">
				{title}
			</Typography>
		</Button>
	);
}

export function Profile() {
	// Hooks
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { data: profile, isLoading: profileLoading } = useProfile();
	const { user, isLoading: authLoading } = useAuth();

	// State
	const [username] = pathname.slice(1).split('/');

	React.useEffect(() => {
		(() => {
			if (username === 'profile' && user) return navigate(`/${user.uid}`);
			if (!profile?.uid && !profileLoading && !authLoading) return navigate('/notfound');
		})();
	}, [profile, profileLoading, authLoading]);

	if (!profile?.uid) return <></>;

	return (
		<div className="container">
			{/* Overlay */}
			<NavBar />

			<SideBar />

			<div>
				{/* Header */}
				<div className="flex flex-col items-center gap-8">
					<img src={profile?.photoURL} className="rounded-full object-cover aspect-square w-48" />
					<Typography variant="h2">{profile?.name}</Typography>
					<Typography variant="blockquote">
						“If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.”
					</Typography>
				</div>

				<div className="flex mt-8 mb-20 gap-4 justify-center">
					<NavOption title="Audio" />
					<NavOption title="Buckets" />
					<NavOption title="Experience" />
					<NavOption title="Recommends" />
					<NavOption title="Quests" />
					<NavOption title="Website" />
				</div>
			</div>

			{/* Screens */}
			<Outlet />
		</div>
	);
}
