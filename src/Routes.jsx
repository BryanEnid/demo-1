import * as React from 'react';
import { createBrowserRouter, redirect, RouterProvider, Navigate, Outlet } from 'react-router-dom';

// Screens
import { Landpage } from './screens/landpage/Landpage';
import { CaptureScreen } from './screens/capture/Capture.jsx';

import { Profile } from './screens/profile';
import { Buckets } from './screens/profile/buckets';
import { Experience } from './screens/profile/experience/Experience';
import { Preview } from './screens/video_preview/Preview';
import { SignIn } from './screens/sign_in/SignIn';
import Quests from './screens/profile/quests/index';
import Recommends from '@/screens/profile/recommends';
import Bills from '@/screens/bills/index.jsx';
import Settings from '@/screens/settings/index.jsx';
import { UsersScreen } from './screens/users/Users';
import { OrganizationsScreen } from './screens/organizations';
import Layout from '@/components/Layout.jsx';
import { Redirects } from './screens/redirects/Redirects';
import { Page404 } from './screens/404';

export function Routes(props) {
	// TODO: Preload all icons

	const router = createBrowserRouter([
		{
			path: '/sign-in',
			element: <SignIn />
		},
		{
			path: '/capture/*',
			element: <CaptureScreen />
		},
		{
			path: '/capture/preview',
			element: <Preview />
		},
		{
			path: '/',
			element: <Layout />,
			children: [
				{
					// ! This is temporally - Only for DEV
					path: '/users/*',
					element: <UsersScreen />
				},
				{
					path: '/organizations',
					element: <Outlet />,
					children: [
						{ path: '', element: <OrganizationsScreen /> },
						{
							path: ':id',
							element: <Profile />,
							children: [
								{
									path: 'about',
									element: <Outlet />,
									children: [
										{ path: '', element: <Navigate to="mission" replace /> },
										{ path: 'mission', element: <>Mission, Vision, & Values</> },
										{ path: 'culture', element: <>Culture</> },
										{ path: 'people', element: <>People</> },
										{ path: 'resources', element: <>Resources</> },
										{ path: 'website', element: <>Website</> },
										{ path: '*', element: <Navigate to="mission" replace /> }
									]
								},
								{ path: 'buckets', element: <Buckets /> },
								{ path: 'open-roles', element: <>Open Roles</> },
								{ path: 'resources', element: <>Resources</> },
								{ path: 'teams', element: <>Teams</> },
								{ path: 'training', element: <>Training</> },
								{ path: 'website', element: <>Website</> },
								{ path: '', element: <Navigate to="buckets" replace /> }
							]
						}
					]
				},
				{
					path: '/:id',
					element: <Profile />,
					children: [
						{ path: '', element: <Buckets /> },
						{ path: 'audio', element: <>audio</> },
						{ path: 'buckets', element: <Buckets /> },
						{ path: 'experience', element: <Experience /> },
						{ path: 'recommends', element: <Recommends /> },
						{ path: 'quests', element: <Quests /> },
						{ path: 'website', element: <>website</> }
					]
				},
				{
					path: '/:id/bills',
					element: <Bills />
				},
				{
					path: '/:id/settings',
					element: <Settings />
				}
			]
		},
		{
			path: '/redirects',
			element: <Redirects />
		},
		{
			path: '/404',
			element: <Page404 />
		}
	]);

	return <RouterProvider router={router} />;
}
