import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useBuckets } from '@/hooks/useBuckets';
import { useProfile } from '@/hooks/useProfile';

import { Typography } from '@/chadcn/Typography.jsx';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@/chadcn/Button.jsx';
import { Input } from '@/chadcn/Input.jsx';

import { BucketItem } from './BucketItem';

const UNCATEGORIZED_BUCKETS_LABEL = 'Default';

export function Buckets() {
	// Hooks
	const { data: profile } = useProfile();
	const { data: buckets } = useBuckets(profile);
	const [{ isUserProfile, createBucket }] = useOutletContext();

	// State
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [newCategoryValue, setNewCategoryValue] = useState('');
	const [tmpCategories, setTmpCategories] = useState([]);

	// Refs
	const newCategoryRef = useRef();

	const groupedBucket = useMemo(
		() => Object.groupBy(buckets || [], ({ category }) => category || UNCATEGORIZED_BUCKETS_LABEL),
		[buckets]
	);

	useEffect(() => {
		newCategoryRef.current?.focus?.();
	}, [showNewCategory]);

	useEffect(() => {
		const filteredCategories = tmpCategories.filter((category) => !groupedBucket[category]);
		setTmpCategories(filteredCategories);
	}, [buckets]);

	if (!buckets?.length) return <></>;

	const saveCategory = () => {
		setNewCategoryValue('');
		setShowNewCategory(false);
		setTmpCategories((val) => [newCategoryValue, ...val]);
	};

	return (
		<div>
			{isUserProfile && (
				<div className="flex justify-end mb-8 min-h-[40px]">
					<Button
						variant="ghost"
						className="rounded-full border"
						disabled={showNewCategory}
						iconBegin={<Icon icon="ic:round-plus" />}
						onClick={() => setShowNewCategory(true)}
					>
						Add section
					</Button>
				</div>
			)}

			<div className="flex flex-col">
				{showNewCategory && (
					<div className="mb-20 flex items-center gap-1">
						<Input
							ref={newCategoryRef}
							value={newCategoryValue}
							placeholder="Section Name"
							onChange={({ target }) => setNewCategoryValue(target.value)}
							className="bg-white/10 w-[300px]"
						/>
						<Button
							variant="default"
							className="rounded-full border"
							iconBegin={<Icon icon="ic:round-plus" />}
							onClick={saveCategory}
						>
							Save
						</Button>
						<Button variant="secondary" className="rounded-full" onClick={() => setShowNewCategory(false)}>
							Cancel
						</Button>
					</div>
				)}

				{!!tmpCategories.length &&
					tmpCategories.map((category) => (
						<div key={category} className="mb-20">
							<Typography variant="h3" className="mb-9">
								{category}
							</Typography>
							<div className="grid grid-cols-5 gap-16">
								{isUserProfile && (
									<motion.div
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="flex items-center"
									>
										<BucketItem
											defaultIcon="ic:round-plus"
											width="w-[64px]"
											iconProps={{ color: '#06f', fontSize: '42px' }}
											onClick={() => createBucket({ category })}
										/>
									</motion.div>
								)}
							</div>
						</div>
					))}

				{Object.keys(groupedBucket).map((category) => (
					<div key={category} className="mb-20">
						<Typography variant="h3" className="mb-9">
							{category}
						</Typography>
						<div className="grid grid-cols-5 gap-16">
							{groupedBucket[category].map((bucket, index) => (
								<motion.div
									key={bucket.id}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
								>
									<BucketItem
										data={bucket}
										name={bucket.name}
										preview={bucket.videos[0]?.videoUrl}
										documentId={bucket.id}
									/>
								</motion.div>
							))}
							{isUserProfile && (
								<motion.div
									key="ADD NEW"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: groupedBucket[category].length * 0.05 }}
									className="flex items-center"
								>
									<BucketItem
										defaultIcon="ic:round-plus"
										width="w-[64px]"
										iconProps={{ color: '#06f', fontSize: '42px' }}
										onClick={() => createBucket({ category })}
									/>
								</motion.div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
