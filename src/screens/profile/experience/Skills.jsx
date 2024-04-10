import { Button } from '@/chadcn/Button';
import { Card, CardHeader, CardTitle } from '@/chadcn/Card';
import { Input } from '@/chadcn/Input';
import { Typography } from '@/chadcn/Typography';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Icon } from '@iconify/react';
import _ from 'lodash';
import React from 'react';
import { useExperience } from './useExperience';
import { useProfile } from '@/hooks/useProfile';
import { ClearBitAttribution } from '@/components/ClearBitAttribution';
import { Image } from '@/components/Image';

const example = {
	label: 'React',
	iconUrl: '',
	iconCode: ':react:'
};

export const SkillsSection = ({ data }) => {
	// Hooks
	const { isUserProfile, data: profile } = useProfile();
	const { updateProfile } = useExperience();

	// State
	const [skills, setSkills] = React.useState([]);
	const [show, setShow] = React.useState(false);
	const [searchText, setSearch] = React.useState('');
	const [logos, setLogos] = React.useState([]);

	// Refs
	const searchRef = React.useRef();

	React.useEffect(() => {
		if (data) setSkills(data);
	}, [data]);

	const handleClose = (type) => {
		if (type === 'escape') return;

		clear();
		setShow(false);
	};

	const handleRemoveSkill = (label) => {
		const filteredItems = skills.filter((item) => item.label !== label);
		setSkills(filteredItems);
	};

	const handleSave = () => {
		const body = Object.values(skills);
		updateProfile({ body, id: profile.uid, section: 'skills' });

		clear();
		setShow(false);
	};

	const handleLogoSearch = async ({ target }) => {
		setSearch(target.value);
		if (target.value === '') return setLogos([]);

		const logoSuggestionAPI = new URL('https://autocomplete.clearbit.com/v1/companies/suggest');
		logoSuggestionAPI.searchParams.append('query', target.value);

		const res = await fetch(logoSuggestionAPI);
		const data = await res.json();
		setLogos(data);
	};

	const handleAddSkill = (label, item) => {
		if (!label.length) return;

		const body = { label, iconUrl: item?.logo ?? '' };

		setSkills((prev) => [...prev, body]);
		setLogos([]);
		setSearch('');
	};

	const clear = () => {
		setLogos([]);
	};

	if (!isUserProfile && !skills.length) return;

	return (
		<div>
			<div className="flex flex-row items-center mb-5 gap-2">
				<Typography variant="h2">Skills</Typography>

				{isUserProfile && (
					<button onClick={() => setShow(true)}>
						<Icon icon="clarity:edit-line" fontSize={30} className="mb-1 p-2" />
					</button>
				)}
			</div>

			<ConfirmDialog show={show} onClose={handleClose} onConfirm={handleSave} title="Add your skills">
				<div className="flex flex-col">
					<Input value={searchText} ref={searchRef} placeholder="Type your skill" onChange={handleLogoSearch} />
					<div className="relative w-full z-10">
						{!!logos.length && (
							<div
								className="border rounded-xl flex flex-col gap-1 p-2 w-full border-t-0 z-10"
								style={{ borderRadius: '0px 0px 0.75rem 0.75rem' }}
							>
								{logos.map((item) => {
									if (!item.logo) return;
									return (
										<Button
											key={item.name}
											variant="ghost"
											className="h-[50px] px-8 justify-start"
											onClick={() => handleAddSkill(searchText, item)}
										>
											<Image src={item.logo} className="aspect-square w-10 object-contain inline" />
											<Typography variant="p" className="px-3 inline">
												add "{item.name}" logo for {searchText} skill
											</Typography>
										</Button>
									);
								})}
								<Button
									variant="ghost"
									className="h-auto px-8 justify-start "
									onClick={() => handleAddSkill(searchText)}
								>
									<Typography variant="p" className="px-3 inline self-start text-start ">
										Add "{searchText}" without logo as skill
									</Typography>
								</Button>
							</div>
						)}
					</div>
					<ClearBitAttribution />
				</div>

				<div className="w-full flex flex-wrap gap-2">
					{skills.map(({ label, iconUrl }) => (
						<Button
							key={label}
							className="bg-gray-200 rounded-full cursor-default py-6"
							variant="ghost"
							iconBegin={
								iconUrl && <Image src={iconUrl} className="rounded-lg aspect-square h-7 object-contain inline" />
							}
							iconEnd={<Icon icon="tabler:x" onClick={() => handleRemoveSkill(label)} className="cursor-pointer" />}
						>
							{label}
						</Button>
					))}
				</div>
			</ConfirmDialog>

			{!data?.length && isUserProfile && (
				<div className="rounded-xl p-10 border-dashed border-2 border-primary flex flex-col text-center text-slate-500">
					Customize your profile by listing the talents and expertise that define you. A modal will pop up, allowing you
					to effortlessly manage and showcase your skills. Let your strengths shine!
					<Button variant="link" onClick={() => setShow(true)}>
						🌟 Click on this link to add your skills.
					</Button>
				</div>
			)}

			<div className="grid grid-cols-3 md:grid-cols-5 gap-5 text-center">
				{data?.map(({ id, label, iconUrl }) => (
					<Card key={id} className="flex flex-col justify-center items-center">
						<CardHeader>
							{iconUrl && <Image src={iconUrl} className=" rounded-lg aspect-square h-20 object-contain inline z-0" />}
							<CardTitle>{label}</CardTitle>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
};
