import { Icon } from '@iconify/react';
import React from 'react';

export function Spinner({ size, ...props }) {
	return <Icon fontSize={size} icon="eos-icons:loading" {...props} />;
}
