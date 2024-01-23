import { Card, CardHeader, CardContent } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getContrastColorAsync, getFirstPixelColor } from '@/lib/utils';
import React from 'react';
import { useExperience } from './useExperience';
import { useProfile } from '@/hooks/useProfile';
import { Input } from '@/chadcn/Input';
import { Button } from '@/chadcn/Button';
import { ClearBitAttribution } from '@/components/ClearBitAttribution';
import { Icon } from '@iconify/react';
import { Calendar } from '@/chadcn/Calendar';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/chadcn/Popover';
import { Checkbox } from '@/chadcn/Checkbox';

const FormatDate = ({ date: dateString }) => {
	const [output, setOutput] = React.useState();

	React.useEffect(() => {
		if (dateString) {
			const date = new Date(dateString);
			const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
			setOutput(formattedDate);
		}
	}, [dateString]);

	function formatDateString(dateString) {}

	return <>{output}</>;
};

export const History = ({ title, data }) => {
	// Hooks
	const { isUserProfile, data: profile } = useProfile();
	const { updateProfile } = useExperience();

	// State
	const [history, setHistory] = React.useState([]);
	const [show, setShow] = React.useState(false);
	const [logos, setLogos] = React.useState([]);

	// Form
	const [jobTitle, setJobTitle] = React.useState();
	const [company, setCompany] = React.useState('');
	const [startDate, setStartDate] = React.useState();
	const [endDate, setEndDate] = React.useState();
	const [presentJob, setPresentJob] = React.useState(false);

	// Refs
	const companySearchRef = React.useRef();

	React.useEffect(() => {
		const fetchImageColors = async () => {
			const colorPromises = data.map(async (item) => {
				const hexColor = await getFirstPixelColor(item.companyLogoUrl);
				const textColor = await getContrastColorAsync(hexColor);
				return { ...item, bgColor: hexColor, textColor };
			});

			const updatedHistory = await Promise.all(colorPromises);
			setHistory(updatedHistory);
		};

		fetchImageColors(data);
	}, [data]);

	const handleClose = (type) => {
		if (type === 'escape') return;

		clear();
		setShow(false);
	};

	const handleRemoveSkill = (label) => {
		const filteredItems = history.filter((item) => item.label !== label);
		setHistory(filteredItems);
	};

	// TODO: Handle form instead
	const handleSave = () => {
		const section = String(title).toLowerCase().replace(' ', '-');
		const body = {
			title: jobTitle,
			company: company.name,
			companyLogoUrl: company.logo,
			startDate,
			endDate: presentJob ? null : endDate,
			currentCompany: presentJob
		};

		updateProfile({ body, id: profile.uid, section });

		clear();
		setShow(false);
	};

	const handleLogoSearch = async ({ target }) => {
		setCompany(target.value);
		if (target.value === '') return setLogos([]);

		const logoSuggestionAPI = new URL('https://autocomplete.clearbit.com/v1/companies/suggest');
		logoSuggestionAPI.searchParams.append('query', target.value);

		const res = await fetch(logoSuggestionAPI);
		const data = await res.json();
		setLogos(data);
	};

	const handleAddCompany = (item) => {
		companySearchRef.current.value = '';

		setLogos([]);
		setCompany(item);
	};

	const clear = () => {
		setLogos([]);
	};

	if (!history.length) return <></>;

	return (
		<>
			<ConfirmDialog show={show} onClose={handleClose} onConfirm={handleSave} title="Add your experience">
				<div className="flex flex-col">
					<div className="flex flex-col gap-3">
						<Input placeholder="Title" value={jobTitle} onChange={({ target }) => setJobTitle(target.value)} />

						<Popover>
							<PopoverTrigger>
								<Input placeholder="Company" value={company.name} />
							</PopoverTrigger>

							<PopoverContent className="w-full p-2" align="start">
								<div className="w-[454px] flex flex-col gap-2">
									<Input ref={companySearchRef} placeholder="Company" onChange={handleLogoSearch} />

									<div className="z-10 bg-white">
										{!!logos.length && (
											<div>
												<div
													className="flex flex-col gap-1 p-2 w-full border-t-0 z-10"
													style={{ borderRadius: '0px 0px 0.75rem 0.75rem' }}
												>
													{logos.map((item) => {
														if (!item.logo) return;
														return (
															<PopoverClose key={item.name}>
																<Button
																	className="w-full justify-start px-8 h-auto"
																	variant="ghost"
																	onClick={() => handleAddCompany(item)}
																>
																	<img src={item.logo} className="aspect-square w-10 object-contain inline" />
																	<Typography variant="p" className="px-3 inline">
																		{item.name}
																	</Typography>
																</Button>
															</PopoverClose>
														);
													})}
													<ClearBitAttribution />
												</div>
											</div>
										)}
									</div>
								</div>
							</PopoverContent>
						</Popover>

						<div className="grid grid-cols-2 gap-3 w-full">
							{/* Calendar - Start Date */}
							<Popover className="w-full">
								<PopoverTrigger>
									<Input placeholder="Start Date" value={startDate} />
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										captionLayout="dropdown"
										mode="single"
										selected={startDate}
										onSelect={setStartDate}
										className="rounded-md border"
									/>
								</PopoverContent>
							</Popover>

							{/* Calendar - End Date */}
							<Popover>
								<PopoverTrigger>
									<Input placeholder="End Date" value={presentJob ? 'Present' : endDate} disabled={presentJob} />
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										captionLayout="dropdown"
										mode="single"
										selected={endDate}
										onSelect={setEndDate}
										className="rounded-md border"
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Checkbox */}
						{/* Currently working here? */}
						<div className="flex flex-row items-center gap-2">
							<Checkbox value={presentJob} onChange={setPresentJob} />
							<Typography variant="p" className="inline">
								Present job
							</Typography>
						</div>

						{/* Link to bucket */}
						{/* <Input placeholder="Link bucket" /> */}
					</div>
				</div>

				<div className="w-full flex flex-wrap gap-2">
					{/* {history.map(({ label, iconUrl }) => (
						<Button
							key={label}
							className="bg-gray-200 rounded-full cursor-default py-6"
							variant="ghost"
							iconBegin={
								iconUrl && <img src={iconUrl} className="rounded-lg aspect-square h-7 object-contain inline" />
							}
							iconEnd={<Icon icon="tabler:x" onClick={() => handleRemoveSkill(label)} className="cursor-pointer" />}
						>
							{label}
						</Button>
					))} */}
				</div>
			</ConfirmDialog>

			<div>
				<div className="flex flex-row items-center mb-5 gap-2">
					<Typography variant="h2" className="mb-5">
						{title}
					</Typography>

					{isUserProfile && (
						<button onClick={() => setShow(true)}>
							<Icon icon="clarity:edit-line" fontSize={30} className="mb-1 p-2" />
						</button>
					)}
				</div>

				<div className="flex flex-col gap-5">
					{history.map(({ title, company, companyLogoUrl, bgColor, textColor, startDate, endDate }, index) => (
						<div key={index}>
							<Card className={`grid grid-cols-5 py-5 `} style={{ background: bgColor, color: textColor }}>
								<CardHeader className="flex justify-center items-center">
									<img src={companyLogoUrl} className="aspect-square object-contain w-20" />
								</CardHeader>

								<CardContent className={`flex flex-col justify-center p-0 col-span-3`}>
									<Typography variant="p" className="font-bold">
										{title}
									</Typography>

									<Typography variant="p">{company}</Typography>
									<Typography variant="p">
										<FormatDate date={startDate} /> - <FormatDate date={endDate} />
									</Typography>
								</CardContent>

								{/* <CardFooter className="flex justify-center items-center p-0">
					<p>Card Footer</p>
				</CardFooter> */}
							</Card>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
