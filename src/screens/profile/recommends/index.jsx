import React from 'react';

import useRecommends from '@/hooks/useRecommends.js';
import { useProfile } from '@/hooks/useProfile.js';
import { Spinner } from '@/components/Spinner.jsx';
import Articles from './Articles';
import Books from '@/screens/profile/recommends/Books.jsx';
import Tools from '@/screens/profile/recommends/Tools.jsx';
import People from '@/screens/profile/recommends/People.jsx';
import Podcasts from '@/screens/profile/recommends/Podcasts.jsx';
import Videos from '@/screens/profile/recommends/Videos.jsx';

const Recommends = () => {
	const { data: profile, isUserProfile } = useProfile();
	const { data: recommends, isLoading } = useRecommends(profile?.id);

	if (isLoading) {
		return (
			<div className="flex justify-center py-10">
				<Spinner size={36} />
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-24 mb-24">
			{!recommends?.articles.length && !isUserProfile ? null : (
				<Articles data={recommends?.articles} isUserProfile={isUserProfile} />
			)}
			{!recommends?.books.length && !isUserProfile ? null : (
				<Books data={recommends?.books} isUserProfile={isUserProfile} />
			)}
			{!recommends?.tools.length && !isUserProfile ? null : (
				<Tools data={recommends?.tools} isUserProfile={isUserProfile} />
			)}
			{!recommends?.people.length && !isUserProfile ? null : (
				<People data={recommends?.people} isUserProfile={isUserProfile} />
			)}
			{!recommends?.podcasts?.length && !isUserProfile ? null : (
				<Podcasts data={recommends.podcasts} isUserProfile={isUserProfile} />
			)}
			{!recommends?.videos.length && !isUserProfile ? null : (
				<Videos data={recommends.videos} isUserProfile={isUserProfile} />
			)}
		</div>
	);
};

export default Recommends;
