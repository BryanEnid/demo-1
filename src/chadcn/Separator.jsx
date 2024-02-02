'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

// const Separator = React.forwardRef(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
// 	<SeparatorPrimitive.Root
// 		ref={ref}
// 		decorative={decorative}
// 		orientation={orientation}
// 		className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
// 		{...props}
// 	/>
// ));
// Separator.displayName = SeparatorPrimitive.Root.displayName;

const Separator = ({ className }) => {
	return <div className={cn('h-[1px] w-full bg-black/20 mt-1', className)} />;
};

export { Separator };
