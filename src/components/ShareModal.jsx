import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useAuth } from '@/providers/Authentication.jsx';
import { useUser } from '@/hooks/useUser.js';
import { PageModal } from '@/components/PageModal.jsx';
import { Typography } from '@/chadcn/Typography.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { Separator } from '@/chadcn/Separator.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/chadcn/Popover.jsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/chadcn/Command.jsx';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';

import { Listbox } from '@headlessui/react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

const ROLES = [
	{ value: 'VIEWER', label: 'Viewer' },
	{ value: 'COLLABORATOR', label: 'Collaborator' }
];

const ShareModal = ({ open, onClose, bucket, saveBucketSettings }) => {
	const { user, ...auth } = useAuth();
	const { users, isUsersLoading, findUsers } = useUser(auth);

	const [confirmDelete, setConfirmDelete] = useState(null);
	const [contributors, setContributors] = useState(bucket?.contributors || []);
	const [searchValue, setSearchValue] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isPrivate, setIsPrivate] = useState(bucket.private.toString());

	const isDirty = bucket.contributors !== contributors || bucket.private.toString() !== isPrivate;

	const filteredUsers = users.filter(
		(item) => item.id !== user.id && !contributors.find((contributor) => contributor.userId === item.id)
	);

	useEffect(() => {
		let timeoutId;
		if (searchValue.length) {
			timeoutId = setTimeout(() => {
				findUsers(searchValue);
			}, 300);
		}

		return () => timeoutId && clearTimeout(timeoutId);
	}, [searchValue]);

	useEffect(() => {
		if (bucket?.contributors.length) {
			setContributors(bucket.contributors);
		}
	}, [bucket?.contributors]);

	const addSelected = () => {
		setContributors((val) => [
			...selectedUsers.map(({ id, ...selected }) => ({ userId: id, role: 'VIEWER', user: { id, ...selected } })),
			...val
		]);
		setSelectedUsers([]);
		setSearchValue('');
	};
	const removeContributor = () => {
		setContributors((valList) => valList.filter((item) => item.userId !== confirmDelete.userId));
		setConfirmDelete(null);
	};

	const changeRole = (userId, role) => {
		setContributors((valList) => valList.map((item) => (item.userId === userId ? { ...item, role } : item)));
	};

	const selectUser = (userId) => {
		if (selectedUsers.find(({ id }) => id === userId)) {
			setSelectedUsers((val) => val.filter(({ id }) => id !== userId));
		} else {
			const selected = filteredUsers.find(({ id }) => id === userId);
			setSelectedUsers((val) => [...val, selected]);
		}
	};
	const removeSelectedUser = (e, userId) => {
		e.preventDefault();
		setSelectedUsers((val) => val.filter(({ id }) => id !== userId));
	};

	const copyLink = () => {
		const url = `${window.location.origin}/${bucket.creator.uid}/buckets?bucketid=${bucket.id}`;
		navigator.clipboard.writeText(url);
	};

	return (
		<PageModal show={open} onClose={onClose} width="800px">
			<div>
				<div className="sticky top-0 bg-white">
					<div className="flex justify-between items-center px-8 py-4">
						<Typography variant="h3">Bucket / {bucket?.name}</Typography>
						<Button variant="ghost" className="rounded-full w-[40px] h-[40px]" onClick={onClose}>
							<Icon icon="mingcute:close-fill" className="text-2xl" />
						</Button>
					</div>
					<Separator className="mt-0" />
				</div>
				<div className="px-8 py-7">
					<div className="mb-8">
						<Typography variant="h4" className="text-2xl mb-5">
							Bucket Type
						</Typography>
						<div className="w-[200px] relative">
							<Listbox value={isPrivate} onChange={setIsPrivate}>
								<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
									<div className="truncate">{isPrivate === 'true' ? 'Private' : 'Public'}</div>
									<span>
										<CaretSortIcon className="h-4 w-4 opacity-50" />
									</span>
								</Listbox.Button>
								<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
									<Listbox.Option
										value="false"
										className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										{({ selected }) => (
											<>
												<span>Public</span>
												{selected && (
													<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
														<CheckIcon className="h-4 w-4" aria-hidden="true" />
													</span>
												)}
											</>
										)}
									</Listbox.Option>
									<Listbox.Option
										value="true"
										className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										{({ selected }) => (
											<>
												<span>Private</span>
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
					</div>
					<div className="pb-6">
						<Typography variant="h4" className="text-2xl">
							Share bucket with
						</Typography>
					</div>
					<div className="flex justify-between items-center gap-5">
						<Popover>
							<PopoverTrigger asChild>
								<div className="w-full h-[36px] px-3 py-1 flex items-center rounded-md border border-input cursor-text">
									{selectedUsers.length ? (
										<div className="flex gap-1">
											{selectedUsers.map(({ id, name }) => (
												<div
													key={id}
													className="cursor-pointer text-sm bg-accent rounded-full border px-2 py-1"
													onClick={(e) => removeSelectedUser(e, id)}
												>
													{name}
												</div>
											))}
										</div>
									) : (
										<Typography className="text-muted-foreground text-sm">Add people to share with</Typography>
									)}
								</div>
							</PopoverTrigger>
							<PopoverContent className="w-[600px] p-0">
								<Command shouldFilter={false}>
									<CommandInput
										value={searchValue}
										placeholder="Search users..."
										onValueChange={(val) => setSearchValue(val)}
									/>
									<CommandEmpty>
										{isUsersLoading && 'Loading...'}
										{!isUsersLoading && !!searchValue.length && 'Not found.'}
									</CommandEmpty>
									<CommandGroup className="max-h-[250px] overflow-auto">
										{!!searchValue.length &&
											filteredUsers.map((_user) => (
												<CommandItem
													key={_user.id}
													value={_user.id}
													onSelect={(val) => selectUser(val)}
													className="flex justify-between"
												>
													<div>
														<Typography className="font-bold">{_user?.name}</Typography>
														<Typography className="!mt-0">{_user?.email}</Typography>
													</div>
													{selectedUsers.find(({ id }) => id === _user.id) && (
														<Icon icon="ci:check-big" className="text-2xl text-green-500" />
													)}
												</CommandItem>
											))}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
						<Button iconBegin={<Icon icon="mdi:user-plus-outline" className="text-xl" />} onClick={addSelected}>
							Add
						</Button>
					</div>
					<Typography variant="h5">Current Users with Access</Typography>
					<div className="pt-5 pr-16">
						<div className="flex justify-between items-center mb-5">
							<div>
								<Typography className="font-bold">{user?.name} (you)</Typography>
								<Typography className="!mt-0">{user?.email}</Typography>
							</div>
							<div>
								<Typography variant="muted" className="font-bold">
									Owner
								</Typography>
							</div>
						</div>

						{contributors.map((contributor) => (
							<div key={contributor.userId} className="flex justify-between items-center mb-5">
								<div>
									<Typography className="font-bold">{contributor.user?.name}</Typography>
									<Typography className="!mt-0">{contributor.user?.email}</Typography>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-[150px] relative">
										<Listbox value={contributor.role} onChange={(value) => changeRole(contributor.userId, value)}>
											<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
												<div className="truncate">
													{ROLES.find(({ value }) => contributor.role === value)?.label || contributor.role}
												</div>
												<span>
													<CaretSortIcon className="h-4 w-4 opacity-50" />
												</span>
											</Listbox.Button>
											<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
												{ROLES.map(({ value, label }) => (
													<Listbox.Option
														key={value}
														value={value}
														className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
													>
														{({ selected }) => (
															<>
																<span>{label}</span>
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
									<Button variant="ghost" className="w-[40px] h-[40px]" onClick={() => setConfirmDelete(contributor)}>
										<Icon icon="fluent:delete-12-regular" className="text-lg" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="sticky bottom-0 bg-white">
					<Separator className="mt-0" />
					<div className="flex justify-between items-center px-8 pt-2 pb-3">
						<Button
							variant="outline"
							className="text-primary"
							iconBegin={<Icon icon="ic:round-link" className="text-2xl" />}
							onClick={copyLink}
						>
							Copy link
						</Button>
						{!isDirty ? (
							<Button onClick={onClose}>Done</Button>
						) : (
							<Button onClick={() => saveBucketSettings({ contributors, isPrivate: isPrivate === 'true' })}>
								Save
							</Button>
						)}
					</div>
				</div>
			</div>
			<ConfirmDialog
				show={!!confirmDelete}
				title={`Are you sure you want to delete access for ${confirmDelete?.user?.name}?`}
				submitLabel="Delete"
				onClose={() => setConfirmDelete(null)}
				onConfirm={removeContributor}
			/>
		</PageModal>
	);
};

export default ShareModal;
