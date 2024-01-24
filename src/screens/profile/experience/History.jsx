import { Card, CardHeader, CardContent } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getContrastColorAsync, getFirstPixelColor, isYouTubeUrl } from '@/lib/utils';
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
import { useBuckets } from '@/hooks/useBuckets';
import { useNavigate } from 'react-router-dom';

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
	const { data: buckets } = useBuckets(profile);
	const navigate = useNavigate();

	// State
	const [history, setHistory] = React.useState([]);
	const [show, setShow] = React.useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
	const [logos, setLogos] = React.useState([]);

	// Form
	const [loadedEditHistoryItem, setLoadedEditHistoryItem] = React.useState();
	const [jobTitle, setJobTitle] = React.useState();
	const [company, setCompany] = React.useState('');
	const [startDate, setStartDate] = React.useState();
	const [endDate, setEndDate] = React.useState();
	const [presentJob, setPresentJob] = React.useState(false);
	const [linkedBucket, setLinkedBucket] = React.useState();

	// Refs
	const companySearchRef = React.useRef();
	// const bucketsSearchRef = React.useRef();

	// Root level variables
	const section = React.useMemo(() => String(title).toLowerCase().replace(' ', '-'), [title]);
	const thisYear = React.useMemo(() => new Date().getFullYear(), []);

	React.useEffect(() => {
		const fetchImageColors = async () => {
			const colorPromises = data?.map(async (item) => {
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

	// TODO: Handle form instead
	const handleSave = () => {
		const payload = [...data];
		let index = payload.findIndex(({ id }) => id === loadedEditHistoryItem?.id);
		if (index === -1) index = payload.length;

		const newItem = {
			title: jobTitle,
			company: company.name,
			companyLogoUrl: company.logo,
			startDate,
			endDate: presentJob ? null : endDate,
			currentCompany: presentJob,
			bucketId: linkedBucket?.id
		};

		if (section === 'certifications') {
			newItem.provider = company.name;
			newItem.providerLogoUrl = company.logo;
		}

		payload[index] = newItem;

		updateProfile({ body: payload, id: profile.uid, section });

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

	const handleAddBucket = (item) => {
		// bucketsSearchRef.current?.value = '';

		setLinkedBucket(item);
	};

	const handleBucketSearch = ({ target }) => {};

	const redirectToBucket = (bucket) => {
		// console.log(bucket)
		// profile.uid
		navigate(`/${profile.uid}/buckets?bucketid=${bucket.id}`);
	};

	const clear = () => {
		setLoadedEditHistoryItem(null);
		setJobTitle('');
		setCompany('');
		setStartDate(null);
		setEndDate(null);
		setPresentJob(false);
		setLinkedBucket(null);
		setLogos([]);
	};

	const handleSrc = (src, item) => {
		if (isYouTubeUrl(src)) return item.videos[0].image;

		return src;
	};

	const handleEditHistoryItem = (item) => {
		if (isUserProfile) {
			setLoadedEditHistoryItem(item);
			setJobTitle(item.title);
			setCompany({ name: item.company, logo: item.companyLogoUrl });
			setStartDate(new Date(item.startDate));
			setEndDate(new Date(item.endDate));
			setPresentJob(item.currentCompany);
			setLinkedBucket(item.bucket);
			setShow(true);
		}
	};

	const handleDeleteItem = () => {
		const filteredItems = data.filter((item) => item.id !== loadedEditHistoryItem.id);
		updateProfile({ body: filteredItems, id: profile.uid, section });

		clear();
		setShow(false);
	};

	if (!isUserProfile && !history) return;

	return (
		<>
			{/* Delete confirmation */}
			<ConfirmDialog
				show={showDeleteConfirmation}
				onClose={() => setShowDeleteConfirmation(false)}
				onConfirm={handleDeleteItem}
				title="Attention"
				submitBtnVariant="destructive"
			>
				Are you sure you want to delete this item
			</ConfirmDialog>

			{/* Edit and Add new item modal confirmation */}
			<ConfirmDialog
				show={show}
				onClose={handleClose}
				onConfirm={handleSave}
				onDelete={loadedEditHistoryItem && handleDeleteItem}
				title="Add your experience"
			>
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
							{section !== 'certifications' && (
								<Popover className="w-full">
									<PopoverTrigger>
										<Input placeholder="Start Date" value={startDate} />
									</PopoverTrigger>

									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											fromYear={1960}
											toYear={thisYear}
											captionLayout="dropdown"
											mode="single"
											selected={startDate}
											onSelect={setStartDate}
											className="rounded-md border"
										/>
									</PopoverContent>
								</Popover>
							)}

							{/* Calendar - End Date */}
							<Popover>
								<PopoverTrigger>
									<Input
										placeholder={section !== 'certifications' ? 'End Date' : 'Completion Date'}
										value={presentJob ? 'Present' : endDate}
										disabled={presentJob}
									/>
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										fromYear={1901}
										toYear={thisYear}
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
						{section !== 'certifications' && (
							<div className="flex flex-row items-center gap-2">
								<Checkbox value={presentJob} onChange={setPresentJob} />
								<Typography variant="p" className="inline">
									Present job
								</Typography>
							</div>
						)}

						{/* Link to bucket */}
						<Popover>
							{section !== 'certifications' && (
								<PopoverTrigger className="flex flex-row mt-5 items-center gap-2">
									<Button variant="secondary">Link to a bucket</Button>
									{linkedBucket && 'Linked bucket: ' + linkedBucket.name}
								</PopoverTrigger>
							)}

							<PopoverContent className="w-full p-2 max-h-[300px] overflow-y-auto" align="start">
								<div className="w-[454px] flex flex-col gap-2">
									{/* <Input ref={bucketsSearchRef} placeholder="Bucket name" onChange={handleBucketSearch} /> */}

									<div className="z-10 bg-white">
										{!!buckets?.length && (
											<div>
												<div
													className="flex flex-col gap-1 p-2 w-full border-t-0 z-10"
													style={{ borderRadius: '0px 0px 0.75rem 0.75rem' }}
												>
													{buckets.map((item) => {
														// if (!item.videos?.[0]?.image) return;
														return (
															<PopoverClose key={item.name}>
																<Button
																	className="w-full justify-start px-8 h-auto"
																	variant="ghost"
																	onClick={() => handleAddBucket(item)}
																>
																	{item.videos?.[0]?.image && (
																		<img
																			src={item.videos?.[0]?.image}
																			className="aspect-square w-10 object-cover inline"
																		/>
																	)}
																	<Typography variant="p" className="px-3 inline">
																		{item.name}
																	</Typography>
																</Button>
															</PopoverClose>
														);
													})}
												</div>
											</div>
										)}
									</div>
								</div>
							</PopoverContent>
						</Popover>
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
					<Typography variant="h2">{title}</Typography>

					{isUserProfile && (
						<button onClick={() => setShow(true)}>
							<Icon icon="gravity-ui:plus" fontSize={30} className="mb-1 p-2" />
						</button>
					)}
				</div>

				<div className="flex flex-col gap-5">
					{history.map((props, index) => {
						const { title, company, companyLogoUrl, bgColor, textColor, startDate, endDate, currentCompany, bucketId } =
							props;
						const bucket = buckets?.find(({ id }) => id === bucketId);
						const previewSrc = bucket?.videos?.[0]?.videoUrl;

						return (
							<div key={index} onClick={() => handleEditHistoryItem({ ...props, bucket })}>
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
											{section !== 'certifications' && (
												<>
													<FormatDate date={startDate} /> -{' '}
												</>
											)}
											{currentCompany ? 'Present' : <FormatDate date={endDate} />}
										</Typography>
									</CardContent>

									{section !== 'certifications' && (
										<div className="flex justify-center items-center p-0">
											{/* {JSON.stringify(buckets?.find(({ id }) => id === bucketId)?.name, null, 2)} */}
											{/* aspect-square object-cover rounded-2xl */}
											<div className="px-7">
												<div className="relative rounded-2xl overflow-hidden">
													{isYouTubeUrl(previewSrc) ? (
														<img
															className="aspect-square object-cover h-full rounded-2xl"
															src={handleSrc(previewSrc, bucket)}
														/>
													) : (
														<video
															type="video/mp4"
															autoPlay
															muted
															loop
															className="aspect-square object-cover h-full "
															src={handleSrc(previewSrc, bucket)}
														/>
													)}
													<button
														onClick={() => redirectToBucket(bucket)}
														className="absolute top-0 left-0 flex justify-center items-center bg-black/20 w-full h-full transition-all opacity-0 hover:opacity-100  "
													>
														<Icon icon="fluent:window-new-16-filled" className="text-white" fontSize={30} />
													</button>
												</div>
											</div>
										</div>
									)}
								</Card>
							</div>
						);
					})}

					{!history.length && isUserProfile && (
						<div className="rounded-xl p-10 border-dashed border-2 border-primary flex flex-col text-center text-slate-500">
							Customize your profile by listing the talents and expertise that define you. A modal will pop up, allowing
							you to effortlessly manage and showcase your skills. Let your strengths shine!
							<Button variant="link" onClick={() => setShow(true)}>
								🌟 Click on this link to add your skills.
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};
