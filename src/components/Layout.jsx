import React from 'react';
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import LayoutProvider, { useLayout } from '@/providers/LayoutProvider.jsx';
import { useAuth } from '@/providers/Authentication.jsx';
import { SideBar } from '@/components/NavigationBar/SideBar.jsx';
import { NavBar } from '@/components/NavigationBar/NavBar.jsx';
import BucketInfo from '@/components/BucketInfo.jsx';
import PreviewBucket from '@/components/PreviewBucket/index.jsx';

const LayoutView = () => {
	const { pathname } = useLocation();
	const { user, isLoading } = useAuth();
	const {
		bucketInfoOpen,
		bucketCreateOpen,
		bucketData,
		showCreateBucketModal,
		closeCreateBucketModal,
		closeBucketInfo
	} = useLayout();

	if (isLoading) {
		return <></>;
	}

	if (pathname === '/') {
		return <Navigate to={user?.uid ? `/${user?.uid}` : '/sign-in'} />;
	}

	return (
		<div>
			<SideBar />
			<NavBar createBucket={showCreateBucketModal} />

			<div className="p-5 sm:p-0 overflow-x-hidden">
				{/*  */}
				<div className="flex">
					<div className="w-full">
						<Outlet />
						<PreviewBucket editMode show={bucketCreateOpen} data={bucketData} onClose={closeCreateBucketModal} />
					</div>

					{!!bucketInfoOpen && (
						<motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }} className="shrink-0">
							<div className="fixed top-0 sm:top-[64px] bottom-0 right-0 overflow-auto w-[300px]">
								<BucketInfo
									bucket={bucketInfoOpen}
									canEdit={bucketInfoOpen.creatorId === user.id}
									isUserProfile={bucketInfoOpen.creatorId === user.id}
									onClose={closeBucketInfo}
								/>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

const Layout = () => (
	<LayoutProvider>
		<LayoutView />
	</LayoutProvider>
);

export default Layout;
