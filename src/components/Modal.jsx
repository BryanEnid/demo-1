import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/chadcn/Button';

export function Modal({ show, onClose, title, children, onChange, initialFocus, disabled }) {
	const handleOnClose = () => {
		onClose();
	};

	return (
		<Transition.Root show={show} as={Fragment}>
			<Dialog as="div" className="relative z-10" initialFocus={initialFocus} onClose={handleOnClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-300/10 bg-opacity-75 transition-opacity backdrop-blur-sm" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform rounded-lg bg-white backdrop-blur-lg text-left shadow-xl transition-all sm:my-8 overflow-auto border border-white">
								<div className="x-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
									<div className="sm:flex sm:items-start">
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
												{title}
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">{children}</p>
											</div>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="bg-gray-50/30 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<Button
										// className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
										variant="ghost"
										onClick={() => onChange()}
										disabled={disabled}
									>
										Continue
									</Button>
									<button
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
										type="button"
										onClick={() => onClose()}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
