import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/Authentication.jsx';
import { Typography } from '@/chadcn/Typography';
import { Input } from '@/chadcn/Input.jsx';
import { Button } from '@/chadcn/Button';
// import { Spinner } from '@/components/Spinner.jsx';
import { Image } from '@/components/Image';
import { Icon } from '@iconify/react';
// import { Calendar } from '@/chadcn/Calendar.jsx';
// import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/chadcn/Popover';
// import FormatDate from '@/components/FormatDate.jsx';
// import { Listbox } from '@headlessui/react';
import useSettings from '@/hooks/useSettings.js';

const initialValues = {
	uid: '',
	email: '',
	name: '',
	fname: '',
	lname: '',
	headline: '',
	bio: '',
	title: '',
	company: '',
	image: null
};
const Settings = () => {
	const { user } = useAuth();
	const [values, setValues] = useState(initialValues);
	const [isDragOver, setIsDragOver] = React.useState(false);
	const fileInpRef = useRef();
	// const navigate = useNavigate();
	const { data: settings, updateSettings, uploadUserProfilePicture } = useSettings();

	useEffect(() => {
		if (settings.uid) {
			setValues((val) => ({
				...val,
				...settings
			}));
		} else if (user && !values.email) {
			const fullNameArr = user.name.split(' ');
			setValues((val) => ({
				...val,
				uid: user.uid,
				name: user.name,
				fname: fullNameArr[0],
				lname: fullNameArr[1],
				email: user.email,
				bio: '',
				company: '',
				headline: '',
				title: ''
			}));
		}
	}, [user]);
	// useEffect(() => {
	// 	if (data?.id) {
	// 		setValues({
	// 			email: data.individual.email,
	// 			fname: data.individual?.first_name,
	// 			lname: data.individual?.last_name,
	// 		});
	// 	}
	// }, [data]);
	// if (user && profile && user?.id !== profile?.id) {
	// 	navigate(`/${profile.uid}`);
	// }
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateSettings(values);
		} catch (error) {
			console.log('onSubmit error: ', error);
		}
		// finally {
		// setLoading(false);
		// console.log('Finish line');
		// }
	};
	const handleUpload = async (image) => {
		if (!image) return;
		const fd = new FormData();
		fd.append('image', image.file);
		try {
			await uploadUserProfilePicture(fd);
		} catch (error) {
			console.log('onSubmitImage error: ', error);
		}
	};

	const handleChange = (e) => {
		setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		const value = { file, url: URL.createObjectURL(file) };
		setValues((val) => ({ ...val, image: value }));
		handleUpload(value);
	};

	const openFileExplorer = () => {
		fileInpRef.current?.click?.();
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};
	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		if (!e.dataTransfer.files.length > 0) return;
		const { files } = e.dataTransfer;
		const file = files[0];
		if (!file || !file.type.startsWith('image/')) return alert('Please drop a valid image files.');
		const value = { files, url: URL.createObjectURL(files) };
		handleChange({ target: { name: 'image', value } });
	};

	return (
		<div className="container pb-28 sm:pb-10 ">
			<Typography variant="h2">Settings</Typography>
			<div className="w-96 pt-4">
				<form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
					<div>
						<div className="flex justify-center">
							<input type="file" className="hidden" accept="image/*" ref={fileInpRef} onChange={handleImageChange} />

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
								{values.image?.url || values.image ? (
									<Image
										src={values.image?.url || values.image}
										className="rounded-full object-cover aspect-square w-36 2xl:w-48 "
									/>
								) : (
									<Icon icon="lucide:upload" className="text-5xl opacity-50" />
								)}
							</div>
						</div>
						{/* TODO: Minimize repeated code */}
						{/* TODO: handle onEnter key to submit */}
						<Input name="headline" value={values.headline} placeholder="Headline" onChange={handleChange} />
						<Input name="email" value={values.email} placeholder="Email" onChange={handleChange} />
						<Input name="fname" value={values.fname} placeholder="First Name" onChange={handleChange} />
						<Input name="lname" value={values.lname} placeholder="Last Name" onChange={handleChange} />
						<Input name="title" value={values.title} placeholder="Title" onChange={handleChange} />
						<Input name="company" value={values.company} placeholder="Company" onChange={handleChange} />
						<Input name="bio" value={values.bio} placeholder="Bio" onChange={handleChange} />
						<Input name="uid" value={values.uid} placeholder="uid" disabled />
					</div>
					<div className="flex justify-end gap-2 w-full">
						{/* <Button type="submit" className="px-10" disabled={settingsLoading}> */}
						<Button type="submit" className="px-10">
							{/* {settingsLoading ? <Spinner size={24} /> : 'Save'} */}
							{'Save'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Settings;
