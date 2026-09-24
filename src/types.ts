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

export interface UserEducation {
  collegeName: string;
  endYear: string;
  degree: string;
  specialization: string;
}

export interface UserExperienceItem {
  workType: string;
  industry: string;
  currentSalary: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  jobTitle: string;
  description?: string;
  isCurrent?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  locality: string;
  avatar: string;
  gender?: string;
  birthday?: string;
  englishLevel?: string;
  knownLanguages?: string[];
  aboutMe?: string;
  totalWorkExperience?: string;
  experienceLevel?: string;
  experiences?: UserExperienceItem[];
  assets?: string[];
  educationDetails?: UserEducation;
  certifications?: string[];
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
  linkedInUrl?: string;
  linkedInHeadline?: string;
  linkedInImportedAt?: string;
  points?: number;
  coins?: number;
  referralCount?: number;
  rewardsClaimed?: string[];
  achievements?: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
}

export type ApplicationStatus =
  | 'Applied'
  | 'Viewed'
  | 'Shortlisted'
  | 'Interview'
  | 'Interviewing'
  | 'Rejected'
  | 'Selected';

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
  candidateName?: string;
  candidatePhone?: string;
  candidateEmail?: string;
  candidateExperience?: string;
  candidateQualification?: string;
  candidateSkills?: string[];
  matchScore?: string;
  resumeName?: string;
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

export type QuickReplyActionType = 'Shortlisted' | 'Rejected' | 'Interviewing';

export interface QuickReplyTemplate {
  id: string;
  actionType: QuickReplyActionType;
  title: string;
  category: string;
  subject: string;
  messageTemplate: string;
  suggestedTags?: string[];
  isCustom?: boolean;
}

export interface EmployerProfile {
  companyName: string;
  companyInitials: string;
  hubName: string;
  hrName: string;
  designation: string;
  workEmail: string;
  phone: string;
  officeAddress: string;
  city: string;
  state: string;
  pincode: string;
  cinNumber?: string;
  gstin?: string;
  industry: string;
  website?: string;
  isVerified: boolean;
  completionPercent: number;
}

export type PaymentModeType =
  | 'upi_qr'
  | 'cards'
  | 'netbanking'
  | 'bank_transfer'
  | 'cash_desk';

export interface PaymentModeConfig {
  id: PaymentModeType | string;
  name: string;
  description: string;
  isEnabled: boolean;
  isPopular?: boolean;
  discountOrOffer?: string;
  instructionNote?: string;
}

export interface QRCodeConfig {
  enabled: boolean;
  upiId: string;
  payeeName: string;
  merchantCode?: string;
  qrImageUrl?: string;
  qrTitle: string;
  qrSubtitle: string;
  allowReceiptUpload: boolean;
  supportPhoneForUpi?: string;
  transactionNote?: string;
  qrThemeColor?: string;
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  duration: string;
  popular: boolean;
  badge?: string;
  isEnabled?: boolean;
  // Active Time & Validity features
  activeTime?: string; // e.g. "30 Days Validity", "90 Days Full Access"
  validityDays?: number; // e.g. 30, 90, 180, 365
  activeStatus?: 'Active Now' | 'Limited Time' | 'Expiring Soon' | 'Always Active' | 'Paused';
  activeScheduleText?: string; // e.g. "Instant 24x7 Activation"
  timerCountdownHours?: number; // e.g. 24 or 48 for countdown banner
  showActiveTimer?: boolean;
  paymentModesAllowed?: string[];
  qrDiscountAmount?: string;
}

export interface PlatformSettings {
  platformName: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  paymentGatewayMode: 'Simulated UPI' | 'Razorpay Live' | 'PhonePe UPI' | 'Cashfree';
  ctaButtonText: string;
  ctaSecurityNote: string;
  allowDirectRecruiterCalls: boolean;
  requireJobModeration: boolean;
  autoVerifyHospitalJobs: boolean;
  freeDailyCandidateUnlocks: number;
  bannerAnnouncement?: string;
  showAnnouncement: boolean;
  // Payment Modes & QR Code config
  paymentModes?: PaymentModeConfig[];
  qrCodeConfig?: QRCodeConfig;
  activePlanOfferBadge?: string;
  activePlanGlobalTimerEnabled?: boolean;
  activePlanGlobalTimerHours?: number;
  activePlanGlobalTimerNote?: string;
}

