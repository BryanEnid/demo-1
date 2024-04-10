import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listbox } from '@headlessui/react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Icon } from '@iconify/react';

import { useAuth } from '@/providers/Authentication';
import { useProfile } from '@/hooks/useProfile';
import useStripeAccount from '@/hooks/useStripeAccount';
import { Typography } from '@/chadcn/Typography';
import { Input } from '@/chadcn/Input';
import { Calendar } from '@/chadcn/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/chadcn/Popover';
import { Button } from '@/chadcn/Button';
import FormatDate from '@/components/FormatDate';
import { Spinner } from '@/components/Spinner';

const countriesMap = {
	US: 'US'
};

const initialValues = {
	email: '',
	companyName: '',
	firstName: '',
	lastName: '',
	birthday: '',
	phone: '',
	profileUrl: '',
	country: 'US',
	currency: 'USD',
	sortCode: '',
	accountNumber: '',
	taxId: '',
	city: '',
	addressLine1: '',
	postalCode: '',
	state: '',
	idNumber: '',

	verificationFileFront: null,
	verificationFileBack: null,
	verificationFileAdditionalFront: null
};

const optionalFields = ['profileUrl', 'verificationFileAdditionalFront'];

const Bills = () => {
	const { user } = useAuth();
	const { data: profile } = useProfile();
	const { data, isLoading, createAccount, updateAccount } = useStripeAccount();

	const navigate = useNavigate();

	const [values, setValues] = useState(initialValues);

	const fileFrontInpRef = useRef();
	const fileBackInpRef = useRef();
	const fileAdditionalFrontInpRef = useRef();

	const maxYear = useMemo(() => new Date().getFullYear() - 18, []);
	const isValid = !Object.keys(values).find((key) => !values[key] && !optionalFields.includes(key));

	useEffect(() => {
		if (user && !values.email) {
			const fullNameArr = user.name.split(' ');
			setValues((val) => ({
				...val,
				email: user.email,
				companyName: user.name,
				firstName: fullNameArr[0],
				lastName: fullNameArr[1]
			}));
		}
	}, [user]);

	useEffect(() => {
		if (data?.id) {
			setValues({
				email: data.individual.email,
				firstName: data.individual?.first_name,
				lastName: data.individual?.last_name,
				phone: data.individual?.phone,
				birthday: new Date(data.individual?.dob?.year, data.individual?.dob?.month - 1, data.individual?.dob?.day),
				sortCode: data.external_accounts?.data?.[0]?.routing_number,
				accountNumber: `********${data.external_accounts?.data?.[0]?.last4}`,
				city: data.individual?.address?.city,
				addressLine1: data.individual?.address?.line1,
				postalCode: data.individual?.address?.postal_code,
				state: data.individual?.address?.state,
				idNumber: data.individual.id_number_provided ? '*********' : '',
				taxId: '',
				companyName: data.company?.name,
				currency: data.default_currency,
				country: data.country,
				profileUrl: data.business_profile.url,
				verificationFileFront: { name: data.individual?.verification?.document?.front },
				verificationFileBack: { name: data.individual?.verification?.document?.back },
				verificationFileAdditionalFront: { name: data.individual?.verification?.additional_document?.front }
			});
		}
	}, [data]);

	if (user && profile && user?.id !== profile?.id) {
		navigate(`/${profile.uid}`);
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		if (data?.id) {
			const updateKeys = [
				'email',
				'companyName',
				'firstName',
				'lastName',
				'birthday',
				'phone',
				'profileUrl',
				'city',
				'addressLine1',
				'postalCode',
				'state',
				'taxId'
			];
			if (data.individual.verification.status !== 'verified') {
				updateKeys.push('verificationFileFront', 'verificationFileBack', 'verificationFileAdditionalFront');
			}

			updateAccount({
				...updateKeys.reduce((res, key) => {
					if (key === 'birthday') {
						res.birthday = values.birthday?.getTime?.();
					} else if (key === 'profileUrl') {
						res.profileUrl =
							values.profileUrl ||
							(window.location.hostname === 'localhost'
								? `https://dev.observe.space/${user.uid}`
								: `${window.location.origin}/${user.uid}`);
					} else if (
						['verificationFileFront', 'verificationFileBack', 'verificationFileAdditionalFront'].includes(key)
					) {
						res = {
							...res,
							...(values.verificationFileFront instanceof File && {
								verificationFileFront: values.verificationFileFront
							}),
							...(values.verificationFileBack instanceof File && { verificationFileBack: values.verificationFileBack }),
							...(values.verificationFileAdditionalFront instanceof File && {
								verificationFileAdditionalFront: values.verificationFileAdditionalFront
							})
						};
					} else if (values[key]) {
						res[key] = values[key];
					}

					return res;
				}, {})
			});
		} else {
			await createAccount({
				...values,
				profileUrl:
					values.profileUrl ||
					(window.location.hostname === 'localhost'
						? `https://dev.observe.space/${user.uid}`
						: `${window.location.origin}/${user.uid}`),
				birthday: values.birthday?.getTime?.()
			});
		}
	};

	const handleChange = (e) => {
		setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
	};

	const handleFilesChange = (e, valueKey) => {
		handleChange({ target: { name: valueKey, value: e.target.files[0] } });
	};

	return (
		<div className="container pb-28 sm:pb-10">
			<Typography variant="h2">Billing Information</Typography>
			<div className="w-96 pt-4">
				<form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
					<Input name="email" value={values.email} placeholder="Email" onChange={handleChange} />
					<Input name="firstName" value={values.firstName} placeholder="First Name" onChange={handleChange} />
					<Input name="lastName" value={values.lastName} placeholder="Last Name" onChange={handleChange} />
					<div>
						<Popover className="w-full">
							<PopoverTrigger>
								<Button iconBegin={<Icon icon="majesticons:calendar" />} variant="secondary" className="w-full">
									{values.birthday ? <FormatDate date={values.birthday} /> : 'Birthday'}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									fromYear={maxYear - 100}
									toYear={maxYear}
									captionLayout="dropdown"
									mode="single"
									selected={values.birthday}
									onSelect={(value) => handleChange({ target: { name: 'birthday', value } })}
									className="rounded-md border"
								/>
							</PopoverContent>
						</Popover>
					</div>
					<Input name="phone" value={values.phone} placeholder="Phone" onChange={handleChange} />
					<Input name="companyName" value={values.companyName} placeholder="Company Name" onChange={handleChange} />
					<div className="relative">
						<Listbox
							value={values.country}
							disabled={!!data?.id && !!values.country}
							onChange={(value) => handleChange({ target: { name: 'country', value } })}
						>
							<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
								<div className="truncate uppercase">{countriesMap[values.country]}</div>
								<span>
									<CaretSortIcon className="h-4 w-4 opacity-50" />
								</span>
							</Listbox.Button>
							<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
								{Object.keys(countriesMap).map((key) => (
									<Listbox.Option
										key={key}
										value={key}
										className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										{({ selected }) => (
											<>
												<span>{countriesMap[key]}</span>
												{selected && (
													<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
														<CheckIcon className="h-4 w-4" aria-hidden="true" />
													</span>
												)}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Listbox>
					</div>
					<div className="relative">
						<Listbox
							value={values.currency}
							disabled={!!data?.id && !!values.currency}
							onChange={(value) => handleChange({ target: { name: 'currency', value } })}
						>
							<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
								<div className="truncate uppercase">{values.currency}</div>
								<span>
									<CaretSortIcon className="h-4 w-4 opacity-50" />
								</span>
							</Listbox.Button>
							<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
								<Listbox.Option
									value="USD"
									className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
								>
									{({ selected }) => (
										<>
											<span>USD</span>
											{selected && (
												<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
													<CheckIcon className="h-4 w-4" aria-hidden="true" />
												</span>
											)}
										</>
									)}
								</Listbox.Option>
							</Listbox.Options>
						</Listbox>
					</div>
					<Input
						name="sortCode"
						placeholder="Sort Code"
						value={values.sortCode}
						disabled={!!data?.id && !!values.sortCode}
						onChange={handleChange}
					/>
					<Input
						name="accountNumber"
						placeholder="Account Number"
						value={values.accountNumber}
						disabled={!!data?.id && !!values.accountNumber}
						onChange={handleChange}
					/>
					<Input
						name="taxId"
						placeholder={data?.company?.tax_id_provided ? 'Tax ID (provided)' : 'Tax ID'}
						value={values.taxId}
						onChange={handleChange}
					/>
					<Input name="city" value={values.city} placeholder="City" onChange={handleChange} />
					<Input name="addressLine1" value={values.addressLine1} placeholder="Address" onChange={handleChange} />
					<Input name="postalCode" value={values.postalCode} placeholder="Postal Code" onChange={handleChange} />
					<Input name="state" value={values.state} placeholder="State" onChange={handleChange} />
					<Input
						name="idNumber"
						placeholder="ID Number"
						value={values.idNumber}
						disabled={!!data?.id && !!values.idNumber}
						onChange={handleChange}
					/>
					<input
						type="file"
						className="hidden"
						accept="image/png, image/jpg"
						ref={fileFrontInpRef}
						onChange={(e) => handleFilesChange(e, 'verificationFileFront')}
					/>
					<Button
						iconBegin={<Icon icon="pajamas:doc-new" />}
						type="button"
						variant="secondary"
						className="w-full"
						disabled={!!data?.id && !!values.verificationFileFront}
						onClick={() => fileFrontInpRef.current?.click?.()}
					>
						{values.verificationFileFront ? values.verificationFileFront?.name : 'Identity document Front'}
					</Button>

					<input
						type="file"
						className="hidden"
						accept="image/png, image/jpg"
						ref={fileBackInpRef}
						onChange={(e) => handleFilesChange(e, 'verificationFileBack')}
					/>
					<Button
						iconBegin={<Icon icon="pajamas:doc-new" />}
						type="button"
						variant="secondary"
						className="w-full"
						disabled={!!data?.id && !!values.verificationFileBack}
						onClick={() => fileBackInpRef.current?.click?.()}
					>
						{values.verificationFileBack ? values.verificationFileBack?.name : 'Identity document Back'}
					</Button>

					<input
						type="file"
						className="hidden"
						accept="image/png, image/jpg"
						ref={fileAdditionalFrontInpRef}
						onChange={(e) => handleFilesChange(e, 'verificationFileAdditionalFront')}
					/>
					<Button
						iconBegin={<Icon icon="pajamas:doc-new" />}
						type="button"
						variant="secondary"
						className="w-full"
						disabled={!!data?.id && !!values.verificationFileAdditionalFront}
						onClick={() => fileAdditionalFrontInpRef.current?.click?.()}
					>
						{values.verificationFileAdditionalFront
							? values.verificationFileAdditionalFront?.name
							: 'Identity document Additional (optional)'}
					</Button>

					<Input
						name="profileUrl"
						value={values.profileUrl}
						placeholder="Profile URL (optional)"
						onChange={handleChange}
					/>
					<div className="flex justify-end gap-2 w-full">
						<Button type="submit" className="px-10" disabled={isLoading || (!isValid && !data?.id)}>
							{isLoading ? <Spinner size={24} /> : 'Save'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Bills;
