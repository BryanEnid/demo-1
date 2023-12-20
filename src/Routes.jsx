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

export function Routes(props) {
	// TODO: Preload all icons

	const router = createBrowserRouter([
		{
			path: '/',
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
			path: '/:id',
			element: <Profile />,
			children: [
				{ path: '', element: <Buckets /> },
				{ path: 'audio', element: <>audio</> },
				{ path: 'buckets', element: <Buckets /> },
				{ path: 'experience', element: <Experience /> },
				{ path: 'recommends', element: <>recommends</> },
				{ path: 'quests', element: <>quests</> },
				{ path: 'website', element: <>website</> },

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
				{ path: 'open-roles', element: <>Open Roles</> },
				{ path: 'resources', element: <>Resources</> },
				{ path: 'teams', element: <>Teams</> },
				{ path: 'training', element: <>Training</> },
				{ path: 'website', element: <>Website</> }
			]
		},
		{
			path: '/notfound',
			element: <>not found</>
		}
	]);

	return <RouterProvider router={router} />;
}
