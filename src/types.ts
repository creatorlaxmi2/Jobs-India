export type TabType = 'home' | 'all-jobs' | 'activity' | 'premium' | 'profile';

export type AppMode = 'job-seeker' | 'employer' | 'admin';

export type JobType = 'Full Time' | 'Part Time' | 'Work From Home' | 'Internship';

export interface RecruiterContact {
  name: string;
  designation: string;
  phone: string;
  email: string;
  isVerified?: boolean;
  kycDocument?: string;
  companyGstin?: string;
  verifiedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoBg: string;
  companyLogoText: string;
  location: string;
  locality: string;
  distance: string;
  salary: string;
  minSalary: number;
  maxSalary: number;
  experience: string;
  jobType: JobType;
  isWorkFromHome: boolean;
  isHighSalary: boolean;
  isUrgent: boolean;
  isNew: boolean;
  postedTime: string;
  applicantsCount: number;
  vacancies: number;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  benefits: string[];
  aboutCompany: {
    rating: number;
    reviewsCount: number;
    employees: string;
    industry: string;
    address: string;
    verified: boolean;
  };
  recruiterContact?: RecruiterContact;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  locality: string;
  avatar: string;
  education: string;
  experience: string;
  currentSalary: string;
  expectedSalary: string;
  skills: string[];
  resumeName: string;
  resumeUploadedAt: string;
  preferredRoles: string[];
  preferredLocations: string[];
  workPreference: 'All' | 'Work From Home' | 'In-Office' | 'Hybrid';
  completionPercentage: number;
}

export type ApplicationStatus = 'Applied' | 'Viewed' | 'Shortlisted' | 'Interview' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusTimeline: {
    stage: string;
    date: string;
    note: string;
    completed: boolean;
    current?: boolean;
  }[];
  hrContact?: {
    name: string;
    designation: string;
    phone: string;
  };
}

export interface HRRequest {
  id: string;
  recruiterName: string;
  company: string;
  role: string;
  salary: string;
  location: string;
  receivedAt: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  message: string;
}

export interface NotificationItem {
  id: string;
  type: 'hr' | 'application' | 'job_match' | 'interview' | 'profile';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
}

export interface JobPreference {
  preferredRoles: string[];
  preferredLocations: string[];
  expectedSalary: string;
  experience: string;
  workMode: string;
  isConfigured: boolean;
}
