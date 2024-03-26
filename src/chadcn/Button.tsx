import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { Typography } from './Typography';

export const buttonVariants = cva(
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
          xl:py-2 xl:px-4

          md:py-4 md:px-3  

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

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
	className?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	asChild?: boolean;
	iconBegin?: React.ReactNode;
	iconEnd?: React.ReactNode;
	align?: 'start' | 'center' | 'end';
	children?: React.ReactNode;
}

const VARIANT_OPTIONS: Record<string, ButtonVariant> = {
	DEFAULT: 'default',
	DESTRUCTIVE: 'destructive',
	OUTLINE: 'outline',
	SECONDARY: 'secondary',
	GHOST: 'ghost',
	LINK: 'link'
};

const SIZE_OPTIONS: Record<string, ButtonSize> = {
	DEFAULT: 'default',
	SM: 'sm',
	LG: 'lg',
	ICON: 'icon'
};

function Button({
	className,
	iconBegin,
	iconEnd,
	variant = 'default',
	size = 'default',
	asChild = false,
	align = 'center',
	children,
	...props
}: ButtonProps) {
	// Validate variant and size
	if (!Object.values(VARIANT_OPTIONS).includes(variant)) console.warn(`Invalid variant: ${variant}`);
	if (!Object.values(SIZE_OPTIONS).includes(size)) console.warn(`Invalid size: ${size}`);

	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			className={cn(buttonVariants({ variant, size }), `flex flex-col`, align && `items-${align}`, className)}
			{...props}
		>
			<div className="flex gap-3 justify-between items-center">
				{(iconBegin || iconEnd) && <Typography variant="large">{iconBegin}</Typography>}
				<Typography variant="small">{children}</Typography>
				{(iconBegin || iconEnd) && <Typography variant="large">{iconEnd}</Typography>}
			</div>
		</Comp>
	);
}

Button.displayName = 'Button';

Button.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.oneOf(Object.values(VARIANT_OPTIONS)) as PropTypes.Validator<ButtonVariant>,
	size: PropTypes.oneOf(Object.values(SIZE_OPTIONS)) as PropTypes.Validator<ButtonSize>,
	asChild: PropTypes.bool,
	onClick: PropTypes.func,
	children: PropTypes.node,
	iconBegin: PropTypes.node,
	iconEnd: PropTypes.node
};

export { Button };
