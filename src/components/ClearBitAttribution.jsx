import { Button } from '@/chadcn/Button';
import { Icon } from '@iconify/react';

export const ClearBitAttribution = () => {
	return (
		<Button className="self-end m-0 p-0 inline" variant="link" asChild>
			<a target="__blank" href="https://clearbit.com">
				Logos provided by Clearbit
				<Icon icon="fluent:window-new-16-filled" className="inline pb-1 ml-1" fontSize={20} />
			</a>
		</Button>
	);
};
