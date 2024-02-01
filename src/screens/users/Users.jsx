import React from 'react';

import { Button } from '@/chadcn/Button';
import { DataTable } from '@/chadcn/DataTable';
import { Typography } from '@/chadcn/Typography';
import { BASE_URL } from '@/config/api';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { NavBar } from '@/components/NavigationBar/NavBar';
import { SideBar } from '@/components/NavigationBar/SideBar';
import { useUsers } from '@/hooks/useUsers';
import { useMobile } from '@/hooks/useMobile';

export const UsersScreen = () => {
	const { users, isLoading } = useUsers();
	const { isMobile } = useMobile();

	if (isLoading) return <>loading</>;

	const columns = [
		{
			accessorKey: 'name',
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						<div className="flex flex-row justify-center items-center gap-2">
							<div>Email</div> <Icon icon="iconamoon:arrow-up-2-fill" />
						</div>
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="flex flex-row justify-start items-center gap-3 ">
					<img src={row.original.photoURL} className="aspect-square w-10 h-10 rounded-full" />
					<Typography variant="a">
						<Link to={'/' + row.original.username}>{row.original.name}</Link>
					</Typography>
				</div>
			)
		},
		{
			accessorKey: 'email',
			header: 'Email'
		}
	];
	if (!isMobile) columns.push({ accessorKey: 'username', header: 'Username' });

	return (
		<>
			<SideBar />
			<NavBar />

			<div className="container mx-auto pb-28 sm:pb-0">
				<Typography variant="h2" className="m-5">
					Users
				</Typography>

				<DataTable defaultSort={[{ id: 'name', desc: false }]} columns={columns} data={users} />
			</div>
		</>
	);
};
