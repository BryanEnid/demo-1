import React from 'react';
import { Icon } from '@iconify/react';
import { ObserveIcon } from '@/components/ObserveIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';
import { useMobile } from '@/hooks/useMobile';
import { Button } from '@/chadcn/Button';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/chadcn/DropDown';
import { Typography } from '@/chadcn/Typography';
import { useAuth } from '@/providers/Authentication';

const CreateMenu = ({ createBucket, children }) => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<>
			{user && (
				<DropdownMenu>
					<DropdownMenuTrigger>{children}</DropdownMenuTrigger>

					<DropdownMenuContent className="w-56">
						<DropdownMenuItem onClick={() => createBucket()}>
							<Icon icon="fluent:album-add-24-regular" className="pr-1 text-3xl" />
							Create a bucket
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => navigate('/capture')}>
							<Icon icon="pepicons-pop:camera" className="pr-1 text-3xl" />
							Capture
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Icon icon="fluent:live-24-filled" className="pr-1 text-3xl" />
							Go Live
						</DropdownMenuItem>

						{/* <DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Icon icon="ic:round-upload" className="pr-1 text-3xl" /> Upload
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>
										<Icon icon="material-symbols:video-file" className="pr-1 text-3xl" />
										Upload a .MP4
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Icon icon="fluent:video-360-20-filled" className="pr-1 text-3xl" />
										Upload a 360 Video (.MP4)
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub> */}

						<DropdownMenuSeparator />

						<DropdownMenuItem>
							<Icon icon="ri:more-fill" className="pr-1 text-3xl" />
							More
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
};

export const MobileNavBar = ({ createBucket }) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user, isLoading } = useAuthenticationProviders();

	return (
		<>
			<div className="w-full flex justify-center fixed bottom-12 z-10">
				<div className="flex justify-between items-center w-[90%] bg-gray-100 p-3 rounded-full ">
					<Button variant="ghost" onClick={() => navigate(`/${user?.uid}`)} className="text-primary">
						<Icon width={30} icon="iconamoon:profile" />
					</Button>

					<Button variant="ghost" onClick={() => navigate('/users')} className="text-primary">
						<Icon width={35} icon="ion:compass-outline" />
					</Button>

					<Button variant="ghost">
						<CreateMenu createBucket={createBucket}>
							<ObserveIcon rounded size={70} />
						</CreateMenu>
					</Button>

					<Button variant="ghost" className="text-primary ">
						<Icon width={30} icon="ion:briefcase-outline" />
					</Button>

					<Button variant="ghost" className="text-primary ">
						<Icon width={30} icon="ion:analytics" />
					</Button>
				</div>
			</div>
		</>
	);
};
