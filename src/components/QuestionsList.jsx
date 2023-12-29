import React, { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useAuth } from '@/providers/Authentication.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Textarea } from '@/chadcn/Textarea';
import { Button } from '@/chadcn/Button.jsx';
import { Typography } from '@/chadcn/Typography.jsx';
import useQuestions from '@/hooks/useQuestions.js';
import { CachedVideo } from '@/components/CachedVideo.jsx';

export const QuestionItem = ({ question, profile, upvoteQuestion, createAnswer }) => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [answer, setAnswer] = useState('');

	const handleCreateAnswer = async (e) => {
		e.preventDefault();
		await createAnswer({ id: question.id, data: { text: answer } });
		setAnswer('');
	};

	const handleCancelAnswer = () => {
		setOpen(false);
		setAnswer('');
	};

	const handleCapture = () => {
		navigate({
			pathname: '/capture',
			search: createSearchParams({ questionId: question.id }).toString()
		});
	};

	return (
		<div key={question.id} className="mb-[20px]">
			<div className="flex items-center">
				<div className="w-[46px] basis-10 shrink-0 flex items-center justify-center">
					<Button
						variant="ghost"
						className={`flex flex-col justify-center items-center`}
						onClick={() => upvoteQuestion(question.id)}
					>
						{!!question?.votes?.length && (
							<Typography variant="small" className="text-xs">
								{question.votes.length}
							</Typography>
						)}
						<Icon icon="ph:coin" color="#FFD233" />
					</Button>
				</div>
				<div>
					<Typography variant="p" className="text-lg">
						{question.text}
					</Typography>
				</div>
			</div>
			{(question.answer?.text || question.answer?.videoUrl) && (
				<div className="pl-[46px]">
					{!open ? (
						<Button
							variant="outline"
							className="text-primary"
							iconBegin={<Icon icon="uil:check" />}
							onClick={() => setOpen(true)}
						>
							Answer
						</Button>
					) : (
						<div>
							{!!question.answer?.text && (
								<Typography variant="p" className="font-semibold">
									{question.answer.text}
								</Typography>
							)}
							{!!question.answer?.videoUrl && (
								<CachedVideo
									controls
									src={question.answer.videoUrl}
									className="w-1/2  object-center rounded-none z-10"
								/>
							)}
						</div>
					)}
				</div>
			)}
			{!question.answer?.text && !question.answer?.videoUrl && profile.id === user.id && (
				<div className="pl-[46px]">
					{!open ? (
						<Button variant="outline" className="text-primary" onClick={() => setOpen(true)}>
							Answer
						</Button>
					) : (
						<div className="mt-2">
							<form onSubmit={handleCreateAnswer}>
								<Textarea value={answer} onChange={(e) => setAnswer(e.target.value)}></Textarea>
								<div className="flex flex-row justify-end gap-3 text-center text-white/50 w-full pt-2">
									<Button variant="link" onClick={() => handleCapture()} className="mr-auto">
										Capture video
									</Button>
									<Button variant="secondary" onClick={handleCancelAnswer} className="w-full max-w-[150px]">
										Cancel
									</Button>
									<Button type="submit" className="w-full max-w-[200px]" disabled={!answer.length}>
										Save
									</Button>
								</div>
							</form>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

const QuestionsList = ({ profile, scope }) => {
	const [createInpVal, setCreateInpVal] = useState('');

	const { user } = useAuth();
	const { data, createQuestion, upvoteQuestion, createAnswer } = useQuestions(scope);

	const handleCreateQuestion = async (e) => {
		e.preventDefault();
		await createQuestion({ ...scope, text: createInpVal });
		setCreateInpVal('');
	};

	return (
		<div>
			{profile?.id !== user?.id && (
				<div className="container pb-5 mb-10 border-b">
					<form className="relative" onSubmit={handleCreateQuestion}>
						<Input
							value={createInpVal}
							placeholder="Ask a question or vote with two cents below"
							className="rounded-full pr-24 h-10"
							onChange={(e) => setCreateInpVal(e.target.value)}
						/>
						<Button type="submit" variant="ghost" className="absolute top-0 right-0 rounded-full">
							Submit
						</Button>
					</form>
				</div>
			)}

			<div className="container">
				{!!data?.length &&
					data.map((question) => (
						<QuestionItem
							key={question.id}
							question={question}
							profile={profile}
							upvoteQuestion={upvoteQuestion}
							createAnswer={createAnswer}
						/>
					))}
			</div>
		</div>
	);
};

export default QuestionsList;
