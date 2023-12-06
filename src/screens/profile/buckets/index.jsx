import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BucketItem } from './BucketItem';
import { useBuckets } from '@/hooks/useBuckets';

export function Buckets() {
	const { buckets } = useBuckets();

	if (!buckets?.length) return <></>;

	return (
		<div layout className="grid grid-cols-5 gap-16">
			{buckets.map((bucket, index) => (
				<motion.div
					key={bucket.id}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: index * 0.05 }}
				>
					<BucketItem data={bucket} name={bucket.name} preview={bucket.videos[0]?.videoUrl} documentId={bucket.id} />
				</motion.div>
			))}
		</div>
	);
}
