import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Listbox, Popover } from '@headlessui/react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { PageModal } from '@/components/PageModal.jsx';
import { Spinner } from '@/components/Spinner.jsx';
import { Button } from '@/chadcn/Button.jsx';
import { Typography } from '@/chadcn/Typography.jsx';
import { Input } from '@/chadcn/Input.jsx';
import useOrganizations from '@/hooks/useOrganizations.js';
import { organizationTypes } from '@/screens/organizations/constants.js';
import { Image } from './Image';

const Step1 = ({ values, handleChange }) => {
	const [isDragOver, setIsDragOver] = React.useState(false);

	const fileInpRef = useRef();

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const prepareFiles = (file) => {
		const value = { file, url: URL.createObjectURL(file) };
		handleChange({ target: { name: 'picture', value } });
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		if (!e.dataTransfer.files.length > 0) return;

		const { files } = e.dataTransfer;
		const file = files[0];

		if (!file || !file.type.startsWith('image/')) return alert('Please drop a valid image files.');

		prepareFiles(files);
	};

	const handleFilesChange = (e) => {
		prepareFiles(e.target.files[0]);
	};

	const openFileExplorer = () => {
		fileInpRef.current?.click?.();
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-center">
				<input type="file" className="hidden" accept="image/*" ref={fileInpRef} onChange={handleFilesChange} />
				<div
					onClick={openFileExplorer}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					style={{ transition: '0.5s' }}
					className={[
						'border-dashed border border-black/30 bg-gray-300/30 rounded-full transition relative overflow-hidden cursor-pointer w-[120px] aspect-square flex justify-center items-center',
						isDragOver && 'bg-primary'
					].join(' ')}
				>
					{values.picture?.url ? (
						<Image src={values.picture.url} className="object-cover " />
					) : (
						<Icon icon="lucide:upload" className="text-5xl opacity-50" />
					)}
				</div>
			</div>
			<Input name="name" value={values.name} placeholder="Org Name" onChange={handleChange} />
			<Input name="tagline" value={values.tagline} placeholder="One liner" onChange={handleChange} />
		</div>
	);
};

const accessOptions = [
	{ value: true, label: 'Private' },
	{ value: false, label: 'Public' }
];
/**
 * @type {{label: String, value: String}[]} Array of value/label objects
 */
const typeOptions = Object.keys(organizationTypes).map((key) => ({ value: key, label: organizationTypes[key] }));

const Step2 = ({ values, handleChange }) => {
	const onChange = (name, value) => {
		handleChange({ target: { name, value } });
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<Typography variant="h4" className="text-sm mb-1">
					Group Type
				</Typography>
				<div className="w-full relative">
					<Listbox value={values.type} onChange={(value) => onChange('type', value)}>
						<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
							{values.type ? (
								<div className="truncate">{typeOptions.find(({ value }) => value === values.type)?.label}</div>
							) : (
								<div>
									<Typography variant="muted">Choose</Typography>
								</div>
							)}
							<span>
								<CaretSortIcon className="h-4 w-4 opacity-50" />
							</span>
						</Listbox.Button>
						<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
							{typeOptions.map(({ value, label }) => (
								<Listbox.Option
									key={value}
									value={value}
									className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
								>
									{({ selected }) => (
										<>
											<span>{label}</span>
											{selected && (
												<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
													<CheckIcon className="h-4 w-4" aria-hidden="true" />
												</span>
											)}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Listbox>
				</div>
			</div>
			<div>
				<Typography variant="h4" className="text-sm mb-1">
					Access
				</Typography>
				<div className="w-full relative">
					<Listbox value={values.private} onChange={(value) => onChange('private', value)}>
						<Listbox.Button className="relative flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
							<div className="truncate">{values.private /*=== 'true'*/ ? 'Private' : 'Public'}</div>
							<span>
								<CaretSortIcon className="h-4 w-4 opacity-50" />
							</span>
						</Listbox.Button>
						<Listbox.Options className="absolute z-50 w-full min-w-[8rem] p-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[headlessui-state=open]:animate-in data-[headlessui-state=closed]:animate-out data-[headlessui-state=closed]:fade-out-0 data-[headlessui-state=open]:fade-in-0 data-[headlessui-state=closed]:zoom-out-95 data-[headlessui-state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
							{accessOptions.map(({ value, label }) => (
								<Listbox.Option
									key={value}
									value={value}
									className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
								>
									{({ selected }) => (
										<>
											<span>{label}</span>
											{selected && (
												<span className="absolute  right-2 h-3.5 w-3.5 flex items-center justify-center">
													<CheckIcon className="h-4 w-4" aria-hidden="true" />
												</span>
											)}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Listbox>
				</div>
			</div>
		</div>
	);
};

const modalSteps = [Step1, Step2];

const initialState = {
	name: '',
	tagline: '',
	picture: null,
	private: false,
	type: ''
};

const CreateOrganizationModal = ({ open, isLoading, onClose: handleClose, onCreate: handleCreate }) => {
	const [modalStep, setModalStep] = useState(0);
	const [orgData, setOrgData] = useState(initialState);

	const ModalStepComponent = modalSteps[modalStep];
	const isValid = [!!(orgData.name && orgData.tagline && orgData.picture), !!orgData.type];

	const create = async () => {
		const { picture, ...data } = orgData;
		const fd = new FormData();
		fd.append('picture', picture.file);

		await handleCreate({
			...data,
			picture: fd
		});
		handleClose();
	};

	const closeModal = () => {
		setModalStep(0);
		handleClose();
	};

	const nextStep = () => {
		setModalStep((val) => (val < modalSteps.length - 1 ? val + 1 : val));
	};

	const prevStep = () => {
		setModalStep((val) => (val > 0 ? val - 1 : val));
	};

	const handleChange = (e) => {
		setOrgData((val) => ({ ...val, [e.target.name]: e.target.value }));
	};

	return (
		<PageModal show={open} onClose={closeModal} width="600px">
			<div className="flex flex-col justify-center p-8 gap-10">
				<div className="flex flex-col justify-center items-center pb-2 relative px-[40px]">
					<Typography variant="h3" className="text-center">
						Create a new organization
					</Typography>
					<Typography variant="muted" className="text-center text-sm">
						For groups looking to develop a co-curated profile
					</Typography>
					<Button
						variant="ghost"
						className="rounded-full w-[40px] h-[40px] absolute top-[-2px] right-0"
						onClick={closeModal}
					>
						<Icon icon="mingcute:close-fill" className="text-2xl" />
					</Button>
				</div>
				<div>
					<ModalStepComponent values={orgData} handleChange={handleChange} />
				</div>
				<div className="flex justify-end gap-2 w-full">
					{modalStep === 0 ? (
						<Button variant="secondary" className="rounded-md" onClick={closeModal}>
							Cancel
						</Button>
					) : (
						<Button variant="outline" className="rounded-md text-primary" disabled={isLoading} onClick={prevStep}>
							<Icon icon="uiw:left" className="text-2xl"></Icon>
						</Button>
					)}
					{modalStep === modalSteps.length - 1 ? (
						<Button className="px-10 rounded-md" disabled={!isValid.every(Boolean) || isLoading} onClick={create}>
							{isLoading ? <Spinner size={24} /> : 'Create'}
						</Button>
					) : (
						<Button className="px-10 rounded-md" disabled={!isValid[modalStep]} onClick={nextStep}>
							Continue
						</Button>
					)}
				</div>
			</div>
		</PageModal>
	);
};

export default CreateOrganizationModal;
