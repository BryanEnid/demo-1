import React from 'react';

import { Button } from '@/chadcn/Button';
import { DataTable } from '@/chadcn/DataTable';
import { Typography } from '@/chadcn/Typography';
import { BASE_URL } from '@/config/api';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { NavBar } from '@/components/NavBar';
import { SideBar } from '@/components/SideBar';

const useUsers = () => {
	const [data, setData] = React.useState();

	React.useEffect(() => {
		const getUsers = async () => {
			const res = await fetch(`${BASE_URL}/api/users`);
			const data = await res.json();

			return data.sort((a, b) => a.name.localeCompare(b.name));
		};

		getUsers().then(setData);
	}, []);

	return { data };
};

export const UsersScreen = () => {
	const { data } = useUsers();

	if (!data) return <>loading</>;

	return (
		<>
			<SideBar />
			<NavBar />

			<div className="container mx-auto py-10">
				<Typography variant="h2" className="my-10">
					Users
				</Typography>
				<DataTable
					defaultSort={[{ id: 'name', desc: false }]}
					columns={[
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
						},
						{
							accessorKey: 'username',
							header: 'Username'
						}
					]}
					data={data}
				/>
			</div>
		</>
	);
};
