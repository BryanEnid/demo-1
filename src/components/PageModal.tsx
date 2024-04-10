import React, { Fragment, ReactNode, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface PageModalProps {
	children: ReactNode;
	show: boolean;
	onClose?: () => void;
	width?: string;
	maxWidth?: string;
	initialFocus?: React.MutableRefObject<HTMLElement | null>;
	zIndex?: number;
	className?: string;
}

export function PageModal({
	children,
	show,
	onClose = () => {},
	width,
	maxWidth = '100vw',
	initialFocus,
	zIndex,
	className
}: PageModalProps) {
	return (
		<Transition.Root show={show} as={Fragment}>
			<Dialog className="relative" style={{ zIndex: zIndex ?? 10 }} initialFocus={initialFocus} onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 brightness-95 backdrop-blur-sm" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen">
					<div className="flex min-h-full items-end justify-center text-center sm:items-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="drop-shadow-[0_5px_5px_rgba(255,255,255,200)] overflow-hidden border backdrop-blur-sm border-gray-200 relative transform rounded-lg text-left transition-all max-w-7xl">
								<div
									style={{
										background: 'white',
										backdropFilter: 'blur(10px)'
									}}
								>
									<div className="sm:flex sm:items-start">
										<div
											className={cn('text-center sm:text-left', className)}
											style={{
												// width: '100%',
												width,
												maxWidth,
												maxHeight: '95vh', // Set a max height for the modal content
												overflowY: 'auto' // Allow content to scroll if it exceeds the max height
											}}
										>
											{children}
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
