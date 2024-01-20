import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography';
import React from 'react';

const example = {
	label: 'CEO & Product Architect',
	company: 'Tesla Motors, Inc',
	companyLogoUrl: 'https://....',
	startDate: '2023-11-21T10:47:55.753Z',
	endDate: '2023-11-21T10:47:55.753Z',
	currentCompany: false,
	bucketId: '655b1c6ce664a8d355324cb8'
};

export const CareerHistorySection = ({ data }) => {
	if (!data.length) return <></>;

	return (
		<div>
			<Typography variant="h2" className="mb-5">
				Career History
			</Typography>

			<div className="flex flex-col gap-5">
				{data.map(({ label, company }, index) => (
					<Card key={index}>
						<CardHeader>
							<CardTitle>{label}</CardTitle>
							<CardDescription>{company}</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Card Content</p>
						</CardContent>
						<CardFooter>
							<p>Card Footer</p>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
};
