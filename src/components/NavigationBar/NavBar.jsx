import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/chadcn/Button';
import { Modal } from '../Modal';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/chadcn/DropDown';
import { Typography } from '@/chadcn/Typography';
import { useAuth } from '@/providers/Authentication';
import { useMobile } from '@/hooks/useMobile';
import { MobileNavBar } from './MobileNavBar';
import { Feedback } from '../Feedback';

export function NavBar({ createBucket: handleCreateBucket }) {
	// Hooks
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const { isMobile } = useMobile();

	// Refs
	const inputRef = React.useRef();

	const [showFeedback, setShowFeedback] = React.useState(false);

	const handleLogOut = () => {
		logout().then(() => navigate('/sign-in'));
	};

	const createBucket = () => {
		handleCreateBucket();
		navigate(`/${user.uid}/buckets`);
	};

	if (isMobile) return <MobileNavBar createBucket={createBucket} />;

	return (
		<>
			<div className="h-20 w-full" />
			{/*xl:h-24*/}
			{/* <nav className="xl:h-20 xl:p-8 flex fixed z-10 top-0 left-[96px] right-0 flex-row  items-center justify-end  gap-8 text-gray-600  bg-red-500"> */}
			<nav className="flex fixed z-10 top-0 left-0 right-0 flex-row items-center justify-end p-3 gap-2 text-gray-600 bg-white">
				{/* <button>Career portal</button> */}
				{/* <button>Explore companies</button> */}
				{/* <button>Observatory</button> */}

				{/* Create */}
				{user && (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button iconBegin={<Icon icon="majesticons:video-line" className="pr-1 text-2xl" />}>
								<Typography variant="p" className="text-md">
									Create
								</Typography>
							</Button>
						</DropdownMenuTrigger>

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

							<DropdownMenuSub>
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
							</DropdownMenuSub>

							<DropdownMenuSeparator />

							<DropdownMenuItem>
								<Icon icon="ri:more-fill" className="pr-1 text-3xl" />
								More
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				{/* Profile */}
				{!user && (
					<>
						<Button variant="ghost" className="text-primary" onClick={() => setShowFeedback(true)}>
							Leave your feedback
						</Button>
						<Button onClick={() => navigate('/')}>Log In</Button>
					</>
				)}

				{user && (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								iconEnd={<Icon icon="iconamoon:arrow-down-2-duotone" height={22} />}
								variant="link"
								className="p-0 m-0"
							>
								{user?.displayName}
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-56">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => navigate(`/${user.uid}`)}>
									Profile
									<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate(`/${user.uid}/bills`)}>
									Billing
									<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate(`/${user.uid}/settings`)}>
									Settings
									<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
								</DropdownMenuItem>
								{/*<DropdownMenuItem>*/}
								{/*	Keyboard shortcuts*/}
								{/*	<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>*/}
								{/*</DropdownMenuItem>*/}
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								{/*<DropdownMenuItem>Team</DropdownMenuItem>*/}
								{/*<DropdownMenuSub>*/}
								{/*	<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>*/}
								{/*	<DropdownMenuPortal>*/}
								{/*		<DropdownMenuSubContent>*/}
								{/*			<DropdownMenuItem>Email</DropdownMenuItem>*/}
								{/*			<DropdownMenuItem>Message</DropdownMenuItem>*/}
								{/*			<DropdownMenuSeparator />*/}
								{/*			<DropdownMenuItem>More...</DropdownMenuItem>*/}
								{/*		</DropdownMenuSubContent>*/}
								{/*	</DropdownMenuPortal>*/}
								{/*</DropdownMenuSub>*/}
								<DropdownMenuItem>
									New Organization
									<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setShowFeedback(true)}>Feedback</DropdownMenuItem>
							<DropdownMenuItem disabled>API</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogOut}>
								Log out
								<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</nav>

			<Feedback show={showFeedback} onClose={() => setShowFeedback(false)} />
		</>
	);
}
