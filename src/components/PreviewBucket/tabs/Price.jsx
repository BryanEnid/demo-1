import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Listbox } from '@headlessui/react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { Typography } from '@/chadcn/Typography';
import { Button } from '@/chadcn/Button';
import { Input } from '@/chadcn/Input';
import { Spinner } from '@/components/Spinner.jsx';

const priceTypes = {
	one_time: 'One time',
	recurring: 'Subscription'
};

const subscriptionPeriods = {
	// day: '',
	// week: '',
	month: 'Monthly',
	year: 'Annually'
};

const initialValues = {
	type: Object.keys(priceTypes)[0],
	currency: 'USD',
	unitAmount: '',
	interval: 'month',
	intervalCount: 1
};

const Price = ({ bucketId, data, profile, savePrice }) => {
	const [values, setValues] = useState({ ...initialValues });
	const [isLoading, setIsLoading] = useState(false);

	const userStripeId = profile?.stripeId || profile?.creator?.stripeId;
	const creatorId = profile.uid || profile.creator.uid;
	const isValid = values.unitAmount > 0 /* && values.intervalCount > 0 */ && userStripeId;

	useEffect(() => {
		if (data.price) {
			setValues(data.price);
		}
	}, [data]);

	const onSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);
		savePrice(
			{ data: { ...data.price, ...values }, bucketId },
			{
				onSettled: () => setIsLoading(false)
			}
		);
	};

	const onChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		if (e.target.name === 'intervalCount') {
			value = value.replace('.', '');
		} else if (e.target.name === 'unitAmount') {
			value = Math.floor(value * 100) / 100;
		}

		setValues((val) => ({ ...val, [name]: value }));
	};

	const formatPrice = () => {
		setValues((val) => ({
			...val,
			unitAmount: (Math.floor(val.unitAmount * 100) / 100).toString(10)
		}));
	};

	return (
		<div className="flex flex-row flex-wrap gap-10 px-10 py-10 outline-none">
			{!userStripeId && (
				<Typography
					variant="h4"
					className="text-center text-destructive p-2 rounded-md border border-destructive mx-auto mb-4"
				>
					Please, provide{' '}
					<Link to={`/${creatorId}/bills`} className="underline">
						Account information
					</Link>{' '}
					to be able to accept payments and receive payouts.
				</Typography>
			)}
			<div className="basis-80">
				<form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
					<div className="relative">
						<Listbox value={values.type} onChange={(value) => onChange({ target: { name: 'type', value } })}>
							<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
								<div className="truncate">{priceTypes[values.type]}</div>
								<span>
									<CaretSortIcon className="h-4 w-4 opacity-50" />
								</span>
							</Listbox.Button>
							<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
								{Object.keys(priceTypes).map((key) => (
									<Listbox.Option
										key={key}
										value={key}
										className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										{({ selected }) => (
											<>
												<span>{priceTypes[key]}</span>
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
					{values.type === 'recurring' && (
						<>
							<div className="relative">
								<Listbox
									value={values.interval}
									onChange={(value) => onChange({ target: { name: 'interval', value } })}
								>
									<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
										<div className="truncate">{subscriptionPeriods[values.interval]}</div>
										<span>
											<CaretSortIcon className="h-4 w-4 opacity-50" />
										</span>
									</Listbox.Button>
									<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
										{Object.keys(subscriptionPeriods).map((key) => (
											<Listbox.Option
												key={key}
												value={key}
												className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
											>
												{({ selected }) => (
													<>
														<span>{subscriptionPeriods[key]}</span>
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
						</>
					)}

					<div className="relative">
						<Listbox value={values.currency} onChange={(value) => onChange({ target: { name: 'currency', value } })}>
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
						type="number"
						placeholder="Price"
						name="unitAmount"
						value={values.unitAmount}
						onChange={onChange}
						onBlur={formatPrice}
					/>
					<div className="flex justify-end gap-2 w-full">
						<Button type="submit" className="px-10" disabled={!isValid || isLoading}>
							{isLoading ? <Spinner size={24} /> : 'Save'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Price;
