import React from 'react';
import { useNavigate, Outlet, useLocation, useMatches } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import { Icon } from '@iconify/react';
import { SideBar } from '@/components/NavigationBar/SideBar';
import { NavBar } from '@/components/NavigationBar/NavBar';

// Screens
import { Typography } from '@/chadcn/Typography';
import { Button } from '@/chadcn/Button';
import { Separator } from '@/chadcn/Separator.jsx';
import { useProfile } from '@/hooks/useProfile';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAuth } from '@/providers/Authentication.jsx';
import PreviewBucket from '@/components/PreviewBucket';
import BucketInfo from '@/components/BucketInfo.jsx';

// TODO: dynamic url
import orgBgImg from '@/assets/image-org-bg.png';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/chadcn/Carousel';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

function NavOption(props) {
	const { title, href, buttonProps: { activeClassName, ...buttonProps } = {}, onClick } = props;
	const width = 'w-full';

	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isMobile } = useMobile();

	const isActive = pathname.slice(1).includes(href || title.toLowerCase());
	const className = `${buttonProps.className || ''} ${isActive && activeClassName ? activeClassName : ''}`;

	const handleClick = () => {
		if (typeof onClick === 'function') {
			onClick(props);
		}

		navigate(href || title.toLowerCase());
	};

	const Wrapper = isMobile
		? (props) => <CarouselItem className={cn('basis-1/2', width)} {...props} />
		: (props) => <React.Fragment {...props} />;

	return (
		<Wrapper>
			<Button
				variant={isActive ? 'secondary' : 'ghost'}
				onClick={handleClick}
				{...buttonProps}
				className={cn(className, width)}
			>
				<Typography variant="large" className={cn('capitalize truncate', width)}>
					{title}
				</Typography>
			</Button>
		</Wrapper>
	);
}

export function Profile() {
	// Hooks
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { data: profile, isUserProfile, isLoading: profileLoading } = useProfile();
	const { user, isLoading: authLoading } = useAuth();
	const { isMobile } = useMobile();

	const pathParts = pathname.slice(1).split('/');
	const organizationMenu = [
		{
			label: 'About',
			subLinks: [
				{ label: 'Mission, Vision, & Values', href: 'about/mission' },
				{ label: 'Culture', href: 'about/culture' },
				{ label: 'People', href: 'about/people' },
				{ label: 'Resources', href: 'about/resources' },
				{ label: 'Website', href: 'about/website' }
			]
		},
		{ label: 'Buckets', subLinks: [] },
		{ label: 'Open Roles', href: 'open-roles', subLinks: [] },
		{ label: 'Resources', subLinks: [] },
		{ label: 'Teams', subLinks: [] },
		{ label: 'Training', subLinks: [] },
		{ label: 'Website', subLinks: [] }
	];

	// State
	const [orgSubButtons, setOrgSubButtons] = React.useState(
		organizationMenu.find(({ label, href }) => pathParts.includes(href || label.toLowerCase()))?.subLinks || []
	);
	const [bucketInfoOpen, setBucketInfoOpen] = React.useState(false);
	const [show, setShow] = React.useState(false);
	const [bucketData, setBucketData] = React.useState(null);

	const [username] = pathParts;

	// TODO: check if this is Organization
	const isOrganization = false;

	React.useEffect(() => {
		setBucketInfoOpen(null);
	}, [profile?.id]);

	React.useEffect(() => {
		(() => {
			if (username === 'profile' && user) return navigate(`/${user.uid}`);

			// ! This doesn't longer work
			if (!profile?.uid && !profileLoading && !authLoading) return navigate('/notfound');
		})();
	}, [profile, profileLoading, authLoading]);

	if (!profile?.uid) return <></>;

	const handleCreateBucket = (data) => {
		navigate(`/${user.uid}/buckets`);
		setShow(true);
		setBucketData(data);
	};

	const handleCancel = () => {
		setShow(false);
		setBucketData(null);
	};

	return (
		<div>
			<SideBar />

			<NavBar createBucket={handleCreateBucket} />

			<div className="p-5 overflow-x-hidden">
				<div className="flex">
					<div className="w-full">
						{isOrganization ? (
							/* TODO: dynamic background image */
							<div
								className={`pt-[50px] mb-12 bg-center bg-top bg-no-repeat bg-[length:auto_400px]`}
								style={{ backgroundImage: `url('${orgBgImg}')` }}
							>
								<div className="container">
									<div className="rounded-[74px] p-11 pb-2 bg-gradient-to-b from-[#000C1EAA] from-0% via-[#000C1EDD] via-60% to-[#000C1EFF] to-100% backdrop-blur-[115px]">
										<div className="flex flex-col items-center">
											<img src={profile?.photoURL} className="rounded-full object-cover aspect-square w-48 mb-8" />
											<Typography variant="h2" className="text-white/[.96]">
												NASA
											</Typography>
											<Typography variant="h3" className="text-white/[.96] font-normal leading-normal mb-1">
												National Aeronautics and Space Administration
											</Typography>
											<Typography variant="blockquote" className="text-white leading-snug !border-l-0 !pl-0">
												“For the Benefit of All. We make Air and Space available for everyone.”
											</Typography>
										</div>

										<div className="flex mt-8 mb-10 gap-4 justify-center">
											{organizationMenu.map((item) => (
												<NavOption
													key={item.label}
													title={item.label}
													href={item.href}
													buttonProps={{
														variant: 'outline',
														activeClassName: 'bg-[#0066ff]/[.7]',
														className:
															'rounded-[10px] text-white/[.96] border-2 border-white bg-gradient-to-b from-[#4b93ff]/[0] from-0% to-[#005de8]/[0] to-100% hover:from-[#4b93ff]/[.7] hover:to-[#005de8]/[.7]'
													}}
													onClick={() => setOrgSubButtons(item.subLinks || [])}
												/>
											))}
										</div>
										{!!orgSubButtons?.length && (
											<>
												<div className="w-[60%] mx-auto">
													<Separator />
												</div>
												<div className="flex mt-8 mb-10 gap-4 justify-center">
													{orgSubButtons.map((subLink) => (
														<NavOption
															key={subLink.label}
															title={subLink.label}
															href={subLink.href}
															buttonProps={{
																activeClassName: 'font-bold underline',
																variant: 'link',
																className: 'text-[#FCFCFC]'
															}}
														/>
													))}
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						) : (
							<div className="container">
								<div>
									{/* Header */}
									<div className="flex flex-col items-center gap-3">
										{/* <img src={profile?.photoURL} className="rounded-full object-cover aspect-square xl:w-48 md:w-32" /> */}
										<img src={profile?.photoURL} className="rounded-full object-cover aspect-square w-36 2xl:w-48" />
										<Typography variant="h3" className="mt-6">
											{profile?.name}
										</Typography>
										<Typography variant="blockquote" className="border-0">
											“If you want to find the secrets of the universe, think in terms of energy, frequency and
											vibration.”
										</Typography>
									</div>

									<div className="flex flex-row justify-center my-8">
										<div className="w-full">
											<Carousel
												className="relative w-full"
												opts={{ align: 'start', containScroll: 'keepSnaps', dragFree: false }}
											>
												<div className="sm:overflow-visible">
													<CarouselContent className="mx-10 md:flex md:gap-4 md:justify-center">
														{/* <NavOption title="Audio" /> */}
														<NavOption title="Buckets" />
														<NavOption title="Experience" />
														<NavOption title="Recommends" />
														<NavOption title="Quests" />
														{/* <NavOption title="Website" /> */}
													</CarouselContent>

													{isMobile && (
														<>
															<CarouselPrevious variant="secondary" className="absolute left-0" />
															<CarouselNext variant="secondary" className="absolute right-0" />
														</>
													)}
												</div>
											</Carousel>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="container pb-28 sm:pb-0">
							{/* Screens */}
							<Outlet
								context={[
									{
										isUserProfile,
										createBucket: handleCreateBucket,
										bucketInfoOpen,
										showBucketInfo: setBucketInfoOpen
									}
								]}
							/>

							<PreviewBucket editMode show={show} data={bucketData} onClose={handleCancel} />
						</div>
					</div>

					{!!bucketInfoOpen && (
						<motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }} className="shrink-0">
							<div className="fixed top-0 sm:top-[80px] right-0 overflow-auto w-[300px] h-dvh">
								<BucketInfo
									bucket={bucketInfoOpen}
									profile={profile}
									canEdit={isUserProfile}
									isUserProfile={isUserProfile}
									onClose={() => setBucketInfoOpen(null)}
								/>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}
