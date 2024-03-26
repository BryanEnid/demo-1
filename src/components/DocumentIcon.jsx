import { Icon } from '@iconify/react';
import React from 'react';

export const DocumentIcon = ({ extension, size, className }) => {
	const mimeMap = React.useRef(
		new Map([
			[
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				{ icon: 'bxs:file-doc', color: '#3781d1' }
			],
			['application/pdf', { icon: 'bxs:file-doc', color: '#ed3232' }],
			['text/plain', { icon: 'bxs:file-txt', color: '#b8b8b8' }]
		])
	);

	if (!mimeMap.current.has(extension))
		return <Icon icon={'bxs:file-blank'} className={className} fontSize={size} color={'#b8b8b8'} />;

	const { icon, color } = mimeMap.current.get(extension);

	return <Icon icon={icon} className={className} fontSize={size} color={color} />;
};
