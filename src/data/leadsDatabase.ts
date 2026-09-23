import { Application, UserProfile, Job, EmployerProfile } from '../types';

export interface JobSeekerLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  locality: string;
  education: string;
  experience: string;
  currentSalary?: string;
  expectedSalary?: string;
  preferredRole: string;
  skills: string[];
  resumeName?: string;
  leadStatus: 'New Lead' | 'Contacted' | 'Screened' | 'Interview Scheduled' | 'Hired / Placed' | 'Cold / Inactive';
  appliedJobsCount: number;
  lastActiveDate: string;
  isVerified: boolean;
  source: 'Direct Registration' | 'Job Application' | 'Resume Upload' | 'WhatsApp Inbound';
  appliedJobsSummary?: string;
}

export interface EmployerLead {
  id: string;
  companyName: string;
  hrName: string;
  designation: string;
  phone: string;
  email: string;
  city: string;
  locality: string;
  industry: string;
  gstin?: string;
  cin?: string;
  postedJobsCount: number;
  totalInquiriesReceived: number;
  leadStatus: 'Verified Active' | 'Pending KYC' | 'Follow-up Needed' | 'Enterprise Client' | 'Dormant';
  registeredDate: string;
  isVerified: boolean;
  planType: 'Enterprise' | 'Pro Recruiter' | 'Free Standard';
}

export const INITIAL_JOB_SEEKER_LEADS: JobSeekerLead[] = [
  {
    id: 'lead-js-1',
    name: 'Laxmi Kumari',
    phone: '+91 88630 90950',
    email: 'sitarampatna7@gmail.com',
    city: 'Patna',
    locality: 'Muhammadpur',
    education: 'GNM Nursing Diploma - Mona (2027)',
    experience: '1 Year (Nursing Supervisor at Oxig)',
    currentSalary: '₹9,500 / mo',
    expectedSalary: '₹18,000 - ₹25,000 / mo',
    preferredRole: 'Staff Nurse / Nursing Supervisor',
    skills: ['Patient Care', 'Staff Nurse', 'Vitals Monitoring', 'Ward Management'],
    resumeName: 'Laxmi_Kumari_Nursing_CV.pdf',
    leadStatus: 'New Lead',
    appliedJobsCount: 2,
    lastActiveDate: 'Today, 10:45 AM',
    isVerified: true,
    source: 'Direct Registration',
    appliedJobsSummary: 'Apollo Diagnostics (Staff Nurse), Medanta Hospital',
  },
  {
    id: 'lead-js-2',
    name: 'Aman Kumar Verma',
    phone: '+91 94310 88219',
    email: 'aman.verma@jobsindia.in',
    city: 'Patna',
    locality: 'Boring Road',
    education: 'B.Sc Nursing (Hons)',
    experience: '3 Years Exp (ICU & Emergency)',
    currentSalary: '₹24,000 / mo',
    expectedSalary: '₹32,000 - ₹38,000 / mo',
    preferredRole: 'Senior Staff Nurse / ICU Lead',
    skills: ['ICU Care', 'Vitals Monitoring', 'Emergency Response', 'Ventilator Handling'],
    resumeName: 'Aman_Verma_Nursing_Resume.pdf',
    leadStatus: 'Interview Scheduled',
    appliedJobsCount: 4,
    lastActiveDate: 'Yesterday',
    isVerified: true,
    source: 'Job Application',
    appliedJobsSummary: 'Medanta Super Speciality Hospital (Interview Round Scheduled)',
  },
  {
    id: 'lead-js-3',
    name: 'Ananya Kumari',
    phone: '+91 98350 77124',
    email: 'ananya.kumari.nurse@gmail.com',
    city: 'Patna',
    locality: 'Muhammadpur',
    education: 'GNM Diploma & Nursing Registration',
    experience: '2.5 Years Exp',
    currentSalary: '₹18,500 / mo',
    expectedSalary: '₹28,000 - ₹35,000 / mo',
    preferredRole: 'ICU Staff Nurse',
    skills: ['ICU Ward', 'Ventilator Handling', 'IV Cannulation', 'Medication'],
    resumeName: 'Ananya_Kumari_GNM_CV.pdf',
    leadStatus: 'Screened',
    appliedJobsCount: 3,
    lastActiveDate: '21 Sep 2026',
    isVerified: true,
    source: 'Job Application',
    appliedJobsSummary: 'Apollo Diagnostics Patna',
  },
  {
    id: 'lead-js-4',
    name: 'Sunil Kumar Sharma',
    phone: '+91 97711 44320',
    email: 'sunil.sharma.icu@yahoo.com',
    city: 'Patna',
    locality: 'Kankarbagh',
    education: 'B.Sc Critical Care Nursing',
    experience: '3.5 Years Exp',
    currentSalary: '₹22,000 / mo',
    expectedSalary: '₹30,000 - ₹38,000 / mo',
    preferredRole: 'Critical Care Staff Nurse',
    skills: ['Cardiac ICU', 'Patient Vitals', 'Wound Dressing', 'Night Shifts'],
    resumeName: 'Sunil_Sharma_Resume.pdf',
    leadStatus: 'Contacted',
    appliedJobsCount: 2,
    lastActiveDate: '21 Sep 2026',
    isVerified: true,
    source: 'Job Application',
    appliedJobsSummary: 'Apollo Diagnostics Patna',
  },
  {
    id: 'lead-js-5',
    name: 'Ravi Shankar Kumar',
    phone: '+91 91223 90812',
    email: 'ravi.shankar.patna@gmail.com',
    city: 'Patna',
    locality: 'Bailey Road',
    education: 'B.Com (Accounts & Finance)',
    experience: '2 Years Exp (Tally & GST)',
    currentSalary: '₹16,000 / mo',
    expectedSalary: '₹22,000 - ₹28,000 / mo',
    preferredRole: 'Junior Accountant & Tally Operator',
    skills: ['Tally Prime', 'GST Invoicing', 'E-Way Bill', 'Bank Reconciliation', 'MS Excel'],
    resumeName: 'Ravi_Shankar_Accountant_CV.pdf',
    leadStatus: 'Screened',
    appliedJobsCount: 5,
    lastActiveDate: '20 Sep 2026',
    isVerified: true,
    source: 'Direct Registration',
    appliedJobsSummary: 'Singhania & Sons Trading Corp',
  },
  {
    id: 'lead-js-6',
    name: 'Pooja Rani',
    phone: '+91 93345 61289',
    email: 'pooja.rani.telecall@gmail.com',
    city: 'Patna',
    locality: 'Patliputra Industrial Area',
    education: 'Intermediate (12th Pass) + BA',
    experience: '1.5 Years Customer Support',
    currentSalary: '₹14,000 / mo',
    expectedSalary: '₹20,000 - ₹26,000 / mo',
    preferredRole: 'Customer Support Executive / Telecaller',
    skills: ['Hindi & English Voice', 'CRM Tools', 'Customer Retention', 'Typing 35 WPM'],
    resumeName: 'Pooja_Rani_Customer_Support.pdf',
    leadStatus: 'Interview Scheduled',
    appliedJobsCount: 3,
    lastActiveDate: 'Today, 9:15 AM',
    isVerified: true,
    source: 'WhatsApp Inbound',
    appliedJobsSummary: 'Flipkart Customer Connect',
  },
  {
    id: 'lead-js-7',
    name: 'Vikash Kumar Yadav',
    phone: '+91 95088 12435',
    email: 'vikash.yadav.sales@rediffmail.com',
    city: 'Patna',
    locality: 'Dak Bungalow Road',
    education: 'Graduate (B.A)',
    experience: '1 Year Field Sales (EMI Cards)',
    currentSalary: '₹15,000 / mo',
    expectedSalary: '₹22,000 - ₹34,000 / mo',
    preferredRole: 'Retail Finance Executive / Loan Officer',
    skills: ['Field Sales', 'KYC Verification', 'Retail Finance', 'Customer Onboarding'],
    resumeName: 'Vikash_Yadav_Resume.pdf',
    leadStatus: 'Hired / Placed',
    appliedJobsCount: 4,
    lastActiveDate: '19 Sep 2026',
    isVerified: true,
    source: 'Job Application',
    appliedJobsSummary: 'Bajaj Finserv Consumer Finance',
  },
  {
    id: 'lead-js-8',
    name: 'Neha Roy',
    phone: '+91 98112 34509',
    email: 'neha.roy.hr@jobsindia.in',
    city: 'Patna',
    locality: 'Exhibition Road',
    education: 'MBA in HR & Marketing',
    experience: '2.5 Years Talent Acquisition',
    currentSalary: '₹26,000 / mo',
    expectedSalary: '₹35,000 - ₹45,000 / mo',
    preferredRole: 'HR Executive / Recruiter',
    skills: ['Naukri Portal', 'Screening', 'Campus Hiring', 'Employee Onboarding', 'Payroll'],
    resumeName: 'Neha_Roy_HR_Profile.pdf',
    leadStatus: 'Contacted',
    appliedJobsCount: 2,
    lastActiveDate: '18 Sep 2026',
    isVerified: true,
    source: 'Resume Upload',
    appliedJobsSummary: 'HDFC Bank Branch Banking',
  },
  {
    id: 'lead-js-9',
    name: 'Deepak Kumar Sahu',
    phone: '+91 99341 87654',
    email: 'deepak.sahu.ops@gmail.com',
    city: 'Gaya',
    locality: 'Civil Lines',
    education: 'B.Sc IT',
    experience: 'Fresher (0 - 1 Yr)',
    currentSalary: 'Fresher',
    expectedSalary: '₹18,000 - ₹24,000 / mo',
    preferredRole: 'Data Entry Operator / MIS Executive',
    skills: ['Advanced Excel', 'VLOOKUP', 'Data Cleansing', 'Fast Typing', 'English & Hindi'],
    resumeName: 'Deepak_Sahu_CV.pdf',
    leadStatus: 'New Lead',
    appliedJobsCount: 6,
    lastActiveDate: 'Today, 8:20 AM',
    isVerified: false,
    source: 'Direct Registration',
    appliedJobsSummary: 'Reliance Retail Logistics',
  },
  {
    id: 'lead-js-10',
    name: 'Manoj Kumar Tiwari',
    phone: '+91 94700 33211',
    email: 'manoj.tiwari.security@outlook.com',
    city: 'Muzaffarpur',
    locality: 'Brahmpura',
    education: '10th Pass + Ex-Serviceman Certificate',
    experience: '4 Years Armed Security',
    currentSalary: '₹16,000 / mo',
    expectedSalary: '₹20,000 - ₹25,000 / mo',
    preferredRole: 'Security Supervisor / Field Marshal',
    skills: ['Crowd Management', 'Visitor Register', 'CCTV Monitoring', 'Fire Safety'],
    resumeName: 'Manoj_Tiwari_Security.pdf',
    leadStatus: 'New Lead',
    appliedJobsCount: 1,
    lastActiveDate: '17 Sep 2026',
    isVerified: true,
    source: 'WhatsApp Inbound',
    appliedJobsSummary: 'Medanta Hospital Security Division',
  },
];

export const INITIAL_EMPLOYER_LEADS: EmployerLead[] = [
  {
    id: 'lead-emp-1',
    companyName: 'Apollo Diagnostics',
    hrName: 'Dr. Alok Verma',
    designation: 'Chief Medical HR & Admin',
    phone: '+91 98350 12845',
    email: 'hr.alok@apollodiagnostics.in',
    city: 'Patna',
    locality: 'Muhammadpur',
    industry: 'Healthcare & Diagnostics',
    gstin: '10AAACA1234F1Z5',
    cin: 'CIN-U85110DL2004PLC128314',
    postedJobsCount: 4,
    totalInquiriesReceived: 38,
    leadStatus: 'Verified Active',
    registeredDate: '01 Aug 2026',
    isVerified: true,
    planType: 'Enterprise',
  },
  {
    id: 'lead-emp-2',
    companyName: 'Medanta Super Speciality Hospital',
    hrName: 'Priya Sharma',
    designation: 'Senior HR Manager - Clinical Hiring',
    phone: '+91 94310 88219',
    email: 'priya.sharma@medanta.org',
    city: 'Patna',
    locality: 'Kankarbagh',
    industry: 'Hospital & Healthcare',
    gstin: '10AABCM5678G2Z1',
    cin: 'CIN-L85110DL2004PLC128315',
    postedJobsCount: 6,
    totalInquiriesReceived: 92,
    leadStatus: 'Verified Active',
    registeredDate: '15 Jul 2026',
    isVerified: true,
    planType: 'Enterprise',
  },
  {
    id: 'lead-emp-3',
    companyName: 'Flipkart Customer Connect',
    hrName: 'Rajeev Menon',
    designation: 'Regional Talent Lead - Bihar & Jharkhand',
    phone: '+91 98711 44552',
    email: 'rajeev.menon@flipkartcareers.in',
    city: 'Patna',
    locality: 'Patliputra Industrial Area',
    industry: 'E-commerce & Technology',
    gstin: '10AAACF9921D1ZO',
    cin: 'CIN-U51109KA2012PTC066107',
    postedJobsCount: 3,
    totalInquiriesReceived: 114,
    leadStatus: 'Verified Active',
    registeredDate: '10 Aug 2026',
    isVerified: true,
    planType: 'Pro Recruiter',
  },
  {
    id: 'lead-emp-4',
    companyName: 'Bajaj Finserv Consumer Finance',
    hrName: 'Sanjay Sinha',
    designation: 'Area Recruitment Head',
    phone: '+91 98351 99201',
    email: 'sanjay.sinha@bajajfinserv.in',
    city: 'Patna',
    locality: 'Dak Bungalow Road',
    industry: 'Banking & Financial Services',
    gstin: '10AABCB1234F1Z8',
    cin: 'CIN-L65923PN2007PLC130075',
    postedJobsCount: 2,
    totalInquiriesReceived: 78,
    leadStatus: 'Verified Active',
    registeredDate: '20 Aug 2026',
    isVerified: true,
    planType: 'Pro Recruiter',
  },
  {
    id: 'lead-emp-5',
    companyName: 'Singhania & Sons Trading Corp',
    hrName: 'Mahesh Singhania',
    designation: 'Managing Partner & Director',
    phone: '+91 98350 33410',
    email: 'accounts@singhaniatraders.com',
    city: 'Patna',
    locality: 'Muhammadpur',
    industry: 'FMCG Wholesale & Distribution',
    gstin: '10ABCPS4451K1Z2',
    postedJobsCount: 1,
    totalInquiriesReceived: 52,
    leadStatus: 'Verified Active',
    registeredDate: '05 Sep 2026',
    isVerified: true,
    planType: 'Free Standard',
  },
  {
    id: 'lead-emp-6',
    companyName: 'Reliance Retail Logistics',
    hrName: 'Amitabh Sen',
    designation: 'Zonal HR Operations',
    phone: '+91 99340 77123',
    email: 'amitabh.sen@ril.com',
    city: 'Patna',
    locality: 'Didarganj Industrial Hub',
    industry: 'Retail & Supply Chain',
    gstin: '10AABCR8901L1Z9',
    postedJobsCount: 3,
    totalInquiriesReceived: 84,
    leadStatus: 'Enterprise Client',
    registeredDate: '12 Jul 2026',
    isVerified: true,
    planType: 'Enterprise',
  },
  {
    id: 'lead-emp-7',
    companyName: 'HDFC Bank Branch Banking',
    hrName: 'Rashmi Kapoor',
    designation: 'HR Business Partner - Bihar Cluster',
    phone: '+91 98102 33445',
    email: 'rashmi.kapoor@hdfcbank.com',
    city: 'Patna',
    locality: 'Exhibition Road',
    industry: 'Banking',
    gstin: '10AAACH2702H1Z6',
    postedJobsCount: 2,
    totalInquiriesReceived: 63,
    leadStatus: 'Verified Active',
    registeredDate: '18 Aug 2026',
    isVerified: true,
    planType: 'Enterprise',
  },
  {
    id: 'lead-emp-8',
    companyName: 'Patna Healthcare Diagnostic Lab',
    hrName: 'Dr. R.K. Choudhary',
    designation: 'Proprietor & Director',
    phone: '+91 94312 00987',
    email: 'choudhary.lab.patna@gmail.com',
    city: 'Patna',
    locality: 'Bari Path',
    industry: 'Clinical Pathology',
    gstin: '10ABCDP1123J1Z0',
    postedJobsCount: 1,
    totalInquiriesReceived: 19,
    leadStatus: 'Pending KYC',
    registeredDate: '18 Sep 2026',
    isVerified: false,
    planType: 'Free Standard',
  },
  {
    id: 'lead-emp-9',
    companyName: 'BigBasket Quick Delivery Hub',
    hrName: 'Sumit Ganguly',
    designation: 'Operations HR Manager',
    phone: '+91 98711 00234',
    email: 'sumit.ganguly@bigbasket.com',
    city: 'Patna',
    locality: 'Anisabad',
    industry: 'Logistics & Quick Commerce',
    gstin: '10AABCI6678K1Z3',
    postedJobsCount: 2,
    totalInquiriesReceived: 47,
    leadStatus: 'Verified Active',
    registeredDate: '25 Aug 2026',
    isVerified: true,
    planType: 'Pro Recruiter',
  },
  {
    id: 'lead-emp-10',
    companyName: 'Bihari Sweets & Food Processing',
    hrName: 'Gaurav Agrawal',
    designation: 'HR & Factory Manager',
    phone: '+91 98354 88771',
    email: 'factory.biharisweets@gmail.com',
    city: 'Patna',
    locality: 'Fatuha Industrial Estate',
    industry: 'Food Processing & Manufacturing',
    postedJobsCount: 1,
    totalInquiriesReceived: 26,
    leadStatus: 'Follow-up Needed',
    registeredDate: '12 Sep 2026',
    isVerified: false,
    planType: 'Free Standard',
  },
];

const STORAGE_KEY_JS_LEADS = 'jobsindia_admin_jobseeker_leads_v1';
const STORAGE_KEY_EMP_LEADS = 'jobsindia_admin_employer_leads_v1';

export const loadStoredJobSeekerLeads = (): JobSeekerLead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JS_LEADS);
    if (!raw) return INITIAL_JOB_SEEKER_LEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_JOB_SEEKER_LEADS;
  } catch {
    return INITIAL_JOB_SEEKER_LEADS;
  }
};

export const saveStoredJobSeekerLeads = (leads: JobSeekerLead[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_JS_LEADS, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save Job Seeker leads', e);
  }
};

export const loadStoredEmployerLeads = (): EmployerLead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMP_LEADS);
    if (!raw) return INITIAL_EMPLOYER_LEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EMPLOYER_LEADS;
  } catch {
    return INITIAL_EMPLOYER_LEADS;
  }
};

export const saveStoredEmployerLeads = (leads: EmployerLead[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_EMP_LEADS, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save Employer leads', e);
  }
};

/**
 * Helper to dynamically merge real candidate applications and live user profile
 * into the admin job seeker database.
 */
export const syncLiveJobSeekerLeads = (
  baseLeads: JobSeekerLead[],
  applications: Application[],
  userProfile?: UserProfile
): JobSeekerLead[] => {
  const map = new Map<string, JobSeekerLead>();

  // Insert base leads
  baseLeads.forEach((lead) => map.set(lead.phone.replace(/[^0-9]/g, ''), lead));

  // Sync current user profile
  if (userProfile && userProfile.phone) {
    const userCleanPhone = userProfile.phone.replace(/[^0-9]/g, '');
    const existing = map.get(userCleanPhone);
    const userLead: JobSeekerLead = {
      id: existing?.id || 'lead-current-user',
      name: userProfile.name || 'Registered Candidate',
      phone: userProfile.phone.startsWith('+91') ? userProfile.phone : `+91 ${userProfile.phone}`,
      email: userProfile.email || 'candidate@jobsindia.in',
      city: userProfile.city || 'Patna',
      locality: userProfile.locality || 'Muhammadpur',
      education: userProfile.education || 'Graduate / Diploma',
      experience: userProfile.experience || '1 Year Experience',
      currentSalary: userProfile.currentSalary || '₹9,500 / mo',
      expectedSalary: userProfile.expectedSalary || '₹18,000 - ₹25,000 / mo',
      preferredRole: userProfile.preferredRoles?.[0] || 'Staff Nurse / Clinical Care',
      skills: userProfile.skills?.length ? userProfile.skills : ['Patient Care', 'Staff Nurse'],
      resumeName: userProfile.resumeName || 'Resume.pdf',
      leadStatus: existing?.leadStatus || 'New Lead',
      appliedJobsCount: Math.max(existing?.appliedJobsCount || 1, applications.length),
      lastActiveDate: 'Active Now',
      isVerified: true,
      source: 'Direct Registration',
      appliedJobsSummary: applications.map((a) => `${a.company} (${a.jobTitle})`).join(', ') || 'Registered on App',
    };
    map.set(userCleanPhone, userLead);
  }

  // Sync applications
  applications.forEach((app) => {
    if (!app.candidatePhone) return;
    const cleanPhone = app.candidatePhone.replace(/[^0-9]/g, '');
    const existing = map.get(cleanPhone);
    if (existing) {
      existing.appliedJobsCount = Math.max(existing.appliedJobsCount, 1);
      existing.lastActiveDate = app.appliedDate || existing.lastActiveDate;
      if (app.status === 'Interview') existing.leadStatus = 'Interview Scheduled';
      else if (app.status === 'Selected') existing.leadStatus = 'Hired / Placed';
      else if (app.status === 'Shortlisted') existing.leadStatus = 'Screened';
    } else {
      map.set(cleanPhone, {
        id: `lead-app-${app.id}`,
        name: app.candidateName || 'Applicant',
        phone: app.candidatePhone,
        email: app.candidateEmail || 'applicant@jobsindia.in',
        city: app.location.split(',')[0] || 'Patna',
        locality: 'Patna',
        education: app.candidateQualification || 'Graduate',
        experience: app.candidateExperience || '1 - 2 Yrs Exp',
        preferredRole: app.jobTitle,
        skills: app.candidateSkills || ['Communication'],
        resumeName: app.resumeName || 'Resume.pdf',
        leadStatus: app.status === 'Interview' ? 'Interview Scheduled' : app.status === 'Selected' ? 'Hired / Placed' : 'New Lead',
        appliedJobsCount: 1,
        lastActiveDate: app.appliedDate || 'Recent',
        isVerified: true,
        source: 'Job Application',
        appliedJobsSummary: `${app.company} (${app.jobTitle})`,
      });
    }
  });

  return Array.from(map.values());
};

/**
 * Helper to dynamically sync real employer profiles and active posted jobs
 * into the admin employer database.
 */
export const syncLiveEmployerLeads = (
  baseLeads: EmployerLead[],
  jobs: Job[],
  employerProfile?: EmployerProfile
): EmployerLead[] => {
  const map = new Map<string, EmployerLead>();

  baseLeads.forEach((lead) => map.set(lead.companyName.toLowerCase().trim(), lead));

  // Sync current registered employer profile
  if (employerProfile && employerProfile.companyName) {
    const key = employerProfile.companyName.toLowerCase().trim();
    const existing = map.get(key);
    map.set(key, {
      id: existing?.id || 'lead-current-employer',
      companyName: employerProfile.companyName,
      hrName: employerProfile.hrName || 'Verified HR Lead',
      designation: employerProfile.designation || 'Head of Recruitment',
      phone: employerProfile.phone || '+91 98350 12845',
      email: employerProfile.workEmail || 'hr@company.in',
      city: employerProfile.city || 'Patna',
      locality: employerProfile.officeAddress || 'Muhammadpur',
      industry: employerProfile.industry || 'Healthcare & Services',
      gstin: employerProfile.gstin || '10AAACA1234F1Z5',
      cin: employerProfile.cinNumber,
      postedJobsCount: jobs.filter((j) => j.company.toLowerCase().includes(employerProfile.companyName.toLowerCase())).length || 1,
      totalInquiriesReceived: existing?.totalInquiriesReceived || 42,
      leadStatus: 'Verified Active',
      registeredDate: existing?.registeredDate || 'Today (Live Profile)',
      isVerified: employerProfile.isVerified ?? true,
      planType: existing?.planType || 'Enterprise',
    });
  }

  // Also ensure all companies from jobs list exist as employer leads
  jobs.forEach((job) => {
    const key = job.company.toLowerCase().trim();
    if (!map.has(key)) {
      map.set(key, {
        id: `lead-emp-${job.id}`,
        companyName: job.company,
        hrName: 'Talent Acquisition Team',
        designation: 'Recruitment Lead',
        phone: '+91 98350 10000',
        email: `hr@${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        city: job.location.split(',')[0]?.trim() || 'Patna',
        locality: job.locality || 'Muhammadpur',
        industry: job.aboutCompany?.industry || 'Corporate & Retail',
        postedJobsCount: 1,
        totalInquiriesReceived: job.applicantsCount || 25,
        leadStatus: 'Verified Active',
        registeredDate: 'Active Listing',
        isVerified: job.aboutCompany?.verified ?? true,
        planType: 'Pro Recruiter',
      });
    }
  });

  return Array.from(map.values());
};

/**
 * Real CSV exporter utility that downloads genuine CSV files in the browser.
 */
export const exportLeadsToCSV = (
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) => {
  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) =>
      row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
