import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { CheckIcon } from '@radix-ui/react-icons';

import { Button } from '@/chadcn/Button';
import { DataTable } from '@/chadcn/DataTable';
import { Typography } from '@/chadcn/Typography';
import useOrganizations from '@/hooks/useOrganizations.js';
import { organizationTypes } from '@/screens/organizations/constants.js';

export const OrganizationsScreen = () => {
	const { list, isLoading } = useOrganizations({ fullList: true });

	if (isLoading) return <>loading</>;

	return (
		<>
			<div className="container mx-auto pb-28 sm:pb-0">
				<Typography variant="h2" className="my-10">
					Organizations
				</Typography>
				<DataTable
					data={list}
					defaultSort={[{ id: 'name', desc: false }]}
					columns={[
						{
							accessorKey: 'name',
							header: ({ column }) => {
								return (
									<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
										<div className="flex flex-row justify-center items-center gap-2">
											<div>Name</div> <Icon icon="iconamoon:arrow-up-2-fill" />
										</div>
									</Button>
								);
							},
							cell: ({ row }) => (
								<div className="flex flex-row justify-start items-center gap-3 ">
									<img src={row.original.picture} className="aspect-square w-10 h-10 rounded-full" />
									<Typography variant="a">
										<Link to={'/organizations/' + row.original.id}>{row.original.name}</Link>
									</Typography>
								</div>
							)
						},
						{
							accessorKey: 'id',
							header: 'ID'
						},
						{
							accessorKey: 'type',
							header: 'Type',
							cell: ({ row }) => (
								<div className="flex flex-row justify-start items-center gap-3 ">
									<Typography>{organizationTypes[row.original.type]}</Typography>
								</div>
							)
						},
						{
							accessorKey: 'private',
							header: 'Private',
							cell: ({ row }) => (
								<div className="flex flex-row justify-start items-center gap-3 ">
									{row.original.private ? (
										<CheckIcon className="text-2xl" />
									) : (
										<Icon icon="mingcute:close-fill" className="text-md" />
									)}
								</div>
							)
						},
						{
							accessorKey: 'creator',
							header: 'Creator',
							cell: ({ row }) => (
								<div className="flex flex-row justify-start items-center gap-3 ">
									<img src={row.original.creator.photoURL} className="aspect-square w-10 h-10 rounded-full" />
									<Typography variant="a">
										<Link to={'/' + row.original.creator.uid}>{row.original.creator.name}</Link>
									</Typography>
								</div>
							)
						}
					]}
				/>
			</div>
		</>
	);
};
