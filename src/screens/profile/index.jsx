import React from 'react';
import { useNavigate, Outlet, useLocation, useMatches, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/Authentication.jsx';
import { useLayout } from '@/providers/LayoutProvider.jsx';
import { useProfile } from '@/hooks/useProfile';
import { useMobile } from '@/hooks/useMobile';
import useOrganizations from '@/hooks/useOrganizations.js';
import { Input } from '@/chadcn/Input';
// Components
import { Icon } from '@iconify/react';
import { Typography } from '@/chadcn/Typography';
import { Button } from '@/chadcn/Button';
import { Separator } from '@/chadcn/Separator.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/chadcn/Carousel';
import { Image } from '@/components/Image';
import useSettings from '@/hooks/useSettings';

function NavOption(props) {
	const { title, href, textClassName = '', buttonProps: { activeClassName, ...buttonProps } = {}, onClick } = props;
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
				<Typography variant="large" className={cn('capitalize truncate', width, textClassName)}>
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
	const { data: profile, isUserProfile, isLoading: profileLoading, isOrganization } = useProfile();
	const [isDragOver, setIsDragOver] = React.useState(false);

	const { data: settings, uploadUserProfilePicture, updateSettings } = useSettings();
	const [userIMG, setUserIMG] = React.useState('/src/assets/observe_logo_512_og.png');
	const [headline, setHeadline] = React.useState('');
	const [edit, setEdit] = React.useState(false);
	const quoteRef = React.useRef();

	const { updateOrganization } = useOrganizations();
	const { user, isLoading: authLoading } = useAuth();
	const { isMobile } = useMobile();
	const { closeBucketInfo } = useLayout();
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
	const [username] = pathParts;
	const fileInpRef = React.useRef();
	const sampleQuote =
		'If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.';

	React.useEffect(() => {
		if (quoteRef.current) {
			quoteRef.current.focus();
		}
	}, [edit]);
	React.useEffect(() => {
		// ! Temporary settings check/creation - TODO: create user settings when user profile is created
		if (settings.length === 0) {
			updateSettings({
				name: user.name,
				email: user.email,
				headline: sampleQuote
			});
		}
		if (settings?.headline) {
			setHeadline(settings?.headline);
		}
		if (settings.image) {
			setUserIMG(settings?.image || profile?.photoURL);
		}
	}, [profile?.photoURL, settings?.image, settings?.headline]);
	React.useEffect(() => {
		closeBucketInfo();
	}, [profile?.id]);

	React.useEffect(() => {
		(() => {
			if (username === 'profile' && user) return navigate(`/${user.uid}`);
			if (!(profile?.uid || profile?.id) && !profileLoading && !authLoading) return navigate(`/404?route=${pathname}`);
		})();
	}, [profile, profileLoading, authLoading]);

	if (!profile?.uid && !profile?.id) return <></>;

	const handleFilesChange = (e) => {
		const file = e.target.files[0];
		if (!file || !file.type.startsWith('image/')) return alert('Please drop a valid image files.');

		const bgPicture = new FormData();
		bgPicture.append('picture', file);
		updateOrganization({ ...profile, bgPicture });
	};
	const handleUpload = async (image) => {
		if (!image) return;
		const fd = new FormData();
		fd.append('image', image.file);
		try {
			await uploadUserProfilePicture(fd);
		} catch (error) {
			console.log('onSubmitImage error: ', error);
		}
	};
	const handleChange = (e) => {
		setUserIMG(e.target.value);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		const value = { file, url: URL.createObjectURL(file) };
		// setValues((val) => ({ ...val, image: value }));
		setUserIMG(value.url);
		handleUpload(value);
	};

	const openFileExplorer = () => {
		fileInpRef.current?.click?.();
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};
	const handleDragLeave = () => {
		setIsDragOver(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		if (!e.dataTransfer.files.length > 0) return;
		const { files } = e.dataTransfer;
		const file = files[0];
		if (!file || !file.type.startsWith('image/')) return alert('Please drop a valid image files.');
		const value = { files, url: URL.createObjectURL(files) };
		handleChange({ target: { name: 'image', value } });
	};
	const handleHeadline = (e) => {
		e.preventDefault();
		setEdit(false);
		if (e.target.value === settings.headline) return;
		setHeadline(e.target.value);

		try {
			updateSettings({ headline: e.target.value });
		} catch (error) {
			setHeadline(settings?.headline || sampleQuote);
		}
	};

	return (
		<div>
			{isOrganization ? (
				/* TODO: dynamic background image */
				<div className="-mt-5 -mx-5 sm:mt-0 sm:mx-0 mb-12">
					<div
						className="sm:p-0 h-96 bg-center bg-cover bg-top bg-no-repeat bg-[length:auto_400px]"
						style={{ backgroundImage: `url('${profile?.bgPicture}')` }}
					/>
					<div className="container pt-5 px-1 sm:pt-0 sm:px-0 -mt-96 sm:-mt-80">
						<div className="relative rounded-md sm:rounded-lg lg:rounded-[74px] p-4 sm:p-11 pb-2 bg-gradient-to-b from-[#000C1EAA] from-0% via-[#000C1EDD] via-60% to-[#000C1EFF] to-100% backdrop-blur-[115px]">
							{isUserProfile && (
								<>
									<input
										type="file"
										className="hidden"
										accept="image/*"
										ref={fileInpRef}
										onChange={handleFilesChange}
									/>
									<DropdownMenu>
										<DropdownMenuTrigger className="absolute top-8 right-8 ">
											<Button variant="secondary" className="rounded-full p-1 w-[40px] h-[40px]">
												<Icon icon="bi:gear-fill" className="text-xl" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56">
											<DropdownMenuItem onClick={() => fileInpRef.current?.click?.()}>
												<Icon icon="lucide:upload" className="pr-1 text-xl" />
												Upload background image
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</>
							)}

							<div className="flex flex-col items-center">
								<Image src={profile?.picture} className="rounded-full object-cover aspect-square w-36 2xl:w-48 mb-8" />
								<Typography variant="h2" className="text-white/[.96]">
									{profile?.name}
								</Typography>
								<Typography variant="h3" className="text-center text-white/[.96] font-normal leading-normal mb-1">
									{profile?.tagline}
								</Typography>
								<Typography variant="blockquote" className="text-white leading-snug !border-l-0 !pl-0">
									“For the Benefit of All. We make Air and Space available for everyone.”
								</Typography>
							</div>

							<div className="mt-5 mb-5 sm:mt-8 sm:mb-10">
								<Carousel
									className="relative w-full"
									opts={{ align: 'start', containScroll: 'keepSnaps', dragFree: false }}
								>
									<div className="sm:overflow-visible">
										<CarouselContent className="mx-10 md:flex md:gap-4 md:justify-center">
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
							{!!orgSubButtons?.length && (
								<>
									<div className="w-[60%] mx-auto">
										<Separator />
									</div>
									<div className="mt-2 mb-5 sm:mt-8 sm:mb-0">
										<Carousel
											className="relative w-full"
											opts={{ align: 'start', containScroll: 'keepSnaps', dragFree: false }}
										>
											<div className="sm:overflow-visible">
												<CarouselContent className="mx-10 md:flex md:gap-4 md:justify-center">
													{orgSubButtons.map((subLink) => (
														<NavOption
															key={subLink.label}
															title={subLink.label}
															href={subLink.href}
															textClassName="!text-sm"
															buttonProps={{
																activeClassName: 'font-bold underline',
																variant: 'link',
																className: 'text-[#FCFCFC]'
															}}
														/>
													))}
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
								</>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="container">
					<div>
						{/* Profile Image, Name, Quote */}
						<div className="flex flex-col items-center gap-3">
							<div className="group relative">
								<input type="file" className="hidden" accept="image/*" ref={fileInpRef} onChange={handleImageChange} />
								<div
									onClick={openFileExplorer}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									style={{ transition: '0.5s' }}
								>
									<Image
										src={userIMG || settings?.image || profile?.image}
										className="rounded-full object-cover aspect-square w-36 2xl:w-48 hover:cursor-pointer hover:opacity-75"
										alt="Profile Image"
									/>
									<div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-0 transition-opacity duration-300 font-medium group-hover:opacity-100">
										<Icon
											icon="lucide:camera"
											className="text-black text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center "
										/>
									</div>
								</div>
							</div>
							<Typography variant="h3" className="mt-6">
								{settings?.name || profile?.name}
							</Typography>
							{edit ? (
								<Input
									type="text"
									className="border-b border-black p-2  text-center text-xl mb-2.5"
									value={headline || ''}
									onBlur={(e) => handleHeadline(e)}
									onChange={(e) => setHeadline(e.target.value)}
									onEnter={(e) => handleHeadline(e)}
									ref={quoteRef}
								/>
							) : (
								<Typography
									variant="blockquote"
									className="group border-b border-transparent p-2 text-center text-xl cursor-pointer duration-50"
									onClick={() => setEdit(true)}
								>
									"{headline || settings?.headline || sampleQuote}"
									<Icon
										icon="lucide:edit"
										className="ml-2 text-black inline font-xs font-thin cursor-pointer hover:text-primary opacity-0 group-hover:opacity-75 duration-50 hover:text-black "
									/>
								</Typography>
							)}
						</div>

						{/* Navbar (Buckets, Experience, Recommends, Quests) */}
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
							isOrganization
						}
					]}
				/>
			</div>
		</div>
	);
}
