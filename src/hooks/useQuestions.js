import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/Authentication.jsx';

import {
	fetchQuestions,
	createQuestion,
	updateQuestion,
	upvoteQuestion,
	createAnswer,
	uploadVideoAnswer
} from './api/questions.js';

const COLLECTION_NAME = 'Questions';

const useQuestions = (query = {}) => {
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, user?.id, ...Object.keys(query), ...Object.values(query)];

	const { data } = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: () => (user?.id ? fetchQuestions(auth, query) : null)
	});

	const createQuestionMutation = useMutation({
		mutationFn: (data) => createQuestion(auth, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});

	const updateQuestionMutation = useMutation({
		mutationFn: ({ id, data }) => updateQuestion(auth, id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});

	const upvoteQuestionMutation = useMutation({
		mutationFn: (id) => upvoteQuestion(auth, id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});

	const createAnswerMutation = useMutation({
		mutationFn: ({ id, data }) => createAnswer(auth, id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});

	const uploadVideoAnswerMutation = useMutation({
		mutationFn: ({ id, data }) => {
			const body = new FormData();
			body.append('video', data.video);
			return uploadVideoAnswer(auth, id, body);
		},
		onMutate: ({ onLoading }) => {
			typeof onLoading === 'function' && onLoading();
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});

	return {
		data: data || [],
		createQuestion: createQuestionMutation.mutateAsync,
		updateQuestion: updateQuestionMutation.mutateAsync,
		upvoteQuestion: upvoteQuestionMutation.mutateAsync,
		createAnswer: createAnswerMutation.mutateAsync,
		uploadVideoAnswer: uploadVideoAnswerMutation.mutateAsync
	};
};

export default useQuestions;
