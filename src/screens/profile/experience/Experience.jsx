import { AboutSection } from './About';
import { AttachmentsSection } from './Attachments';
import { SkillsSection } from './Skills';
import { History } from './History';
import React from 'react';
import { useExperience } from './useExperience';

export function Experience() {
	// Hooks
	const { data, isLoading } = useExperience();

	// State

	const { about, skills, careerHistory, attachments, certifications } = React.useMemo(() => data || {}, [data]);

	if (isLoading) return <>Loading ...</>;

	return (
		<div className="flex flex-col gap-16 mb-24">
			<AboutSection data={about} />

			<SkillsSection data={skills} />

			<History title="Career History" data={careerHistory} />

			<History title="Certifications" data={certifications} />

			<AttachmentsSection data={attachments} />
		</div>
	);
}
