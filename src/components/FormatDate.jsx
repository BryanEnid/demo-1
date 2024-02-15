import React from 'react';

export const format = (dateString) => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
};

const FormatDate = ({ date: dateString }) => {
	const [output, setOutput] = React.useState();

	React.useEffect(() => {
		if (dateString) {
			const formattedDate = format(dateString);
			setOutput(formattedDate);
		}
	}, [dateString]);

	return <>{output}</>;
};

export default FormatDate;
