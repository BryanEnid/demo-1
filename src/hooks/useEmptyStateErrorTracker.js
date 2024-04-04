import { useState, useEffect } from 'react';

export const useEmptyStateErrorTracker = (initialStates) => {
	const [error, setError] = useState('');
	const [disabledSubmit, setDisabledSubmit] = useState(false);
	let requiredStateList = initialStates;

	useEffect(() => {
		setDisabledSubmit(false);
		stateUpdated();
	}, initialStates);

	const hasEmptyState = () => requiredStateList.some((value) => !value);

	const findEmptyStateError = (message = 'Action Required') => {
		const isEmpty = hasEmptyState();
		setError(isEmpty ? message : '');
		return isEmpty;
	};

	const stateUpdated = () => {
		if (!hasEmptyState()) {
			setError('');
		}
	};

	return { error, setError, findEmptyStateError, disabledSubmit, setDisabledSubmit };
};
