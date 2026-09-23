import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  SlidersHorizontal,
  ArrowRight,
  Headphones,
  PhoneCall,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Building2,
  User,
  Wallet,
  X,
  ShieldCheck,
  Check,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Users,
  Eye,
  Trash2,
  Edit3,
  RefreshCw,
  Clock,
  Briefcase,
  UserCheck,
  RotateCcw,
  Crown,
  Zap,
  QrCode,
  Receipt,
  History,
  Printer,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Job, Application, ApplicationStatus, EmployerProfile, PremiumPlan, PlatformSettings } from '../types';
import { DEFAULT_EMPLOYER_PROFILE } from '../data/employerProfiles';
import { loadStoredPremiumPlans, loadStoredPlatformSettings } from '../data/settingsData';
import { PostJobWizard } from './PostJobWizard';
import { BulkApplicationsModal } from './BulkApplicationsModal';
import { QuickReplyTemplatesLibraryModal } from './QuickReplyTemplatesLibraryModal';
import { EmployerProfileModal } from './EmployerProfileModal';
import { PlanPaymentModal } from './PlanPaymentModal';

interface EmployerPortalProps {
  jobs: Job[];
  onAddJob: (job: Job) => void;
  applications: Application[];
  onUpdateApplicationStatus: (
    appId: string,
    newStatus: any,
    notificationData?: { title: string; message: string }
  ) => void;
  onBulkUpdateApplicationStatus?: (
    appIds: string[],
    newStatus: ApplicationStatus,
    notificationData?: { title: string; message: string }
  ) => void;
  onOpenSwitchMode: () => void;
  employerProfile?: EmployerProfile;
  onUpdateEmployerProfile?: (updated: EmployerProfile) => void;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  plans?: PremiumPlan[];
  settings?: PlatformSettings;
}

export interface EmployerPaymentTransaction {
  id: string;
  planId: string;
  planName: string;
  amount: string;
  activeTime: string;
  date: string;
  paymentMode: string;
  status: 'Successful' | 'Processing';
  utrReference: string;
  walletBonusAdded: number;
  companyName: string;
}

interface EmployerJobItem {
  id: string;
  title: string;
  location: string;
  status: 'Rejected' | 'Active' | 'Under Review' | 'Expired';
  rejectionReason?: string;
  responsesCount: number;
  hotLeadsCount: number;
  databaseLeadsCount: number;
  postedDate: string;
  isActive: boolean;
  salary?: string;
  company?: string;
  jobType?: string;
}

export const INITIAL_SAMPLE_EMPLOYER_JOBS: EmployerJobItem[] = [
  {
    id: 'job-iron-man',
    title: 'Iron Man',
    location: 'Shakurpur, Delhi / NCR',
    status: 'Rejected',
    rejectionReason:
      'Job post was flagged by trust & safety moderation: The title "Iron Man" is ambiguous and does not define standard industrial duties (e.g., Fabricator / Welder / CNC Operator / Steel Erector). Please update the designation and skill requirements to pass quality guidelines and re-activate.',
    responsesCount: 0,
    hotLeadsCount: 5,
    databaseLeadsCount: 69680,
    postedDate: '22nd September 26',
    isActive: false,
    salary: '₹25,000 - ₹35,000 / mo',
    company: 'Stark Fabrications & Industrial Works',
    jobType: 'Full Time',
  },
  {
    id: 'job-icu-nurse',
    title: 'ICU Staff Nurse / GNM',
    location: 'Muhammadpur, Patna',
    status: 'Active',
    responsesCount: 18,
    hotLeadsCount: 14,
    databaseLeadsCount: 69680,
    postedDate: '20th September 26',
    isActive: true,
    salary: '₹28,000 - ₹38,000 / mo',
    company: 'Apollo Diagnostics Patna',
    jobType: 'Full Time',
  },
  {
    id: 'job-telecaller-patna',
    title: 'Customer Care & Telecaller Executive',
    location: 'Fraser Road, Patna',
    status: 'Under Review',
    rejectionReason: 'Under routine 2-hour employer verification check for voice recording compliance.',
    responsesCount: 4,
    hotLeadsCount: 9,
    databaseLeadsCount: 69680,
    postedDate: '21st September 26',
    isActive: true,
    salary: '₹16,000 - ₹22,000 / mo',
    company: 'Tata 1mg Patna',
    jobType: 'Full Time',
  },
];

export const EmployerPortal: React.FC<EmployerPortalProps> = ({
  jobs,
  onAddJob,
  applications,
  onUpdateApplicationStatus,
  onBulkUpdateApplicationStatus,
  onOpenSwitchMode,
  employerProfile,
  onUpdateEmployerProfile,
  onOpenAuth,
  plans: propPlans,
  settings: propSettings,
}) => {
  const currentProfile = employerProfile || DEFAULT_EMPLOYER_PROFILE;
  const availablePlans = propPlans || loadStoredPremiumPlans();
  const currentSettings = propSettings || loadStoredPlatformSettings();

  const handleSaveProfile = (updated: EmployerProfile) => {
    if (onUpdateEmployerProfile) {
      onUpdateEmployerProfile(updated);
    }
  };

  // Derive account key for isolated storage per employer
  const employerAccountKey = (currentProfile.workEmail || currentProfile.companyName || 'default')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
  const storageKey = `jobs_india_employer_jobs_${employerAccountKey}`;

  // Employer Job Listings (Isolated per account & supports Fresh Database)
  const [employerJobs, setEmployerJobs] = useState<EmployerJobItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    // Default for demo Apollo Diagnostics account if never initialized
    if (
      (currentProfile.workEmail || '').includes('apollodiagnostics.in') ||
      employerAccountKey.includes('apollo') ||
      employerAccountKey === 'default'
    ) {
      return INITIAL_SAMPLE_EMPLOYER_JOBS;
    }
    // New sign up or custom accounts start with a 100% clean, fresh database
    return [];
  });

  // Re-sync when switching employer accounts
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setEmployerJobs(JSON.parse(saved));
        return;
      }
    } catch (e) {}

    if (
      (currentProfile.workEmail || '').includes('apollodiagnostics.in') ||
      employerAccountKey.includes('apollo') ||
      employerAccountKey === 'default'
    ) {
      setEmployerJobs(INITIAL_SAMPLE_EMPLOYER_JOBS);
    } else {
      setEmployerJobs([]);
    }
  }, [storageKey, currentProfile.workEmail]);

  // Persist to localStorage whenever employerJobs changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(employerJobs));
    } catch (e) {}
  }, [employerJobs, storageKey]);

  // Clear Database State
  const [isClearDatabaseModalOpen, setIsClearDatabaseModalOpen] = useState(false);

  // Clear all jobs to Fresh Database
  const handleClearJobList = () => {
    setEmployerJobs([]);
    try {
      localStorage.setItem(storageKey, JSON.stringify([]));
    } catch (e) {}
    setIsClearDatabaseModalOpen(false);
    showToast('✨ Job list cleared! Fresh database is ready.');
  };

  // Restore Sample Postings
  const handleRestoreSampleJobs = () => {
    setEmployerJobs(INITIAL_SAMPLE_EMPLOYER_JOBS);
    try {
      localStorage.setItem(storageKey, JSON.stringify(INITIAL_SAMPLE_EMPLOYER_JOBS));
    } catch (e) {}
    setIsClearDatabaseModalOpen(false);
    showToast('📦 3 Demo sample jobs restored.');
  };

  // Wallet state
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  // Recruiter Premium Plans & Quick Pay Payment Flow state
  const [activeEmployerPlan, setActiveEmployerPlan] = useState<PremiumPlan | null>(() => {
    try {
      const saved = localStorage.getItem(`jobs_india_employer_plan_${employerAccountKey}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PremiumPlan | null>(null);
  const [isPlanPaymentModalOpen, setIsPlanPaymentModalOpen] = useState(false);

  // HR Payment Transactions History state
  const txnStorageKey = `jobs_india_employer_txns_${employerAccountKey}`;
  const [transactions, setTransactions] = useState<EmployerPaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(txnStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'TXN-849201',
        planId: '1m',
        planName: '1 Month Starter Recruiter',
        amount: '₹299',
        activeTime: '30 Days Validity',
        date: '19 Sep 2026, 10:45 AM',
        paymentMode: 'UPI / Scan QR Code (PhonePe)',
        status: 'Successful',
        utrReference: 'UPI482910492812',
        walletBonusAdded: 500,
        companyName: currentProfile.companyName || 'Medanta Super Speciality',
      },
    ];
  });
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<EmployerPaymentTransaction | null>(null);

  const handleOpenQuickPay = (plan: PremiumPlan) => {
    setSelectedPlanForPayment(plan);
    setIsPlanPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (
    plan: PremiumPlan,
    details?: { paymentMode?: string; utrNumber?: string; finalAmount?: string }
  ) => {
    setActiveEmployerPlan(plan);
    try {
      localStorage.setItem(`jobs_india_employer_plan_${employerAccountKey}`, JSON.stringify(plan));
    } catch {
      // ignore
    }
    const bonusAmount = plan.id === '1m' ? 500 : plan.id === '3m' ? 1200 : 2500;
    setWalletBalance((prev) => prev + bonusAmount);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTxn: EmployerPaymentTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      planId: plan.id,
      planName: plan.name,
      amount: details?.finalAmount || plan.price,
      activeTime: plan.activeTime || `${plan.validityDays || 30} Days Validity`,
      date: formattedDate,
      paymentMode: details?.paymentMode || 'UPI / Scan QR Code',
      status: 'Successful',
      utrReference: details?.utrNumber || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      walletBonusAdded: bonusAmount,
      companyName: currentProfile.companyName || 'Company HR',
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      try {
        localStorage.setItem(txnStorageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    showToast(
      `🎉 Quick Pay Verified! ${plan.name} (${plan.activeTime || '30 Days'}) is now active & saved in HR Transaction History! (+₹${bonusAmount} wallet bonus)`
    );
  };

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<'All' | 'Rejected' | 'Active' | 'Under Review'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Modals
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBulkApplicationsOpen, setIsBulkApplicationsOpen] = useState(false);
  const [applicationsModalJobId, setApplicationsModalJobId] = useState<string | null>(null);
  const [applicationsInitialStatus, setApplicationsInitialStatus] = useState<'All' | ApplicationStatus>('All');
  const [isQuickTemplatesLibraryOpen, setIsQuickTemplatesLibraryOpen] = useState(false);

  // Selected job for detail modals
  const [selectedJobForReason, setSelectedJobForReason] = useState<EmployerJobItem | null>(null);
  const [selectedJobForHotLeads, setSelectedJobForHotLeads] = useState<EmployerJobItem | null>(null);
  const [selectedJobForResponses, setSelectedJobForResponses] = useState<EmployerJobItem | null>(null);
  const [isDatabaseLeadsOpen, setIsDatabaseLeadsOpen] = useState(false);
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Bulk status update handler
  const handleBulkUpdateStatus = (
    appIds: string[],
    newStatus: ApplicationStatus,
    notificationData?: { title: string; message: string }
  ) => {
    if (onBulkUpdateApplicationStatus) {
      onBulkUpdateApplicationStatus(appIds, newStatus, notificationData);
    } else {
      appIds.forEach((id) => onUpdateApplicationStatus(id, newStatus, notificationData));
    }
  };

  // Single status update handler
  const handleSingleUpdateStatus = (
    appId: string,
    newStatus: ApplicationStatus,
    notificationData?: { title: string; message: string }
  ) => {
    onUpdateApplicationStatus(appId, newStatus, notificationData);
  };

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState(currentProfile.companyName || 'Apollo Diagnostics Patna');
  const [newLocality, setNewLocality] = useState(currentProfile.officeAddress || 'Muhammadpur, Patna');
  const [newMinSalary, setNewMinSalary] = useState('25000');
  const [newMaxSalary, setNewMaxSalary] = useState('40000');
  const [newJobType, setNewJobType] = useState<'Full Time' | 'Part Time' | 'Work From Home'>('Full Time');
  const [newHrName, setNewHrName] = useState(currentProfile.hrName || 'Dr. Alok Verma');
  const [newHrPhone, setNewHrPhone] = useState(currentProfile.phone || '+91 98350 12845');
  const [newHrEmail, setNewHrEmail] = useState(currentProfile.workEmail || 'hr.alok@apollodiagnostics.in');

  // Handle Post New Job from PostJobWizard
  const handleCreateNewJob = (jobData: any) => {
    const newJobItem: EmployerJobItem = {
      id: jobData.id || `job-emp-${Date.now()}`,
      title: jobData.title || 'Iron Man',
      location: jobData.location || `${jobData.locality}, ${jobData.city}`,
      status: 'Active',
      responsesCount: 0,
      hotLeadsCount: 5,
      databaseLeadsCount: 69680,
      postedDate: '22nd September 26',
      isActive: true,
      salary: jobData.salary || '₹10,000 - ₹10,000 / mo',
      company: jobData.company || 'Stark Fabrications & Industrial Works',
      jobType: 'Full Time',
    };

    setEmployerJobs([newJobItem, ...employerJobs]);

    // Also push to global jobs list for seekers
    const fullJob: Job = {
      id: newJobItem.id,
      title: jobData.title || 'Iron Man',
      company: jobData.company || 'Stark Fabrications & Industrial Works',
      companyLogoBg: '#0047AB',
      companyLogoText: (jobData.company || 'Stark').slice(0, 2).toUpperCase(),
      location: jobData.location || 'Shakurpur, Delhi / NCR',
      locality: jobData.locality || 'Shakurpur',
      distance: 'Within 2.0 km',
      salary: jobData.salary || '₹10,000 - ₹10,000 / mo',
      minSalary: jobData.minSalary || 10000,
      maxSalary: jobData.maxSalary || 10000,
      experience: jobData.experience || 'Fresher & Experienced',
      jobType: 'Full Time',
      isWorkFromHome: false,
      isHighSalary: false,
      isUrgent: true,
      isNew: true,
      postedTime: 'Just now',
      applicantsCount: 0,
      vacancies: jobData.vacancies || 4,
      description: `Hiring ${jobData.title} in ${jobData.locality || 'Shakurpur'}, ${jobData.city || 'Delhi / NCR'}. English Requirement: ${jobData.englishLevel || 'Does not speak english'}. Gender Preference: ${jobData.gender || 'Male'}.`,
      responsibilities: [
        `Deliver prompt professional service according to company protocols.`,
        `Adhere strictly to workshop safety guidelines.`,
        `Coordinate daily work with team supervisors.`,
      ],
      requiredSkills: jobData.skills && jobData.skills.length > 0 ? jobData.skills : ['Cleaning and Housekeeping', 'Housekeeping'],
      benefits: ['Monthly Bonus Eligible', 'Overtime Pay', 'PF & ESI'],
      aboutCompany: {
        rating: 4.8,
        reviewsCount: 140,
        employees: '100+ employees',
        industry: jobData.roleArea || 'Housekeeping & Laundry',
        address: `${jobData.locality || 'Shakurpur'}, ${jobData.city || 'Delhi / NCR'}`,
        verified: true,
      },
      recruiterContact: {
        name: jobData.hrName || 'Tony Stark',
        designation: 'Recruiting Lead',
        phone: jobData.hrPhone || '+91 98712 34567',
        email: jobData.hrEmail || 'recruiter@jobsindia.in',
        isVerified: true,
        kycDocument: 'CIN-U74999DL2024PTC392811',
        companyGstin: '07AAAAA0000A1Z5',
        verifiedAt: 'Verified Just Now',
      },
    };

    onAddJob(fullJob);
    setIsPostJobModalOpen(false);
    showToast(`Job "${newJobItem.title}" posted successfully!`);
  };

  // Toggle Activation
  const handleToggleActivate = (jobId: string) => {
    setEmployerJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextActive = !j.isActive;
          const nextStatus = nextActive ? 'Active' : 'Rejected';
          return {
            ...j,
            isActive: nextActive,
            status: nextStatus,
          };
        }
        return j;
      })
    );
    showToast('Job status updated successfully!');
  };

  // Delete Job
  const handleDeleteJob = (jobId: string) => {
    setEmployerJobs((prev) => prev.filter((j) => j.id !== jobId));
    setActiveMenuJobId(null);
    showToast('Job listing deleted.');
  };

  // Filtered jobs
  const displayedJobs = employerJobs.filter((j) => {
    if (statusFilter === 'All') return true;
    return j.status === statusFilter;
  });

  // Mock Hot Leads Candidates for modal
  const mockHotLeads = [
    {
      id: 'lead-1',
      name: 'Rakesh Kumar Sharma',
      experience: '2.5 Years Experience',
      location: 'Shakurpur / Delhi NCR',
      skills: 'Metal Fabrication, Arc Welding, Safety Protocols',
      matchScore: '96% Match',
      mobile: '+91 98712 34567',
    },
    {
      id: 'lead-2',
      name: 'Pankaj Verma',
      experience: '3 Years Experience',
      location: 'Netaji Subhash Place, Delhi',
      skills: 'Machine Operation, Fabrication, Heavy Duty Assembly',
      matchScore: '92% Match',
      mobile: '+91 99105 87412',
    },
    {
      id: 'lead-3',
      name: 'Sonu Prajapati',
      experience: '1.8 Years Experience',
      location: 'Rohini Sector 7, Delhi',
      skills: 'Welding, Precision Cutting, Team Coordination',
      matchScore: '89% Match',
      mobile: '+91 97184 21980',
    },
    {
      id: 'lead-4',
      name: 'Amit Kumar Singh',
      experience: '4 Years Experience',
      location: 'Pitampura, Delhi',
      skills: 'Industrial Workshop, MIG Welding, Tool Maintenance',
      matchScore: '87% Match',
      mobile: '+91 98110 54321',
    },
    {
      id: 'lead-5',
      name: 'Manoj Yadav',
      experience: '2 Years Experience',
      location: 'Azadpur, Delhi',
      skills: 'Mechanical Fitting, Blueprint Reading, Shift Supervision',
      matchScore: '85% Match',
      mobile: '+91 98991 76543',
    },
  ];

  return (
    <div
      id="employer-job-list-view"
      className="min-h-screen bg-[#F1F5F9] pb-24 text-slate-800 font-sans select-none"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR (Exact royal blue matching the screenshot) */}
      {/* ========================================================================= */}
      <header className="bg-[#0047AB] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Left: Hamburger Menu & Title */}
          <div className="flex items-center gap-3">
            <button
              id="employer-menu-hamburger-btn"
              onClick={() => setIsDrawerOpen(true)}
              className="p-1 -ml-1 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 text-white stroke-[2.2]" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Job List
            </h1>
          </div>

          {/* Right: Notification Bell & Sliders/Filter */}
          <div className="flex items-center gap-2">
            {/* Bell Icon with Red Alert Badge */}
            <button
              id="employer-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#0047AB]" />
            </button>

            {/* Sliders / Filter Icon with Yellow Dot (exact as screenshot) */}
            <div className="relative">
              <button
                id="employer-filter-sliders-btn"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Filter Job Posts"
              >
                <SlidersHorizontal className="w-5 h-5 text-white" />
                {/* Yellow dot on top-right of sliders */}
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F59E0B] ring-2 ring-[#0047AB]" />
              </button>

              {/* Status Filter Dropdown */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  <div className="px-3 py-1.5 font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    Filter by Status
                  </div>
                  {(['All', 'Active', 'Rejected', 'Under Review'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                        statusFilter === status ? 'font-bold text-[#0047AB]' : 'text-slate-700'
                      }`}
                    >
                      <span>{status} Jobs</span>
                      {statusFilter === status && <Check className="w-3.5 h-3.5 text-[#0047AB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. WALLET BALANCE STRIP (White background with green RECHARGE button) */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 px-4 py-3 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-slate-500 font-medium">Wallet Balance</span>
            <span className="text-slate-900 font-bold text-base sm:text-lg">
              ₹{walletBalance}
            </span>
            {activeEmployerPlan && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500" />
                <span>{activeEmployerPlan.name}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('employer-premium-plans-container');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-indigo-50 hover:bg-indigo-100 text-[#0047AB] border border-indigo-200 font-extrabold text-xs px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Plans</span>
            </button>

            <button
              id="employer-wallet-recharge-btn"
              onClick={() => setIsRechargeModalOpen(true)}
              className="bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 text-white font-extrabold text-xs sm:text-[13px] tracking-wider uppercase px-4 py-1.5 rounded-md transition-all shadow-xs cursor-pointer"
            >
              RECHARGE
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="max-w-xl mx-auto px-4 pt-3.5 space-y-3">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-[#0047AB] text-white px-3.5 py-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 3A. Call Customer Support Chip */}
        <div>
          <button
            id="employer-call-support-chip"
            onClick={() => setIsSupportModalOpen(true)}
            className="border border-slate-300 hover:border-slate-400 bg-white active:bg-slate-50 rounded-md px-3 py-1.5 inline-flex items-center gap-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            {/* Cute Customer support avatar / headset icon */}
            <div className="w-4 h-4 rounded-full border border-slate-400/80 flex items-center justify-center text-slate-600">
              <Headphones className="w-2.5 h-2.5" />
            </div>
            <span>Call Customer support</span>
          </button>
        </div>

        {/* 3B. Complete Profile Banner */}
        <div
          id="employer-profile-visibility-banner"
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-3.5 py-3 flex items-center justify-between shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-[#0047AB] truncate">
              {currentProfile.companyName}: Profile ({currentProfile.completionPercent}%)
            </span>
            <Edit3 className="w-3.5 h-3.5 text-[#0047AB] flex-shrink-0" />
          </div>
          <span className="bg-[#22C55E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
            {currentProfile.completionPercent === 100 ? 'Verified' : 'Edit / Update'}
          </span>
        </div>

        {/* 3C. Bulk Shortlist Quick Access Banner */}
        <div className="bg-gradient-to-r from-[#003882] to-[#0047AB] rounded-2xl p-3 sm:p-3.5 text-white shadow-md space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-xs sm:text-sm leading-tight">
                    Candidate Applications
                  </h3>
                  <span className="bg-[#22C55E] text-white text-[9px] font-black px-1.5 py-0.2 rounded-md tracking-wider uppercase">
                    Bulk Shortlist
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 truncate">
                  {applications.length} total applicants • Shortlist or move to Interviewing in 1 click
                </p>
              </div>
            </div>
            <button
              id="open-bulk-shortlist-banner-btn"
              onClick={() => {
                setApplicationsModalJobId(null);
                setApplicationsInitialStatus('All');
                setIsBulkApplicationsOpen(true);
              }}
              className="px-3.5 py-2 bg-white text-[#0047AB] hover:bg-blue-50 active:scale-95 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick status filter shortcuts */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-white/15 text-[11px] font-bold overflow-x-auto no-scrollbar">
            <span className="text-blue-200 text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 mr-0.5">
              Filter by:
            </span>
            <button
              type="button"
              onClick={() => {
                setApplicationsModalJobId(null);
                setApplicationsInitialStatus('Applied');
                setIsBulkApplicationsOpen(true);
              }}
              className="bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 py-1 rounded-lg text-white transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <span>📌 Applied</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {applications.filter((a) => a.status === 'Applied').length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setApplicationsModalJobId(null);
                setApplicationsInitialStatus('Shortlisted');
                setIsBulkApplicationsOpen(true);
              }}
              className="bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 py-1 rounded-lg text-white transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <span>⭐ Shortlisted</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {applications.filter((a) => a.status === 'Shortlisted').length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setApplicationsModalJobId(null);
                setApplicationsInitialStatus('Interviewing');
                setIsBulkApplicationsOpen(true);
              }}
              className="bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 py-1 rounded-lg text-white transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <span>🗓️ Interviewing</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {applications.filter((a) => a.status === 'Interview' || a.status === 'Interviewing').length}
              </span>
            </button>

            <button
              type="button"
              id="open-quick-templates-btn"
              onClick={() => setIsQuickTemplatesLibraryOpen(true)}
              className="bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-200 border border-emerald-400/30 active:scale-95 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer ml-auto"
              title="Browse & Test Quick Reply Templates"
            >
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Quick Reply Templates</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3D. EMPLOYER PREMIUM PLANS CONTAINER (with 'Quick Pay' buttons for UPI/QR) */}
        {/* ========================================================================= */}
        <section
          id="employer-premium-plans-container"
          className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-xs flex-shrink-0">
                <Crown className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Recruiter Premium & Hiring Plans
                  </h3>
                  <span className="bg-emerald-500/15 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                    Instant UPI / QR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select a hiring plan and use Quick Pay for 100% secure UPI or QR activation
                </p>
              </div>
            </div>

            {activeEmployerPlan && (
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-800">
                  Active: {activeEmployerPlan.name}
                </span>
              </div>
            )}
          </div>

          {/* Premium Plan Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {availablePlans.map((plan) => {
              const isPlanPopular = plan.popular;
              const isCurrentActive = activeEmployerPlan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  id={`employer-plan-card-${plan.id}`}
                  className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all ${
                    isPlanPopular
                      ? 'bg-gradient-to-b from-indigo-50/60 via-white to-blue-50/40 border-2 border-[#0047AB] shadow-sm'
                      : 'bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Popular or Best Value Badge */}
                  {isPlanPopular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{plan.badge || 'MOST POPULAR'}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Header: Plan Name & Active Time */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <h4 className="font-black text-sm text-slate-900 leading-tight">
                          {plan.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#0047AB] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#0047AB]" />
                          <span>{plan.activeTime || `${plan.validityDays || 30} Days Validity`}</span>
                        </p>
                      </div>
                      {isCurrentActive && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>

                    {/* Pricing Block */}
                    <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">
                          {plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                        {plan.duration}
                      </p>
                    </div>

                    {/* Recruiter Hiring Benefits */}
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          <strong>{plan.id === '1m' ? '50' : plan.id === '3m' ? '200' : '500'}</strong> Candidate Contacts Unlocked
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          <strong>{plan.id === '1m' ? '5' : plan.id === '3m' ? '15' : 'Unlimited'}</strong> Active Job Posts
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Verified Recruiter Gold Badge</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Direct WhatsApp & Call Connect</span>
                      </li>
                    </ul>

                    {/* UPI QR Discount Callout */}
                    {plan.qrDiscountAmount && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                        <QrCode className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                        <span>{plan.qrDiscountAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* QUICK PAY BUTTON (Simulates secure payment flow using UPI or QR code generation) */}
                  <div className="pt-3 mt-2 border-t border-slate-100">
                    <button
                      id={`quick-pay-btn-${plan.id}`}
                      type="button"
                      onClick={() => handleOpenQuickPay(plan)}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-[#0047AB] via-[#1D4ED8] to-[#2563EB] hover:from-[#003882] hover:to-[#1E40AF] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>Quick Pay</span>
                      <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded uppercase tracking-wider font-black ml-0.5">
                        UPI / QR
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 3E. TRANSACTION HISTORY SECTION (Inside #employer-premium-plans-container) */}
          {/* ========================================================================= */}
          <div
            id="employer-plans-transaction-history"
            className="mt-6 pt-5 border-t border-slate-200/90 space-y-3.5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0047AB] flex-shrink-0 shadow-2xs">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Transaction History
                    </h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      HR Records ({transactions.length})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Audit trail of past Quick Pay payments made via UPI & QR code generation for HR accounting
                  </p>
                </div>
              </div>

              {/* Action: Export CSV */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  id="export-hr-transactions-btn"
                  onClick={() => {
                    const csvContent =
                      'Transaction ID,Plan,Amount,Date,Payment Mode,UTR,Status\n' +
                      transactions
                        .map(
                          (t) =>
                            `"${t.id}","${t.planName}","${t.amount}","${t.date}","${t.paymentMode}","${t.utrReference}","${t.status}"`
                        )
                        .join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `Jobs_India_HR_Transactions_${employerAccountKey}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('📥 HR Transaction statement exported as CSV.');
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Export records to CSV for accounting"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Transactions List */}
            {transactions.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-200 space-y-1.5">
                <History className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Quick Pay transactions recorded yet</p>
                <p className="text-[11px] text-slate-500">
                  When you activate any plan using the 'Quick Pay' button above, the payment details and UTR will appear here for your HR records.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    id={`txn-record-${txn.id}`}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                            {txn.planName}
                          </h5>
                          <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            {txn.id}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.2 rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            {txn.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                          <span>{txn.date}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{txn.paymentMode}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200/80">
                            UTR: {txn.utrReference}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <div className="text-left sm:text-right">
                        <div className="text-sm sm:text-base font-black text-slate-900">
                          {txn.amount}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold">
                          +{txn.walletBonusAdded} Wallet Bonus
                        </div>
                      </div>

                      <button
                        type="button"
                        id={`view-hr-receipt-btn-${txn.id}`}
                        onClick={() => setSelectedReceiptTxn(txn)}
                        className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-[#0047AB] border border-blue-200 hover:border-blue-300 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="View official HR Tax Invoice & Payment Voucher"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>HR Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Job List Toolbar: Postings count & Clear Fresh Database Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Job Postings ({employerJobs.length})
            </h2>
            {employerJobs.length === 0 ? (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Fresh Database
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Active Listings
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {employerJobs.length > 0 && (
              <button
                type="button"
                id="clear-job-list-fresh-db-btn"
                onClick={() => setIsClearDatabaseModalOpen(true)}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="Clear all job postings from old login and start fresh database"
              >
                <Trash2 className="w-3 h-3 text-rose-600" />
                <span>Clear (Fresh DB)</span>
              </button>
            )}

            {employerJobs.length === 0 && (
              <button
                type="button"
                id="restore-sample-jobs-btn"
                onClick={handleRestoreSampleJobs}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 active:scale-95 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="Restore 3 sample demo postings"
              >
                <RotateCcw className="w-3 h-3 text-slate-600" />
                <span>Demo Jobs</span>
              </button>
            )}

            <button
              type="button"
              id="toolbar-post-job-btn"
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-2.5 py-1 bg-[#0047AB] hover:bg-[#003882] text-white active:scale-95 text-[11px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Post Job</span>
            </button>
          </div>
        </div>

        {/* Active Filter Pill indicator if not All */}
        {statusFilter !== 'All' && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong>{statusFilter}</strong> posts ({displayedJobs.length})
            </span>
            <button
              onClick={() => setStatusFilter('All')}
              className="text-[#0047AB] font-bold hover:underline"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. JOB POSTINGS CARDS (Exact match to user's uploaded screenshot) */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-1">
          {displayedJobs.length === 0 ? (
            employerJobs.length === 0 ? (
              <div className="bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/60 rounded-3xl border-2 border-dashed border-emerald-300/80 p-7 text-center space-y-3.5 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Fresh Clean Database Initialized
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    No Job Postings Yet
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your job database for <strong>{currentProfile.companyName}</strong> is 100% clean and ready. Post your first job vacancy to start receiving verified applicants instantly!
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs mx-auto">
                  <button
                    type="button"
                    id="fresh-db-post-first-job-btn"
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0047AB] hover:bg-[#003882] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Your First Job</span>
                  </button>

                  <button
                    type="button"
                    id="fresh-db-load-demo-btn"
                    onClick={handleRestoreSampleJobs}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Load Demo Jobs</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No job posts in this view</h3>
                <p className="text-xs text-slate-500">
                  You do not have any job posts matching "{statusFilter}".
                </p>
                <button
                  onClick={() => setStatusFilter('All')}
                  className="mt-2 text-xs font-bold text-[#0047AB] hover:underline"
                >
                  Show All Jobs
                </button>
              </div>
            )
          ) : (
            displayedJobs.map((job) => (
              <div
                key={job.id}
                id={`employer-job-card-${job.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-sm"
              >
                {/* 4A. REJECTION ALERT BANNER (If rejected - exact replica of image) */}
                {job.status === 'Rejected' && (
                  <div className="bg-[#FFF1F2] border-b border-red-100 px-3.5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Red filled circle with '!' */}
                      <div className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        !
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                        This job post is rejected
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedJobForReason(job)}
                      className="text-[#0047AB] hover:text-blue-800 font-bold text-xs sm:text-sm flex items-center gap-1 flex-shrink-0 ml-2 hover:underline"
                    >
                      <span>See why</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Under Review Alert Banner */}
                {job.status === 'Under Review' && (
                  <div className="bg-amber-50 border-b border-amber-100 px-3.5 py-2 flex items-center justify-between text-xs text-amber-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Post is undergoing quality review (approx. 20 mins)</span>
                    </div>
                    <button
                      onClick={() => setSelectedJobForReason(job)}
                      className="text-[#0047AB] font-bold text-xs hover:underline flex items-center gap-0.5"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 4B. CARD BODY */}
                <div className="p-4 space-y-3.5">
                  {/* Title, Status Pill & More Options Menu */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {job.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                        {job.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 relative">
                      {/* Status Pill */}
                      <span
                        className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                          job.status === 'Rejected'
                            ? 'bg-[#F87171] text-white'
                            : job.status === 'Active'
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#F59E0B] text-white'
                        }`}
                      >
                        {job.status}
                      </span>

                      {/* Three vertical dots menu */}
                      <button
                        onClick={() =>
                          setActiveMenuJobId(activeMenuJobId === job.id ? null : job.id)
                        }
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Options */}
                      {activeMenuJobId === job.id && (
                        <div className="absolute right-0 top-8 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs">
                          <button
                            onClick={() => {
                              setApplicationsModalJobId(job.id);
                              setIsBulkApplicationsOpen(true);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-[#0047AB] font-bold"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#0047AB]" />
                            <span>Bulk Shortlist Applicants</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedJobForResponses(job);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Responses Summary</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedJobForHotLeads(job);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>View Hot Leads</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsPostJobModalOpen(true);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Edit in Post Job Wizard</span>
                          </button>
                          <button
                            onClick={() => {
                              handleToggleActivate(job.id);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                            <span>{job.isActive ? 'Deactivate Post' : 'Activate Post'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Delete Job Post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4C. THREE METRIC BOXES (Exact layout from image) */}
                  <div className="space-y-2">
                    {/* Top Row: Two Boxes */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Box 1: Responses till now */}
                      <div
                        onClick={() => {
                          setApplicationsModalJobId(job.id);
                          setIsBulkApplicationsOpen(true);
                        }}
                        className="border border-[#1E3A8A] rounded-xl p-3 bg-white hover:bg-blue-50/40 transition-colors cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-[#1E3A8A]">
                            {job.responsesCount}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#1E3A8A] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-slate-600 font-bold">
                            Responses till now
                          </p>
                          <span className="text-[9px] text-[#0047AB] bg-blue-50 border border-blue-200 font-extrabold px-1.5 py-0.2 rounded-md">
                            Bulk Action
                          </span>
                        </div>
                      </div>

                      {/* Box 2: 5 Hot Leads Match */}
                      <div
                        onClick={() => setSelectedJobForHotLeads(job)}
                        className="border border-[#D97706] rounded-xl p-3 bg-white hover:bg-amber-50/40 transition-colors cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-[#B45309]">
                            {job.hotLeadsCount} Hot Leads
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#B45309]" />
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1">
                          Match your job post
                        </p>
                      </div>
                    </div>

                    {/* Bottom Full-Width Box: Leads in Database */}
                    <div
                      onClick={() => setIsDatabaseLeadsOpen(true)}
                      className="border border-[#1E3A8A] rounded-xl p-3 bg-white hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="text-base sm:text-lg font-bold text-[#1E3A8A] block">
                          {job.databaseLeadsCount.toLocaleString('en-IN')}
                        </span>
                        <p className="text-xs text-slate-600 font-medium">
                          Leads in Database
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                  </div>

                  {/* 4D. FOOTER ROW: Posted Date & Activate / Manage Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-medium">
                      Posted on : {job.postedDate}
                    </span>

                    <button
                      id={`employer-activate-btn-${job.id}`}
                      onClick={() => handleToggleActivate(job.id)}
                      className={`font-bold text-xs sm:text-sm px-6 py-2 rounded-xl transition-all shadow-xs ${
                        job.status === 'Active'
                          ? 'bg-[#0047AB] hover:bg-[#003882] text-white'
                          : 'bg-[#37498B] hover:bg-[#2B3A70] text-white'
                      }`}
                    >
                      {job.status === 'Active' ? 'Active' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. FLOATING ACTION BUTTON: POST A JOB */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-5 z-20">
        <button
          id="employer-fab-post-job"
          onClick={() => setIsPostJobModalOpen(true)}
          className="bg-[#0047AB] hover:bg-[#003882] text-white font-bold px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. SIDE DRAWER MENU (When Hamburger icon is clicked) */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="bg-[#0047AB] text-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity min-w-0 flex-1"
                    title="Tap to view & edit company profile"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-sm text-white flex-shrink-0 shadow-inner">
                      {currentProfile.companyInitials}
                    </div>
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-sm leading-tight truncate text-white">
                          {currentProfile.companyName}
                        </h3>
                        <Edit3 className="w-3 h-3 text-blue-200 flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-blue-200 truncate">
                        {currentProfile.hubName} • {currentProfile.designation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-white/15">
                  <span className="text-blue-100">Wallet: ₹{walletBalance}</span>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsRechargeModalOpen(true);
                    }}
                    className="bg-[#22C55E] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                  >
                    Recharge
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-2 divide-y divide-slate-100 text-xs text-slate-700">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      const el = document.getElementById('employer-premium-plans-container');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-indigo-50 font-bold text-[#0047AB]"
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span>Recruiter Plans & Quick Pay</span>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      UPI / QR
                    </span>
                  </button>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
                  >
                    <Briefcase className="w-4 h-4 text-[#0047AB]" />
                    <span>Job List ({employerJobs.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setApplicationsModalJobId(null);
                      setIsBulkApplicationsOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                  >
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Applications & Bulk Shortlist</span>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {applications.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsQuickTemplatesLibraryOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-[#0047AB]" />
                      <span>Quick Reply Templates</span>
                    </div>
                    <span className="bg-blue-100 text-[#0047AB] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      10
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsPostJobModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>Post a New Job</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsDatabaseLeadsOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Candidate Database (69,680+ Leads)</span>
                  </button>

                  <button
                    id="drawer-clear-job-database-btn"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsClearDatabaseModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-700 font-bold transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Clear Job List (Fresh DB)</span>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {employerJobs.length} Posts
                    </span>
                  </button>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    id="drawer-company-profile-btn"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Company Profile & KYC (Edit/Update)</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {currentProfile.completionPercent}%
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsSupportModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Headphones className="w-4 h-4 text-amber-600" />
                    <span>Call Customer Support</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Switch Mode */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                id="drawer-switch-mode-btn"
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenSwitchMode();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-between shadow-2xs"
              >
                <span>Switch App Mode (Candidate / Admin)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: SEE WHY JOB WAS REJECTED */}
      {/* ========================================================================= */}
      {selectedJobForReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Job Post Review Notice</h3>
                  <p className="text-xs text-slate-500">{selectedJobForReason.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobForReason(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-900 space-y-1.5">
              <h4 className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Moderation Reason:
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {selectedJobForReason.rejectionReason}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <h5 className="font-bold text-slate-800">Quick Guidelines to Activate:</h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Use explicit job designations (e.g. Iron & Steel Fabricator, Welder).</li>
                <li>Specify accurate shift timings, locality, and minimum wage compliance.</li>
                <li>Ensure official recruiter phone & work email ID are attached.</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleToggleActivate(selectedJobForReason.id);
                  setSelectedJobForReason(null);
                }}
                className="flex-1 py-2.5 bg-[#0047AB] hover:bg-[#003882] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Request Re-Review & Activate
              </button>
              <button
                onClick={() => setSelectedJobForReason(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: HOT LEADS MATCHED CANDIDATES */}
      {/* ========================================================================= */}
      {selectedJobForHotLeads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <h3 className="font-bold text-base text-slate-900">
                    {selectedJobForHotLeads.hotLeadsCount} Hot Leads Matched
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-screened candidates for "{selectedJobForHotLeads.title}"
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForHotLeads(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidates list */}
            <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
              {mockHotLeads.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cand.name}</h4>
                      <p className="text-slate-500">{cand.experience} • {cand.location}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {cand.matchScore}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    <strong>Skills:</strong> {cand.skills}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <a
                      href={`tel:${cand.mobile}`}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call {cand.mobile}</span>
                    </a>
                    <a
                      href={`https://wa.me/${cand.mobile.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(cand.name)},%20we%20reviewed%20your%20profile%20for%20our%20Job%20Posting%20on%20Jobs%20India.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedJobForHotLeads(null)}
                className="py-2 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: RESPONSES TILL NOW */}
      {/* ========================================================================= */}
      {selectedJobForResponses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Responses & Applications
                </h3>
                <p className="text-xs text-slate-500">{selectedJobForResponses.title}</p>
              </div>
              <button
                onClick={() => setSelectedJobForResponses(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedJobForResponses.responsesCount === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center space-y-2 border border-slate-200">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-xs">No responses received yet</h4>
                <p className="text-[11px] text-slate-500">
                  Once this job post is Activated, candidate responses will stream here in real-time.
                </p>
                <button
                  onClick={() => {
                    handleToggleActivate(selectedJobForResponses.id);
                    setSelectedJobForResponses(null);
                  }}
                  className="mt-2 px-4 py-1.5 bg-[#0047AB] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Activate Job Post Now
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="font-bold text-blue-900">Total {selectedJobForResponses.responsesCount} Candidates Applied</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Profiles and verified contact numbers are ready for review.</p>
                </div>

                <button
                  id="open-bulk-shortlist-from-responses-modal"
                  onClick={() => {
                    const jobId = selectedJobForResponses.id;
                    setSelectedJobForResponses(null);
                    setApplicationsModalJobId(jobId);
                    setIsBulkApplicationsOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Open Bulk Shortlist Manager ({selectedJobForResponses.responsesCount})</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedJobForResponses(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: DATABASE LEADS (69,680+ Candidates) */}
      {/* ========================================================================= */}
      {isDatabaseLeadsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Search 69,680+ Leads in Database
                </h3>
                <p className="text-xs text-slate-500">
                  Verified candidate profiles in Delhi/NCR & Bihar
                </p>
              </div>
              <button
                onClick={() => setIsDatabaseLeadsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-3 flex-1 overflow-y-auto">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by skill, role or city (e.g. Welder, Nurse, Patna)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                />
              </div>

              {/* Sample DB Profiles */}
              <div className="space-y-2 text-xs">
                {mockHotLeads.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{cand.name}</h4>
                      <p className="text-[11px] text-slate-500">{cand.experience} • {cand.location}</p>
                    </div>
                    <button
                      onClick={() => showToast(`Contact details unlocked for ${cand.name}!`)}
                      className="px-3 py-1.5 bg-[#0047AB] text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Unlock</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDatabaseLeadsOpen(false)}
                className="py-2 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. MODAL: CALL CUSTOMER SUPPORT (Exact support details from prompt) */}
      {/* ========================================================================= */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Contact Jobs India Support</h3>
                <p className="text-xs text-slate-500">Reach our team 7 days a week</p>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* WhatsApp Helpdesk */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                  Official WhatsApp Helpdesk
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-900 font-mono">
                    +918863090950
                  </span>
                  <a
                    href="https://wa.me/918863090950?text=Hello%20Jobs%20India%20Support,%20I%20need%20help%20with%20my%20Employer%20Job%20List."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <p className="text-[10px] text-emerald-700">Mon - Sat: 9:00 AM to 7:00 PM IST</p>
              </div>

              {/* Toll-Free Candidate Helpline */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 block">
                  Toll-Free Candidate Helpline
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-blue-900 font-mono">
                    1800-JOBS-INDIA
                  </span>
                  <a
                    href="tel:18005627463"
                    className="px-3 py-1.5 bg-[#0047AB] hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Toll-Free</span>
                  </a>
                </div>
                <p className="text-[10px] text-blue-700">1800-562-7463 (Toll Free across India)</p>
              </div>

              {/* Support Email */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Support Email
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">support.jobsindia@gmail.com</span>
                  <a
                    href="mailto:support.jobsindia@gmail.com?subject=Employer%20Support%20Request"
                    className="text-[#0047AB] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
                <p className="text-[10px] text-slate-500">Average response time: under 2 hours</p>
              </div>

              {/* Corporate Office */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block text-xs mb-0.5">Corporate Office</span>
                Jobs India Tech Labs, Level 4, Koiri tola Dr narayan babu Road, Patna, Bihar 800007
              </div>
            </div>

            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="w-full py-2.5 bg-[#0047AB] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. MODAL: WALLET RECHARGE */}
      {/* ========================================================================= */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recharge Employer Wallet</h3>
                <p className="text-xs text-slate-500">Current Balance: ₹{walletBalance}</p>
              </div>
              <button
                onClick={() => setIsRechargeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { amount: 500, label: 'Starter Pack', leads: '50 Candidate Contacts' },
                { amount: 1000, label: 'Growth Pack (Popular)', leads: '120 Contacts + 1 Job Boost' },
                { amount: 2000, label: 'Pro Recruiter', leads: '300 Contacts + 3 Job Boosts' },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => {
                    setWalletBalance((prev) => prev + pack.amount);
                    setIsRechargeModalOpen(false);
                    showToast(`Wallet credited with ₹${pack.amount} successfully!`);
                  }}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">₹{pack.amount}</h4>
                    <p className="text-[11px] text-slate-600">{pack.label}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{pack.leads}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#22C55E] text-white rounded-lg font-bold text-xs">
                    Add
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsRechargeModalOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. POST A NEW JOB WIZARD (Matches Screenshot Steps 1, 2 & 3) */}
      {/* ========================================================================= */}
      {isPostJobModalOpen && (
        <PostJobWizard
          onClose={() => setIsPostJobModalOpen(false)}
          onSubmit={handleCreateNewJob}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          initialRole="Iron Man"
          initialCity="Delhi / NCR"
          initialLocality="Shakurpur"
        />
      )}

      {/* ========================================================================= */}
      {/* 14. MODAL: EMPLOYER PROFILE & EDIT / UPDATE / AUTOMATE DATA */}
      {/* ========================================================================= */}
      <EmployerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={currentProfile}
        onUpdateProfile={handleSaveProfile}
        onOpenAuth={onOpenAuth}
        onToast={showToast}
      />

      {/* ========================================================================= */}
      {/* 15. MODAL: NOTIFICATIONS */}
      {/* ========================================================================= */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-base text-slate-900">Notifications</h3>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-900">
                <p className="font-bold">Job Post Rejected: "Iron Man"</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Title needs clarification. Tap "See why" on your card.</p>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <p className="font-bold">5 New Hot Leads Matched</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Candidates in Delhi & Patna matched your requirements.</p>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. BULK SHORTLIST & CANDIDATE APPLICATIONS MODAL */}
      {/* ========================================================================= */}
      <BulkApplicationsModal
        isOpen={isBulkApplicationsOpen}
        onClose={() => {
          setIsBulkApplicationsOpen(false);
          setApplicationsModalJobId(null);
          setApplicationsInitialStatus('All');
        }}
        applications={applications}
        jobs={employerJobs.map((j) => ({ id: j.id, title: j.title, location: j.location }))}
        selectedJobId={applicationsModalJobId}
        initialStatusFilter={applicationsInitialStatus}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onSingleUpdateStatus={handleSingleUpdateStatus}
        onToast={showToast}
      />

      {/* ========================================================================= */}
      {/* 17. QUICK REPLY TEMPLATES LIBRARY MODAL */}
      {/* ========================================================================= */}
      <QuickReplyTemplatesLibraryModal
        isOpen={isQuickTemplatesLibraryOpen}
        onClose={() => setIsQuickTemplatesLibraryOpen(false)}
        onOpenApplicationsWithStatus={(status) => {
          setIsQuickTemplatesLibraryOpen(false);
          setApplicationsModalJobId(null);
          setApplicationsInitialStatus(status);
          setIsBulkApplicationsOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 18. MODAL: CLEAR JOB LIST & FRESH DATABASE CONFIRMATION */}
      {/* ========================================================================= */}
      {isClearDatabaseModalOpen && (
        <div
          id="clear-database-confirmation-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-2xs animate-in fade-in select-none"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <button
                onClick={() => setIsClearDatabaseModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Clear Job List & Start Fresh Database?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will clear all <strong>{employerJobs.length} job postings</strong> from this account and give you a <strong>100% clean, fresh database</strong> for <strong>{currentProfile.companyName}</strong>.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Perfect when switching from an old login to start hiring fresh.</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                id="confirm-clear-fresh-db-btn"
                onClick={handleClearJobList}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All & Start Fresh Database</span>
              </button>

              <button
                type="button"
                onClick={handleRestoreSampleJobs}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to 3 Sample Postings (Demo)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsClearDatabaseModalOpen(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. PLAN PAYMENT MODAL (Quick Pay Secure Flow with UPI & QR Generation)   */}
      {/* ========================================================================= */}
      {selectedPlanForPayment && (
        <PlanPaymentModal
          plan={selectedPlanForPayment}
          settings={currentSettings}
          isOpen={isPlanPaymentModalOpen}
          onClose={() => {
            setIsPlanPaymentModalOpen(false);
            setSelectedPlanForPayment(null);
          }}
          onSuccess={handlePaymentSuccess}
          onToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* 17. HR TAX INVOICE & PAYMENT RECEIPT MODAL (HR Records)                   */}
      {/* ========================================================================= */}
      {selectedReceiptTxn && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0047AB] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    HR Tax Invoice & Receipt
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Official Payment Voucher • Quick Pay Verified
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptTxn(null)}
                className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-700">
              {/* Receipt Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Invoice / Receipt No.
                  </span>
                  <span className="font-black font-mono text-slate-900 text-xs">
                    {selectedReceiptTxn.id}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Transaction Date
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedReceiptTxn.date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Billed To (Company)
                  </span>
                  <span className="font-bold text-slate-900 truncate block">
                    {selectedReceiptTxn.companyName || currentProfile.companyName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Payment Gateway / Method
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedReceiptTxn.paymentMode}
                  </span>
                </div>
              </div>

              {/* UTR Reference callout */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Bank UTR Reference
                  </span>
                  <span className="font-mono font-black text-emerald-900 text-xs">
                    {selectedReceiptTxn.utrReference}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedReceiptTxn.utrReference);
                    showToast('📋 UTR Reference copied to clipboard!');
                  }}
                  className="px-2 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Copy
                </button>
              </div>

              {/* Item Details */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5">Item & Description</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5">
                        <div className="font-black text-slate-900">
                          {selectedReceiptTxn.planName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Active Time: {selectedReceiptTxn.activeTime} • Unlimited Recruiter Access
                        </div>
                      </td>
                      <td className="p-2.5 text-right font-black text-slate-900">
                        {selectedReceiptTxn.amount}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/60 font-bold">
                      <td className="p-2.5 text-slate-600">Total Paid (Inclusive of Taxes)</td>
                      <td className="p-2.5 text-right font-black text-[#0047AB] text-sm">
                        {selectedReceiptTxn.amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verification Seal */}
              <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-2 text-[11px] text-blue-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#0047AB] flex-shrink-0" />
                <span>
                  Authorized HR Payment Receipt issued by <strong>Jobs India Financial Services</strong>, Patna.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const receiptText = `JOBS INDIA HR PAYMENT RECEIPT\nReceipt No: ${selectedReceiptTxn.id}\nCompany: ${selectedReceiptTxn.companyName}\nDate: ${selectedReceiptTxn.date}\nPlan: ${selectedReceiptTxn.planName} (${selectedReceiptTxn.activeTime})\nAmount: ${selectedReceiptTxn.amount}\nMode: ${selectedReceiptTxn.paymentMode}\nUTR Reference: ${selectedReceiptTxn.utrReference}\nStatus: Verified`;
                    navigator.clipboard.writeText(receiptText);
                    showToast('📋 Full HR Receipt slip copied to clipboard!');
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center cursor-pointer"
                >
                  Copy Slip
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2 bg-[#0047AB] hover:bg-[#003882] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
