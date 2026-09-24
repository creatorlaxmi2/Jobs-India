import { Job, RecruiterContact, Application } from '../types';

export function getJobRecruiter(job: Job): RecruiterContact {
  if (job.recruiterContact) {
    return job.recruiterContact;
  }
  const isMedanta = job.company.includes('Medanta');
  const isRuban = job.company.includes('Ruban');
  const isBajaj = job.company.includes('Bajaj');
  const isFlipkart = job.company.includes('Flipkart');
  const isReliance = job.company.includes('Reliance');
  const isApollo = job.company.includes('Apollo');

  if (isMedanta) {
    return {
      name: 'Dr. Alok Verma',
      designation: 'Senior Talent Acquisition Lead',
      phone: '+91 98350 12845',
      email: 'alok.verma@medanta.org',
      isVerified: true,
      kycDocument: 'CIN-U85110DL2004PLC128314',
      companyGstin: '10AAACM1234F1Z8',
      verifiedAt: 'Verified on 15 Sep 2026',
    };
  }
  if (isRuban) {
    return {
      name: 'Pooja Sharma',
      designation: 'Head HR & Clinical Staffing',
      phone: '+91 94710 44820',
      email: 'hr.pooja@rubanhospital.com',
      isVerified: true,
      kycDocument: 'PAN-AAACR1294K',
      companyGstin: '10AAACR1294K1Z2',
      verifiedAt: 'Verified on 18 Sep 2026',
    };
  }
  if (isBajaj) {
    return {
      name: 'Vikash Kumar Mishra',
      designation: 'Regional HR Manager - Bihar Circle',
      phone: '+91 99342 55910',
      email: 'vikash.mishra@bajajfinserv.in',
      isVerified: true,
      kycDocument: 'CIN-L65923PN2007PLC130075',
      companyGstin: '10AAACB1845P1Z7',
      verifiedAt: 'Verified on 12 Sep 2026',
    };
  }
  if (isFlipkart) {
    return {
      name: 'Neha Kumari',
      designation: 'Talent Partner - Patna Hub',
      phone: '+91 91223 88102',
      email: 'neha.kumari@flipkartcareers.in',
      isVerified: true,
      kycDocument: 'CIN-U51109KA2012PTC066107',
      companyGstin: '10AAACF8812D1ZX',
      verifiedAt: 'Verified on 14 Sep 2026',
    };
  }
  if (isReliance) {
    return {
      name: 'Amitabh Sen',
      designation: 'Operations HR Executive',
      phone: '+91 93045 77619',
      email: 'amitabh.sen@ril.com',
      isVerified: true,
      kycDocument: 'CIN-L17110MH1973PLC019786',
      companyGstin: '10AAACR7110M1Z3',
      verifiedAt: 'Verified on 10 Sep 2026',
    };
  }
  if (isApollo) {
    return {
      name: 'Dr. Sunita Rao',
      designation: 'Chief Medical HR Officer',
      phone: '+91 98351 90234',
      email: 'hr.patna@apollohospitals.com',
      isVerified: true,
      kycDocument: 'CIN-L85110TN1979PLC008035',
      companyGstin: '10AAACA0124P1Z9',
      verifiedAt: 'Verified on 19 Sep 2026',
    };
  }

  const cleanComp = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
  return {
    name: 'Saurav Banerjee',
    designation: 'Talent Acquisition & HR Lead',
    phone: '+91 98355 67120',
    email: `careers@${cleanComp.slice(0, 10)}.in`,
    isVerified: job.aboutCompany?.verified ?? true,
    kycDocument: 'CIN-U74999BR2019PTC041235',
    companyGstin: '10AAACT4999B1Z5',
    verifiedAt: 'Verified on 16 Sep 2026',
  };
}

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Staff Nurse',
    company: 'Medanta Super Speciality Hospital',
    companyLogoBg: '#1E40AF',
    companyLogoText: 'MS',
    location: 'Patna, Bihar',
    locality: 'Muhammadpur',
    distance: '1.2 km away',
    salary: '₹28,000 - ₹38,000 / mo',
    minSalary: 28000,
    maxSalary: 38000,
    experience: '1 - 3 Yrs',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: true,
    isUrgent: true,
    isNew: true,
    postedTime: '1 hour ago',
    applicantsCount: 42,
    vacancies: 6,
    description: 'Looking for compassionate and qualified GNM/B.Sc Registered Staff Nurses to care for inpatient wards and ICU monitoring in our Patna flagship hospital.',
    responsibilities: [
      'Administering oral and IV medications under physician protocol.',
      'Continuous patient vitals assessment and clinical charting in hospital HIS.',
      'Post-operative patient management and nursing care delivery.',
      'Coordinating with attending doctors during OPD and rounding schedules.'
    ],
    requiredSkills: ['GNM / B.Sc Nursing', 'Patient Care', 'IV Cannulation', 'ICU Protocol', 'BLS Certified'],
    benefits: ['Health Insurance', 'Provident Fund (PF)', 'Free Meals on Duty', 'Annual Bonus', 'Transport Allowance'],
    aboutCompany: {
      rating: 4.6,
      reviewsCount: 1240,
      employees: '1,500+ employees',
      industry: 'Healthcare & Hospitals',
      address: 'Kankarbagh Main Rd, near Muhammadpur, Patna, Bihar 800020',
      verified: true,
    }
  },
  {
    id: 'job-2',
    title: 'Emergency Department Nurse',
    company: 'Ruban Memorial Hospital',
    companyLogoBg: '#DC2626',
    companyLogoText: 'RM',
    location: 'Patna, Bihar',
    locality: 'Bailey Road',
    distance: '3.4 km away',
    salary: '₹32,000 - ₹45,000 / mo',
    minSalary: 32000,
    maxSalary: 45000,
    experience: '2 - 5 Yrs',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: true,
    isUrgent: true,
    isNew: true,
    postedTime: '3 hours ago',
    applicantsCount: 29,
    vacancies: 4,
    description: 'Urgent requirement for Trauma & Emergency triage nurses with ACLS credentials for round-the-clock emergency care unit.',
    responsibilities: [
      'Rapid triage assessment of incoming trauma and emergency patients.',
      'Assisting emergency medical officers in intubation and resuscitation.',
      'Operation of defibrillators, multipara monitors, and infusion pumps.',
      'Patient transfer coordination to emergency OT or CCU.'
    ],
    requiredSkills: ['Emergency Care', 'ACLS/BLS', 'Triage Protocol', 'Critical Care', 'Trauma Handling'],
    benefits: ['ESIC & Mediclaim', 'Night Shift Allowance', 'Overtime Bonus', 'PF & Gratuity'],
    aboutCompany: {
      rating: 4.4,
      reviewsCount: 890,
      employees: '800+ employees',
      industry: 'Healthcare Services',
      address: 'Bailey Road, Raja Bazar, Patna, Bihar 800014',
      verified: true,
    }
  },
  {
    id: 'job-3',
    title: 'Sales Executive',
    company: 'Bajaj Finserv Consumer Finance',
    companyLogoBg: '#0284C7',
    companyLogoText: 'BF',
    location: 'Patna, Bihar',
    locality: 'Muhammadpur',
    distance: '0.8 km away',
    salary: '₹22,000 - ₹34,000 / mo + Incentives',
    minSalary: 22000,
    maxSalary: 34000,
    experience: '0 - 2 Yrs (Freshers Welcome)',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: false,
    isUrgent: true,
    isNew: true,
    postedTime: 'Today',
    applicantsCount: 78,
    vacancies: 12,
    description: 'Drive consumer loan and electronics EMI financing onboarding at partner retail counters across Patna. High monthly incentive structure.',
    responsibilities: [
      'Approaching walk-in retail showroom customers for EMI card approvals.',
      'Checking CIBIL eligibility and uploading Aadhaar/PAN KYC documents on app.',
      'Meeting daily retail disbursement targets.',
      'Building relationships with partner electronics and mobile store managers.'
    ],
    requiredSkills: ['Field Sales', 'Communication', 'Hindi & Basic English', 'KYC Verification', 'Retail Finance'],
    benefits: ['Attractive Daily/Monthly Incentives', 'Travel Allowance (TA/DA)', 'PF + ESIC', 'Mobile Reimbursement'],
    aboutCompany: {
      rating: 4.2,
      reviewsCount: 5400,
      employees: '25,000+ employees',
      industry: 'Banking & Financial Services',
      address: 'Dak Bungalow Road, Patna, Bihar 800001',
      verified: true,
    }
  },
  {
    id: 'job-4',
    title: 'Customer Support Executive',
    company: 'Flipkart Customer Connect',
    companyLogoBg: '#EA580C',
    companyLogoText: 'FK',
    location: 'Patna, Bihar',
    locality: 'Patliputra Industrial Area',
    distance: '4.1 km away',
    salary: '₹20,000 - ₹26,000 / mo',
    minSalary: 20000,
    maxSalary: 26000,
    experience: 'Fresher / 0 - 1 Yr',
    jobType: 'Full Time',
    isWorkFromHome: true,
    isHighSalary: false,
    isUrgent: false,
    isNew: true,
    postedTime: '5 hours ago',
    applicantsCount: 110,
    vacancies: 20,
    description: 'Inbound customer voice and chat support handling order queries, refunds, and delivery rescheduling. Option for permanent Work-From-Home after 2 weeks training.',
    responsibilities: [
      'Handling inbound customer calls and live chats with polite problem-solving.',
      'Updating ticket resolution in CRM according to SLAs.',
      'Coordinating with logistics partners on delayed packages.',
      'Ensuring high Customer Satisfaction (CSAT) scores.'
    ],
    requiredSkills: ['Verbal Communication', 'Hindi & English', 'CRM Tools', 'Active Listening', 'Typing 30 WPM'],
    benefits: ['Laptop Provided for WFH', 'Internet Allowance ₹1,500/mo', 'Medical Insurance', '5 Days Working'],
    aboutCompany: {
      rating: 4.5,
      reviewsCount: 9800,
      employees: '50,000+ employees',
      industry: 'E-commerce & Technology',
      address: 'Patliputra Industrial Estate, Patna, Bihar 800013',
      verified: true,
    }
  },
  {
    id: 'job-5',
    title: 'Data Entry Operator',
    company: 'Reliance Retail Logistics',
    companyLogoBg: '#15803D',
    companyLogoText: 'RR',
    location: 'Patna, Bihar',
    locality: 'Muhammadpur',
    distance: '1.5 km away',
    salary: '₹18,000 - ₹24,000 / mo',
    minSalary: 18000,
    maxSalary: 24000,
    experience: '0 - 1 Yr',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: false,
    isUrgent: false,
    isNew: false,
    postedTime: '1 day ago',
    applicantsCount: 65,
    vacancies: 8,
    description: 'Data entry operator needed for billing, stock receipts, and invoice ledger compilation at our regional grocery distribution hub.',
    responsibilities: [
      'Entering daily incoming and dispatch inventory data into SAP ERP.',
      'Reconciling physical delivery challans with digital entries.',
      'Preparing daily Excel dispatch reports for floor managers.',
      'Maintaining error-free records with high accuracy.'
    ],
    requiredSkills: ['MS Excel', 'Data Entry', 'Typing Speed 35+ WPM', 'Numeric Accuracy', 'SAP basic'],
    benefits: ['PF & ESI', 'Overtime Pay', 'Subsidized Canteen', 'Yearly Increment'],
    aboutCompany: {
      rating: 4.3,
      reviewsCount: 3200,
      employees: '10,000+ employees',
      industry: 'Retail & Supply Chain',
      address: 'Anisabad - Muhammadpur Corridor, Patna, Bihar 800002',
      verified: true,
    }
  },
  {
    id: 'job-6',
    title: 'Delivery Executive',
    company: 'Blinkit Instant Commerce',
    companyLogoBg: '#EAB308',
    companyLogoText: 'BL',
    location: 'Patna, Bihar',
    locality: 'Kankarbagh',
    distance: '2.1 km away',
    salary: '₹25,000 - ₹35,000 / mo + Tips',
    minSalary: 25000,
    maxSalary: 35000,
    experience: 'Fresher / Any',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: true,
    isUrgent: true,
    isNew: true,
    postedTime: 'Just now',
    applicantsCount: 88,
    vacancies: 25,
    description: 'Deliver groceries and daily essentials from local dark stores to customers within 3-4 km radius. Flexible shifts, weekly payouts, and joining bonus of ₹3,000.',
    responsibilities: [
      'Collecting packed grocery bags from warehouse dark stores.',
      'Navigating via GPS mobile app to delivery locations promptly.',
      'Handing over deliveries with courtesy and OTP confirmation.',
      'Safe driving following all traffic guidelines.'
    ],
    requiredSkills: ['Two-Wheeler (Bike/Scooter)', 'Valid Driving License', 'Smartphone with 4G', 'Local Route Knowledge'],
    benefits: ['Weekly Payouts every Tuesday', '₹5 Lakh Accident Insurance', '₹3,000 Joining Bonus', 'Fuel Allowance'],
    aboutCompany: {
      rating: 4.1,
      reviewsCount: 4100,
      employees: '30,000+ riders',
      industry: 'Quick Commerce Logistics',
      address: 'Kankarbagh Colony More, Patna, Bihar 800020',
      verified: true,
    }
  },
  {
    id: 'job-7',
    title: 'Office Assistant',
    company: 'HDFC Bank Regional Office',
    companyLogoBg: '#4338CA',
    companyLogoText: 'HD',
    location: 'Patna, Bihar',
    locality: 'Boring Road',
    distance: '2.8 km away',
    salary: '₹19,000 - ₹25,000 / mo',
    minSalary: 19000,
    maxSalary: 25000,
    experience: '0 - 2 Yrs',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: false,
    isUrgent: false,
    isNew: false,
    postedTime: '2 days ago',
    applicantsCount: 45,
    vacancies: 3,
    description: 'Assisting branch administrative functions, file management, incoming post dispatch, vendor coordination, and basic client visitor reception.',
    responsibilities: [
      'Handling front-office document dispatch and inward registers.',
      'Assisting bank managers with stationery and branch housekeeping audits.',
      'Photocopying, scanning, and digital archiving of customer documents.',
      'Directing walk-in customers to appropriate banking service counters.'
    ],
    requiredSkills: ['Document Handling', 'Basic Computer', 'Polite Mannerisms', 'Filing & Record Keeping'],
    benefits: ['Fixed 10 AM - 6 PM Timing', 'Bank Holidays Off', 'PF & ESI', 'Annual Gratuity'],
    aboutCompany: {
      rating: 4.5,
      reviewsCount: 15400,
      employees: '100,000+ employees',
      industry: 'Banking',
      address: 'Boring Road Crossing, Patna, Bihar 800001',
      verified: true,
    }
  },
  {
    id: 'job-8',
    title: 'Telecaller / Inside Sales (Work From Home)',
    company: 'SBI Cards & Payment Services',
    companyLogoBg: '#2563EB',
    companyLogoText: 'SB',
    location: 'Patna / Pan India',
    locality: 'Work From Home',
    distance: 'Remote',
    salary: '₹24,000 - ₹32,000 / mo + Bonus',
    minSalary: 24000,
    maxSalary: 32000,
    experience: '0 - 3 Yrs',
    jobType: 'Work From Home',
    isWorkFromHome: true,
    isHighSalary: false,
    isUrgent: true,
    isNew: true,
    postedTime: '4 hours ago',
    applicantsCount: 140,
    vacancies: 15,
    description: 'Outbound telecalling to pre-approved banking customers explaining credit card upgrades, reward privileges, and completing digital tele-verifications.',
    responsibilities: [
      'Calling verified banking leads using cloud telephony app.',
      'Explaining card features, annual fees, and cashback perks clearly.',
      'Submitting qualified digital applications for backend issuance.',
      'Achieving monthly lead conversion milestones.'
    ],
    requiredSkills: ['Fluent Hindi Speaking', 'Confidence on Phone', 'Customer Objection Handling', 'Basic English'],
    benefits: ['Full Work From Home', 'Sim card & Monthly Mobile Recharge', 'Daily Incentive payouts', 'Health Cover'],
    aboutCompany: {
      rating: 4.3,
      reviewsCount: 6800,
      employees: '15,000+ employees',
      industry: 'Financial Services',
      address: 'Exhibition Road, Patna, Bihar 800001',
      verified: true,
    }
  },
  {
    id: 'job-9',
    title: 'Warehouse Operations Supervisor',
    company: 'Amazon Fulfillment Logistics',
    companyLogoBg: '#D97706',
    companyLogoText: 'AM',
    location: 'Patna, Bihar',
    locality: 'Fatuha / Patna Outskirts',
    distance: '6.5 km away',
    salary: '₹35,000 - ₹48,000 / mo',
    minSalary: 35000,
    maxSalary: 48000,
    experience: '2 - 4 Yrs',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: true,
    isUrgent: false,
    isNew: false,
    postedTime: '3 days ago',
    applicantsCount: 38,
    vacancies: 2,
    description: 'Supervising inbound inventory receipt, pick-pack-ship line associates, and inventory accuracy audits at our 50,000 sq ft logistics hub.',
    responsibilities: [
      'Managing a team of 25 warehouse associates across morning and evening shifts.',
      'Monitoring dispatch conveyor metrics and carrier handover timing.',
      'Conducting daily cycle counts and discrepancy root-cause investigations.',
      'Enforcing OSHA and 5S workplace safety standards.'
    ],
    requiredSkills: ['Warehouse Management', 'Inventory Control', 'Team Leadership', 'WMS Software', 'Excel'],
    benefits: ['Company Bus Transport', 'Comprehensive Family Mediclaim', 'Meal Allowance', 'Performance Bonus'],
    aboutCompany: {
      rating: 4.6,
      reviewsCount: 34000,
      employees: '100,000+ associates',
      industry: 'Logistics & Warehousing',
      address: 'Industrial Growth Centre, NH-30, Patna, Bihar 803201',
      verified: true,
    }
  },
  {
    id: 'job-10',
    title: 'Junior Accountant & Tally Operator',
    company: 'Singhania & Sons Trading Corp',
    companyLogoBg: '#059669',
    companyLogoText: 'SS',
    location: 'Patna, Bihar',
    locality: 'Muhammadpur',
    distance: '0.6 km away',
    salary: '₹22,000 - ₹28,000 / mo',
    minSalary: 22000,
    maxSalary: 28000,
    experience: '1 - 3 Yrs',
    jobType: 'Full Time',
    isWorkFromHome: false,
    isHighSalary: false,
    isUrgent: true,
    isNew: true,
    postedTime: '1 day ago',
    applicantsCount: 52,
    vacancies: 2,
    description: 'Looking for a sincere B.Com graduate with sound experience in Tally Prime, GST invoicing, e-way bills generation, and bank reconciliations.',
    responsibilities: [
      'Maintaining daily purchase, sales, and expense vouchers in Tally Prime.',
      'Generating GST compliant sales invoices and e-Way bills.',
      'Monthly bank ledger reconciliation and vendor balance confirmations.',
      'Assisting Chartered Accountant with quarterly GSTR-1 and GSTR-3B filings.'
    ],
    requiredSkills: ['Tally Prime', 'GST Return Basics', 'MS Excel (VLOOKUP)', 'B.Com Degree', 'Bank Reconciliation'],
    benefits: ['PF & Medical Benefit', 'Yearly Diwali Bonus', 'Paid Casual Leaves', 'Clean Office Environment'],
    aboutCompany: {
      rating: 4.1,
      reviewsCount: 160,
      employees: '60+ employees',
      industry: 'FMCG Wholesale & Distribution',
      address: 'Near Muhammadpur Market, Patna, Bihar 800006',
      verified: true,
    }
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Laxmi Kumari',
  phone: '8863090950',
  email: 'sitarampatna7@gmail.com',
  city: 'Patna',
  locality: 'Muhammadpur',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  gender: 'Female',
  birthday: '2002-04-02',
  englishLevel: 'Good English',
  knownLanguages: ['English', 'Hindi'],
  aboutMe: '',
  totalWorkExperience: '1 years',
  experienceLevel: 'experience',
  experiences: [
    {
      workType: 'Full Time',
      industry: 'Hospitality',
      currentSalary: '9500',
      companyName: 'Oxig',
      startDate: '2025',
      jobTitle: 'Nursing Supervisor'
    }
  ],
  skills: ['Patient Care', 'Staff Nurse'],
  assets: ['Smartphone', 'Two Wheeler (Scooty)'],
  educationDetails: {
    collegeName: 'Mona',
    endYear: '2027',
    degree: 'Gnm',
    specialization: 'Nursing'
  },
  certifications: [] as string[],
  education: 'Gnm in Nursing - Mona (2027)',
  experience: '1 Year - Nursing Supervisor at Oxig',
  currentSalary: '₹9,500 / month',
  expectedSalary: '₹18,000 - ₹25,000 / month',
  resumeName: 'Resume.pdf',
  resumeUploadedAt: 'Uploaded (ATS Score: 88%)',
  preferredRoles: ['Staff Nurse', 'Nursing Supervisor', 'Patient Care Executive'],
  preferredLocations: ['Patna', 'Muhammadpur', 'Bailey Road'],
  workPreference: 'All' as const,
  completionPercentage: 77,
  points: 250,
  coins: 50,
  referralCount: 2,
  rewardsClaimed: ['Welcome Bonus (100 pts)', 'Profile Setup (150 pts)']
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Staff Nurse',
    company: 'Medanta Super Speciality Hospital',
    location: 'Patna, Bihar',
    salary: '₹28,000 - ₹38,000 / mo',
    appliedDate: '18 Sep 2026',
    status: 'Interview' as const,
    candidateName: 'Aman Kumar Verma',
    candidatePhone: '+91 94310 88219',
    candidateEmail: 'aman.verma@jobsindia.in',
    candidateExperience: '3 Years Exp',
    candidateQualification: 'B.Sc Nursing (Hons)',
    candidateSkills: ['ICU Care', 'Vitals Monitoring', 'Emergency Response', 'Patient Care'],
    matchScore: '96%',
    resumeName: 'Aman_Verma_Nursing_Resume.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '18 Sep 2026', note: 'Application and resume sent to HR team', completed: true },
      { stage: 'Viewed', date: '19 Sep 2026', note: 'Viewed by HR Senior Recruiter Priya Sharma', completed: true },
      { stage: 'Shortlisted', date: '20 Sep 2026', note: 'Profile matched nursing ward criteria', completed: true },
      { stage: 'Interview', date: '22 Sep 2026 (Tomorrow 11:30 AM)', note: 'F2F Clinical round scheduled at Medanta Hospital HR Office', completed: true, current: true },
      { stage: 'Selected', date: 'Pending', note: 'Final offer letter & verification', completed: false }
    ],
    hrContact: {
      name: 'Priya Sharma',
      designation: 'Senior HR Manager - Clinical Hiring',
      phone: '+91 94310 88219'
    }
  },
  {
    id: 'app-icu-1',
    jobId: 'job-icu-nurse',
    jobTitle: 'ICU Staff Nurse / GNM',
    company: 'Apollo Diagnostics Patna',
    location: 'Muhammadpur, Patna',
    salary: '₹28,000 - ₹38,000 / mo',
    appliedDate: '21 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Ananya Kumari',
    candidatePhone: '+91 98350 77124',
    candidateEmail: 'ananya.kumari.nurse@gmail.com',
    candidateExperience: '2.5 Years Exp',
    candidateQualification: 'GNM Diploma & Nursing Registration',
    candidateSkills: ['ICU Ward', 'Ventilator Handling', 'IV Cannulation', 'Medication'],
    matchScore: '98%',
    resumeName: 'Ananya_Kumari_GNM_CV.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '21 Sep 2026', note: 'Application submitted via Jobs India', completed: true, current: true },
      { stage: 'Viewed', date: 'Pending', note: 'Pending HR review', completed: false },
    ],
    hrContact: {
      name: 'Dr. Alok Verma',
      designation: 'Chief Medical HR',
      phone: '+91 98350 12845'
    }
  },
  {
    id: 'app-icu-2',
    jobId: 'job-icu-nurse',
    jobTitle: 'ICU Staff Nurse / GNM',
    company: 'Apollo Diagnostics Patna',
    location: 'Muhammadpur, Patna',
    salary: '₹28,000 - ₹38,000 / mo',
    appliedDate: '21 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Sunil Kumar Sharma',
    candidatePhone: '+91 97711 44320',
    candidateEmail: 'sunil.sharma.icu@yahoo.com',
    candidateExperience: '3.5 Years Exp',
    candidateQualification: 'B.Sc Critical Care Nursing',
    candidateSkills: ['Cardiac ICU', 'Patient Vitals', 'Wound Dressing', 'Night Shifts'],
    matchScore: '94%',
    resumeName: 'Sunil_Sharma_Resume.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '21 Sep 2026', note: 'Direct candidate application received', completed: true, current: true },
      { stage: 'Viewed', date: 'Pending', note: 'Pending HR review', completed: false },
    ],
    hrContact: {
      name: 'Dr. Alok Verma',
      designation: 'Chief Medical HR',
      phone: '+91 98350 12845'
    }
  },
  {
    id: 'app-icu-3',
    jobId: 'job-icu-nurse',
    jobTitle: 'ICU Staff Nurse / GNM',
    company: 'Apollo Diagnostics Patna',
    location: 'Muhammadpur, Patna',
    salary: '₹28,000 - ₹38,000 / mo',
    appliedDate: '20 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Priyanka Roy',
    candidatePhone: '+91 91223 55901',
    candidateEmail: 'priyanka.roy99@gmail.com',
    candidateExperience: '2 Years Exp',
    candidateQualification: 'GNM Diploma',
    candidateSkills: ['Patient Care', 'Documentation', 'Vital Charting', 'Teamwork'],
    matchScore: '91%',
    resumeName: 'Priyanka_Roy_GNM.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '20 Sep 2026', note: 'Application received', completed: true, current: true }
    ],
  },
  {
    id: 'app-icu-4',
    jobId: 'job-icu-nurse',
    jobTitle: 'ICU Staff Nurse / GNM',
    company: 'Apollo Diagnostics Patna',
    location: 'Muhammadpur, Patna',
    salary: '₹28,000 - ₹38,000 / mo',
    appliedDate: '19 Sep 2026',
    status: 'Shortlisted' as const,
    candidateName: 'Megha Sinha',
    candidatePhone: '+91 94700 88231',
    candidateEmail: 'megha.sinha.care@gmail.com',
    candidateExperience: '4 Years Exp',
    candidateQualification: 'Post-Basic B.Sc Nursing',
    candidateSkills: ['ICU & CCU Incharge', 'Emergency Protocols', 'NABH Standards'],
    matchScore: '97%',
    resumeName: 'Megha_Sinha_CV.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '19 Sep 2026', note: 'Application submitted', completed: true },
      { stage: 'Shortlisted', date: '20 Sep 2026', note: 'Shortlisted for clinical interview', completed: true, current: true }
    ],
  },
  {
    id: 'app-tele-1',
    jobId: 'job-telecaller-patna',
    jobTitle: 'Customer Care & Telecaller Executive',
    company: 'Apex Customer Connect',
    location: 'Fraser Road, Patna',
    salary: '₹18,000 - ₹25,000 / mo',
    appliedDate: '22 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Vikash Kumar Mishra',
    candidatePhone: '+91 99342 55910',
    candidateEmail: 'vikash.mishra.bpo@gmail.com',
    candidateExperience: '2 Years Exp',
    candidateQualification: '12th Pass / Intermediate',
    candidateSkills: ['Hindi Voice Process', 'Customer Grievances', 'Outbound Calling'],
    matchScore: '95%',
    resumeName: 'Vikash_Mishra_Telecaller.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '22 Sep 2026', note: 'Application received', completed: true, current: true }
    ],
  },
  {
    id: 'app-tele-2',
    jobId: 'job-telecaller-patna',
    jobTitle: 'Customer Care & Telecaller Executive',
    company: 'Apex Customer Connect',
    location: 'Fraser Road, Patna',
    salary: '₹18,000 - ₹25,000 / mo',
    appliedDate: '21 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Shreya Kumari',
    candidatePhone: '+91 93045 77619',
    candidateEmail: 'shreya.k.bpo@yahoo.com',
    candidateExperience: '1 Year Exp',
    candidateQualification: 'Graduate (B.Com)',
    candidateSkills: ['Tele-sales', 'Lead Conversion', 'CRM Software', 'Communication'],
    matchScore: '92%',
    resumeName: 'Shreya_Kumari_BPO.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '21 Sep 2026', note: 'Application received', completed: true, current: true }
    ],
  },
  {
    id: 'app-iron-1',
    jobId: 'job-iron-man',
    jobTitle: 'Iron Man',
    company: 'Stark Fabrications & Industrial Works',
    location: 'Shakurpur, Delhi / NCR',
    salary: '₹25,000 - ₹35,000 / mo',
    appliedDate: '22 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Rakesh Kumar Sharma',
    candidatePhone: '+91 98712 34567',
    candidateEmail: 'rakesh.welder@gmail.com',
    candidateExperience: '2.5 Years Exp',
    candidateQualification: 'ITI Welder / Metal Fitting',
    candidateSkills: ['Metal Fabrication', 'Arc Welding', 'Safety Protocols', 'Housekeeping'],
    matchScore: '96%',
    resumeName: 'Rakesh_Fabrication_ITI.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '22 Sep 2026', note: 'Application submitted', completed: true, current: true }
    ],
  },
  {
    id: 'app-iron-2',
    jobId: 'job-iron-man',
    jobTitle: 'Iron Man',
    company: 'Stark Fabrications & Industrial Works',
    location: 'Shakurpur, Delhi / NCR',
    salary: '₹25,000 - ₹35,000 / mo',
    appliedDate: '22 Sep 2026',
    status: 'Applied' as const,
    candidateName: 'Pankaj Verma',
    candidatePhone: '+91 98109 23841',
    candidateEmail: 'pankaj.verma91@gmail.com',
    candidateExperience: '3 Years Exp',
    candidateQualification: '10th Pass & Technical Certificate',
    candidateSkills: ['Gas Welding', 'MIG Welding', 'Sheet Metal Cutting'],
    matchScore: '93%',
    resumeName: 'Pankaj_Verma_Technical.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '22 Sep 2026', note: 'Application submitted', completed: true, current: true }
    ],
  },
  {
    id: 'app-2',
    jobId: 'job-3',
    jobTitle: 'Sales Executive',
    company: 'Bajaj Finserv Consumer Finance',
    location: 'Patna, Bihar',
    salary: '₹22,000 - ₹34,000 / mo + Incentives',
    appliedDate: '15 Sep 2026',
    status: 'Shortlisted' as const,
    candidateName: 'Rajesh Ranjan',
    candidatePhone: '+91 98352 11094',
    candidateEmail: 'rajesh.ranjan@gmail.com',
    candidateExperience: '2 Years Exp',
    candidateQualification: 'BBA / Graduate',
    candidateSkills: ['Field Sales', 'Dealer Management', 'Customer Acquisition'],
    matchScore: '90%',
    resumeName: 'Rajesh_Ranjan_Sales.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '15 Sep 2026', note: 'Application received', completed: true },
      { stage: 'Viewed', date: '16 Sep 2026', note: 'Application viewed by Talent Acquisition', completed: true },
      { stage: 'Shortlisted', date: '18 Sep 2026', note: 'Selected for Telephonic Screening', completed: true, current: true },
      { stage: 'Interview', date: 'TBD', note: 'Awaiting telephonic interview schedule', completed: false }
    ],
    hrContact: {
      name: 'Rajesh Ranjan',
      designation: 'Area HR Head',
      phone: '+91 98352 11094'
    }
  },
  {
    id: 'app-3',
    jobId: 'job-4',
    jobTitle: 'Customer Support Executive',
    company: 'Flipkart Customer Connect',
    location: 'Work From Home',
    salary: '₹20,000 - ₹26,000 / mo',
    appliedDate: '10 Sep 2026',
    status: 'Viewed' as const,
    candidateName: 'Pooja Kumari',
    candidatePhone: '+91 91223 88102',
    candidateEmail: 'pooja.kumari.cs@gmail.com',
    candidateExperience: '1.5 Years Exp',
    candidateQualification: 'B.A. English / Graduate',
    candidateSkills: ['Email Support', 'Chat Support', 'CRM Ticketing', 'Fluent English'],
    matchScore: '89%',
    resumeName: 'Pooja_Kumari_Support_CV.pdf',
    statusTimeline: [
      { stage: 'Applied', date: '10 Sep 2026', note: 'Application submitted', completed: true },
      { stage: 'Viewed', date: '12 Sep 2026', note: 'Recruiter opened your resume', completed: true, current: true },
      { stage: 'Shortlisted', date: 'Pending', note: 'Evaluation under review', completed: false }
    ]
  }
];

export const INITIAL_HR_REQUESTS = [
  {
    id: 'hr-1',
    recruiterName: 'Dr. Alok Verma',
    company: 'Apex Heart & Super Speciality',
    role: 'ICU Staff Nurse',
    salary: '₹35,000 / month',
    location: 'Patna (Boring Road)',
    receivedAt: '2 hours ago',
    status: 'Pending' as const,
    message: 'Hello Aman, we reviewed your nursing experience in patient monitoring. We have an immediate urgent opening for our Day/Night ICU rotation. Can we connect today?'
  },
  {
    id: 'hr-2',
    recruiterName: 'Ananya Roy',
    company: 'Apollo Clinic Patna',
    role: 'OPD Nurse Supervisor',
    salary: '₹32,000 / month',
    location: 'Patna (Kankarbagh)',
    receivedAt: 'Yesterday',
    status: 'Pending' as const,
    message: 'Hi Aman, your profile was recommended by Jobs India matching engine. Would you be interested in a senior ward nurse position?'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'interview' as const,
    title: 'Interview Scheduled Tomorrow! 🏥',
    message: 'Medanta Hospital scheduled your F2F Clinical interview for 22 Sep at 11:30 AM in Patna.',
    timestamp: '1 hour ago',
    read: false,
    jobId: 'job-1'
  },
  {
    id: 'notif-2',
    type: 'hr' as const,
    title: 'New Direct Recruiter Request 💬',
    message: 'Dr. Alok Verma from Apex Heart Super Speciality sent an invitation to discuss an ICU Nurse role.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'job_match' as const,
    title: '3 New Jobs Matched in Muhammadpur 📍',
    message: 'New Urgent Hiring posted within 2 km of your location: Staff Nurse, Sales Executive, Data Entry.',
    timestamp: '5 hours ago',
    read: false
  },
  {
    id: 'notif-4',
    type: 'profile' as const,
    title: 'Boost Profile to 100% 🚀',
    message: 'Add 1 more skill certificate to unlock 3x more recruiter direct calls this week.',
    timestamp: '1 day ago',
    read: true
  }
];
