import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/chadcn/Card';
import { Typography } from '@/chadcn/Typography';
import { ObserveIcon } from '@/components/ObserveIcon';
import React from 'react';

const AboutSection = () => {
	return (
		<div>
			<Typography variant="h2" className="mb-5">
				About
			</Typography>

			<Typography variant="p">
				Hello, my name is Earl Livingston and I like seagulls. I genuinely care about the environment. I am a graduate
				from Harvard & MIT. With my free time, you can find me watching Planet Earth or frolocking in the garden with my
				cashmere sweater. I volunteer on weekends at the Georgia Aquarium. I spend a lot of time with the beluga whales.
				I am an avid designer and a generalist engineer who wishes to focus on products that are sustainable and
				impactful to the world
			</Typography>
		</div>
	);
};

const SkillsSection = () => {
	const [skills, setSkills] = React.useState(
		new Array(10).fill({
			label: 'React',
			iconUrl: '',
			iconCode: ':react:'
		})
	);

	return (
		<div>
			<Typography variant="h2" className="mb-5">
				Skills
			</Typography>

			<div className="grid grid-cols-5 gap-5">
				{skills.map(({ label }, index) => (
					<Card key={index}>
						<CardHeader>
							<CardTitle>{label}</CardTitle>
							<CardDescription>Card Description</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
};

const CareerHistorySection = () => {
	const [history, setHistory] = React.useState(
		new Array(3).fill({
			label: 'CEO & Product Architect',
			company: 'Tesla Motors, Inc',
			companyLogoUrl: 'https://....',
			startDate: '2023-11-21T10:47:55.753Z',
			endDate: '2023-11-21T10:47:55.753Z',
			currentCompany: false,
			bucketId: '655b1c6ce664a8d355324cb8'
		})
	);

	return (
		<div>
			<Typography variant="h2" className="mb-5">
				Career History
			</Typography>

			<div className="flex flex-col gap-5">
				{history.map(({ label, company }, index) => (
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

const AttachmentsSection = () => {
	const [attachments, setAttachments] = React.useState([
		{
			id: '655b1c6ce664a8d355324cb8',
			fileUrl: 'https://....',
			previewUrl: 'https://designsystem.digital.gov/assets/img/templates/layout--docs.png',
			createdAt: '2023-11-21T10:47:55.753Z',
			updatedAt: '2023-11-21T10:47:55.753Z'
		},
		{
			id: '655b1c6ce664a8d355324cb5',
			fileUrl: 'https://....',
			previewUrl: 'https://images.examples.com/wp-content/uploads/2022/07/Electronic-Thesis.jpg',
			createdAt: '2023-11-21T10:47:55.753Z',
			updatedAt: '2023-11-21T10:47:55.753Z'
		}
	]);

	return (
		<div>
			<Typography variant="h2" className="mb-5">
				Attachments
			</Typography>

			<div className="grid grid-cols-5 gap-9">
				{attachments.map(({ previewUrl, id }) => (
					<div key={id}>
						<img
							src={previewUrl}
							style={{ aspectRatio: 8 / 12 }}
							className="h-full w-full object-cover border rounded-lg transition-all hover:scale-105 cursor-pointer"
						/>
					</div>
				))}

				<div className="flex flex-col justify-center items-center gap-4 h-full w-full object-cover border rounded-lg transition-all hover:scale-105 cursor-pointer">
					<ObserveIcon size={80} rounded />

					<Typography variant="large" className="text-primary">
						Observe Export
					</Typography>
				</div>
			</div>
		</div>
	);
};

export function Experience() {
	return (
		<div className="flex flex-col gap-24 mb-24">
			<AboutSection />

			<SkillsSection />

			<CareerHistorySection />

			<AttachmentsSection />
		</div>
	);
}
