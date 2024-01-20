import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, suppressStyles, ...props }, ref) => (
	<textarea
		className={cn(
			!suppressStyles &&
				'flex min-h-[60px] h-auto w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			'flex min-h-[60px] h-auto w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-md placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		ref={ref}
		{...props}
	/>
));
Textarea.displayName = 'Textarea';

export { Textarea };
