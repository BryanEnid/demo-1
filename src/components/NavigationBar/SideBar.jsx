import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { cn } from '@/lib/utils';
import { ObserveIcon } from '@/components/ObserveIcon';
import CreateOrganizationModal from '@/components/CreateOrganizationModal.jsx';
import { Separator } from '@/chadcn/Separator';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/chadcn/Tooltip.jsx';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';
import { useMobile } from '@/hooks/useMobile';
import useOrganizations from '@/hooks/useOrganizations.js';

export function SideBar() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user, isLoading } = useAuthenticationProviders();
	const { isMobile } = useMobile();

	const [createOrgModal, setCreateOrgModal] = React.useState(false);

	const { list, isLoading: isOrgLoading, createOrganization } = useOrganizations({ fullList: false });

	const closeCreateOrgModal = () => {
		setCreateOrgModal(false);
	};

	if (isMobile) return <></>;

	return (
		<aside className="z-20 inline-flex items-center flex-col h-dvh p-4 text-gray-400 fixed top-0 left-0 border-r-[1px] bg-white shadow-md">
			<button onClick={() => navigate('/')}>
				<ObserveIcon size={45} rounded />
			</button>

			<div className="inline-flex flex-col items-center gap-7 mt-10">
				<button
					onClick={() => navigate(`/${user?.uid}`)}
					className={cn(
						'transition ease-in-out hover:text-primary hover:scale-105  rounded-full p-2 shadow-xl',
						user?.uid === pathname.split('/')[1] && 'text-primary'
					)}
				>
					<Icon width={30} icon="iconamoon:profile" />
				</button>

				<button
					onClick={() => navigate('/users')}
					className="transition ease-in-out hover:text-primary hover:scale-105"
				>
					<Icon width={35} icon="ion:compass-outline" />
				</button>
				<button
					onClick={() => navigate('/organizations')}
					className={cn(
						'transition ease-in-out hover:text-primary hover:scale-105',
						pathname.split('/')[1] === 'organizations' && 'text-primary'
					)}
				>
					<Icon width={35} icon="octicon:organization-24" />
				</button>
				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={30} icon="ion:briefcase-outline" />
				</button>

				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={30} icon="ion:analytics" />
				</button>

				<Separator className="my-1" />

				{list.map(({ id, picture }) => (
					<button
						key={id}
						onClick={() => navigate(`/organizations/${id}`)}
						className="flex justify-center items-center w-[36px] h-[36px] transition ease-in-out hover:text-primary hover:scale-105"
					>
						<img src={picture} className="rounded-full object-cover aspect-square" />
					</button>
				))}

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								className="transition ease-in-out hover:text-primary hover:scale-105 rounded-full border-dashed border-[3px] p-1 border-gray-300"
								onClick={() => setCreateOrgModal(true)}
							>
								<Icon width={23} icon="ion:add" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="right">
							<p>Create Organization</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			{createOrgModal && (
				<CreateOrganizationModal
					open={createOrgModal}
					isLoading={isOrgLoading}
					onCreate={createOrganization}
					onClose={closeCreateOrgModal}
				/>
			)}
		</aside>
	);
}
