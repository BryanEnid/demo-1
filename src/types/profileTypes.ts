export interface Skill {
	label: string;
	iconUrl: string;
	iconCode: string;
	createdAt: string; // Consider using Date type if you parse this string to a Date object
	updatedAt: string; // Consider using Date type if you parse this string to a Date object
	id: string;
}

export interface CareerHistory {
	title: string;
	company: string;
	companyLogoUrl: string;
	startDate: string; // Consider using Date type if you parse this string to a Date object
	endDate: string | null; // Consider using Date type if you parse this string to a Date object
	currentCompany: boolean;
	bucketId: string;
	createdAt: string; // Consider using Date type if you parse this string to a Date object
	updatedAt: string; // Consider using Date type if you parse this string to a Date object
	id: string;
}

export interface Certification {
	// Define the structure of Certification if necessary
}

export interface Attachment {
	fileUrl: string;
	createdAt: string; // Consider using Date type if you parse this string to a Date object
	updatedAt: string; // Consider using Date type if you parse this string to a Date object
	id: string;
}

export type ProfileBody = {
	uid: string;
	about: string;
	skills: Skill[];
	careerHistory: CareerHistory[];
	certifications: Certification[]; // Define the type of certifications if needed
	attachments: Attachment[];
	createdAt: string; // Consider using Date type if you parse this string to a Date object
	updatedAt: string; // Consider using Date type if you parse this string to a Date object
	id: string;
};

export type ExperienceType = {
	// Define the structure of ExperienceType if necessary
};
