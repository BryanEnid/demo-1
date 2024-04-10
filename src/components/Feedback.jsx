/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hBO7puLhxg8
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import React from 'react';
import { Label } from '@/chadcn/Label';
import { Input } from '@/chadcn/Input';
import { Textarea } from '@/chadcn/Textarea';
import { RadioGroupItem, RadioGroup } from '@/chadcn/RadioGroup';
import { ConfirmDialog } from './ConfirmDialog';
import { Typography } from '@/chadcn/Typography';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/providers/Authentication';

const QUESTIONS = [
	'How easy is this app to use?',
	'Do you see this being valuable to you?',
	'Rate the capture feature',
	'Would you recommend this to a friend?'
];

const postMessage = (payload) => {
	const { feedback, name, email, ...questions } = payload;
	const userInfo = `Name: ${name}\nEmail: ${email}`; // Format name and email

	const blocks = Object.values(questions).map(({ question, value }) => ({
		type: 'section',
		text: { type: 'mrkdwn', text: `${question}\n${value}` }
	}));

	blocks.unshift({
		type: 'section',
		text: { type: 'mrkdwn', text: `*User Information:*\n${userInfo}` }
	});

	// Add feedback section
	blocks.push({
		type: 'section',
		text: { type: 'mrkdwn', text: `*User Feedback:*\n${feedback || 'No additional feedback provided'}` }
	});

	const body = { blocks };

	const url = 'https://hooks.slack.com/services/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';
	fetch(url, { method: 'POST', body: JSON.stringify(body) });
};

const RatingQuestion = ({ onValueChange, index, question }) => {
	return (
		<div className="space-y-2">
			<Typography>{question}</Typography>
			<RadioGroup
				className="grid grid-cols-5 items-center gap-2 text-2xl"
				id="support"
				onValueChange={(value) => onValueChange('question' + index, question, value)}
			>
				<Label htmlFor="support-1">1</Label>
				<Label htmlFor="support-2">2</Label>
				<Label htmlFor="support-3">3</Label>
				<Label htmlFor="support-4">4</Label>
				<Label htmlFor="support-5">5</Label>
				<RadioGroupItem id="support-1" value="1" />
				<RadioGroupItem id="support-2" value="2" />
				<RadioGroupItem id="support-3" value="3" />
				<RadioGroupItem id="support-4" value="4" />
				<RadioGroupItem id="support-5" value="5" />
			</RadioGroup>
		</div>
	);
};

export const Feedback = ({ onSubmit, show, onClose }) => {
	// Hooks
	// const { user, } = useUser();
	const { user } = useAuth();
	const { toast } = useToast();

	// State
	const [formdata, setFormdata] = React.useState({ name: user?.displayName, email: user?.email });

	const handleSubmit = () => {
		if (onSubmit) return onSubmit(formdata);

		onClose();
		postMessage(formdata);
		toast({ description: 'Submitted - Thanks for your feedback' });
	};

	const handleInputChange = (key, question, value) => {
		if (question) return setFormdata((prev) => ({ ...prev, [key]: { question, value } }));
		setFormdata((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<ConfirmDialog
			show={show}
			submitLabel="Submit feedback"
			onCancel={onClose}
			onClose={onClose}
			onConfirm={handleSubmit}
		>
			<div className="w-full max-w-3xl space-y-8">
				<div className="space-y-2">
					<Typography variant="h3" className="text-3xl font-bold">
						We'd love your feedback
					</Typography>
					<Typography className="text-gray-500 dark:text-gray-400">
						Help us improve our app by providing your feedback. We appreciate your time.
					</Typography>
				</div>

				{!user && (
					<>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								type="text"
								id="name"
								name="name"
								autocomplete="name"
								required
								placeholder="Enter your name"
								onChange={({ target }) => handleInputChange('name', null, target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Email</Label>
							<Input
								type="email"
								id="email"
								name="email"
								required
								placeholder="Enter your name"
								onChange={({ target }) => handleInputChange('email', null, target.value)}
							/>
						</div>
					</>
				)}

				{QUESTIONS.map((question, index) => (
					<RatingQuestion
						key={'question' + index}
						index={index}
						question={question}
						onValueChange={handleInputChange}
					/>
				))}

				<div className="space-y-2">
					<Typography>Share any other feedback you’d like us to know</Typography>
					<Textarea
						className="min-h-[100px]"
						id="feedback"
						placeholder="Enter your feedback"
						onChange={({ target }) => handleInputChange('feedback', null, target.value)}
					/>
					<Typography variant="muted">
						*User feedback is extremely important to early stage startups we value your opinions
					</Typography>
				</div>
			</div>
		</ConfirmDialog>
	);
};
