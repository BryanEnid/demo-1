import React from 'react';

import QuestionsList from '@/components/QuestionsList.jsx';
import { useProfile } from '@/hooks/useProfile.js';

const Quests = () => {
	const { data: profile } = useProfile();

	if (!profile?.id) {
		return null;
	}

	return <QuestionsList profile={profile} scope={{ userProfileId: profile.id }} />;
};

export default Quests;
