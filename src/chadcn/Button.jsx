import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { Typography } from './Typography';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'rounded-full bg-primary text-primary-foreground hover:bg-primary/0',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'rounded-full border border-primary text-primary-foreground hover:bg-primary/0',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: `
				xl:py-2 xl:px-4 xl:h-10

				md:py-4 md:px-3 md:h-5 

				py-4 px-3 h-10 
				`,
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

/**
 * @typedef {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} ButtonVariant
 */
const VARIANT_OPTIONS = {
	DEFAULT: 'default',
	DESTRUCTIVE: 'destructive',
	OUTLINE: 'outline',
	SECONDARY: 'secondary',
	GHOST: 'ghost',
	LINK: 'link'
};

/**
 * @typedef {'default' | 'sm' | 'lg' | 'icon'} ButtonSize
 */
const SIZE_OPTIONS = {
	DEFAULT: 'default',
	SM: 'sm',
	LG: 'lg',
	ICON: 'icon'
};

/**
 * Props for the Button component
 *
 * @typedef {Object} ButtonProps
 * @property {string} [className] - Additional class names for the button
 * @property {ButtonVariant} [variant='default'] - Visual variant of the button
 * @property {ButtonSize} [size='default'] - Size of the button
 * @property {boolean} [asChild=false] - Whether to render as Slot child
 * @property {() => void} [onClick] - Click handler function
 * @property {ReactNode} [children] - Button label or content
 *
 * @typedef {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} ButtonVariant
 * @property {'default'} [variant='default'] - Default filled button style
 * @property {'destructive'} [variant='destructive'] - Destructive action button style
 * @property {'outline'} [variant='outline'] - Outlined button style
 * @property {'secondary'} [variant='secondary'] - Secondary button style
 * @property {'ghost'} [variant='ghost'] - Ghost button style
 * @property {'link'} [variant='link'] - Link-styled button
 *
 * @typedef {'default' | 'sm' | 'lg' | 'icon'} ButtonSize
 * @property {'default'} [size='default'] - Medium size button
 * @property {'sm'} [size='sm'] - Small size button
 * @property {'lg'} [size='lg'] - Large size button
 * @property {'icon'} [size='icon'] - Icon size button
 */

/**
 * Primary UI button component
 *
 * @param {ButtonProps} props
 * @returns {JSX.Element}
 */
function Button({
	className,
	iconBegin,
	iconEnd,
	variant = 'default',
	size = 'default',
	asChild = false,
	children,
	...props
}) {
	// Validate variant and size
	if (!Object.values(VARIANT_OPTIONS).includes(variant)) console.warn(`Invalid variant: ${variant}`);
	if (!Object.values(SIZE_OPTIONS).includes(size)) console.warn(`Invalid size: ${size}`);

	const Comp = asChild ? Slot : 'button';

	return (
		<Comp className={cn(buttonVariants({ variant, size }), 'flex flex-col items-center', className)} {...props}>
			<div className="flex gap-3 justify-between items-center">
				{(iconBegin || iconEnd) && <Typography variant="large">{iconBegin}</Typography>}
				<Typography variant="small">{children}</Typography>
				{(iconBegin || iconEnd) && <Typography variant="large">{iconEnd}</Typography>}
			</div>
		</Comp>
	);
}

Button.displayName = 'Button';

// Use PropTypes to specify the possible values for variant and size
Button.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.oneOf(Object.values(VARIANT_OPTIONS)),
	size: PropTypes.oneOf(Object.values(SIZE_OPTIONS)),
	asChild: PropTypes.bool,
	onClick: PropTypes.func,
	children: PropTypes.node,
	iconBegin: PropTypes.node,
	iconEnd: PropTypes.node
};

export { Button, buttonVariants };
