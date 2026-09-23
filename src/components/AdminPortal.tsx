import React, { useState, useMemo } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Users,
  Briefcase,
  Building,
  Check,
  X,
  FileCheck,
  Phone,
  PhoneCall,
  Mail,
  MessageCircle,
  User,
  UserCheck,
  Search,
  ExternalLink,
  Copy,
  Building2,
  Clock,
  BadgeCheck,
  KeyRound,
  LogOut,
  Lock,
  ListOrdered,
  LayoutList,
  CreditCard,
  Sliders,
  Sparkles,
  Database,
  UserPlus,
  Trash2,
  RefreshCw,
  Eraser,
  AlertCircle,
} from 'lucide-react';
import { Job, RecruiterContact, PremiumPlan, PlatformSettings, Application, UserProfile, EmployerProfile } from '../types';
import { getJobRecruiter, INITIAL_JOBS } from '../data/mockJobs';
import {
  loadStoredPremiumPlans,
  saveStoredPremiumPlans,
  loadStoredPlatformSettings,
  saveStoredPlatformSettings,
} from '../data/settingsData';
import { AdminPlansAndSettings } from './AdminPlansAndSettings';
import { AdminLeadsDatabase } from './AdminLeadsDatabase';
import {
  JobSeekerLead,
  EmployerLead,
  loadStoredJobSeekerLeads,
  saveStoredJobSeekerLeads,
  loadStoredEmployerLeads,
  saveStoredEmployerLeads,
  syncLiveJobSeekerLeads,
  syncLiveEmployerLeads,
} from '../data/leadsDatabase';

interface AdminPortalProps {
  jobs: Job[];
  onVerifyJob: (jobId: string) => void;
  onRemoveJob: (jobId: string) => void;
  onCleanDummyJobs?: () => void;
  onClearAllJobs?: () => void;
  onRestoreSampleJobs?: () => void;
  onOpenSwitchMode: () => void;
  onOpenAdminSecurity?: (view?: 'login' | 'reset') => void;
  onLockAdminSession?: () => void;
  plans?: PremiumPlan[];
  settings?: PlatformSettings;
  onSavePlans?: (updatedPlans: PremiumPlan[]) => void;
  onSaveSettings?: (updatedSettings: PlatformSettings) => void;
  applications?: Application[];
  userProfile?: UserProfile;
  employerProfile?: EmployerProfile;
}

export interface RecruiterQueueItem {
  id: string;
  name: string;
  designation: string;
  company: string;
  phone: string;
  email: string;
  kycDocument: string;
  companyGstin: string;
  isVerified: boolean;
  registeredDate: string;
  associatedJobsCount: number;
}

export const DEFAULT_RECRUITER_QUEUE: RecruiterQueueItem[] = [
  {
    id: 'rec-1',
    name: 'Dr. Alok Verma',
    designation: 'Senior Talent Acquisition Lead',
    company: 'Medanta Super Speciality Hospital',
    phone: '+91 98350 12845',
    email: 'alok.verma@medanta.org',
    kycDocument: 'CIN-U85110DL2004PLC128314 (Hospital Reg)',
    companyGstin: '10AAACM1234F1Z8',
    isVerified: true,
    registeredDate: '15 Sep 2026',
    associatedJobsCount: 2,
  },
  {
    id: 'rec-2',
    name: 'Pooja Sharma',
    designation: 'Head HR & Clinical Staffing',
    company: 'Ruban Memorial Hospital',
    phone: '+91 94710 44820',
    email: 'hr.pooja@rubanhospital.com',
    kycDocument: 'PAN-AAACR1294K (Clinical Director Auth)',
    companyGstin: '10AAACR1294K1Z2',
    isVerified: true,
    registeredDate: '18 Sep 2026',
    associatedJobsCount: 1,
  },
  {
    id: 'rec-3',
    name: 'Vikash Kumar Mishra',
    designation: 'Regional HR Manager - Bihar Circle',
    company: 'Bajaj Finserv Consumer Finance',
    phone: '+91 99342 55910',
    email: 'vikash.mishra@bajajfinserv.in',
    kycDocument: 'CIN-L65923PN2007PLC130075',
    companyGstin: '10AAACB1845P1Z7',
    isVerified: true,
    registeredDate: '12 Sep 2026',
    associatedJobsCount: 1,
  },
  {
    id: 'rec-4',
    name: 'Neha Kumari',
    designation: 'Talent Partner - Patna Hub',
    company: 'Flipkart Customer Connect',
    phone: '+91 91223 88102',
    email: 'neha.kumari@flipkartcareers.in',
    kycDocument: 'CIN-U51109KA2012PTC066107',
    companyGstin: '10AAACF8812D1ZX',
    isVerified: true,
    registeredDate: '14 Sep 2026',
    associatedJobsCount: 1,
  },
  {
    id: 'rec-5',
    name: 'Suman Saurabh',
    designation: 'HR Executive',
    company: 'Patliputra Diagnostics & Labs',
    phone: '+91 93341 02948',
    email: 'suman.hr@patliputradiagnostics.in',
    kycDocument: 'Aadhaar Verified • Lab License #BR-PT-8821',
    companyGstin: '10AAACD7712N1Z4',
    isVerified: false,
    registeredDate: 'Today, 09:30 AM',
    associatedJobsCount: 1,
  },
  {
    id: 'rec-6',
    name: 'Rajesh Kumar Sinha',
    designation: 'Area Recruitment Manager',
    company: 'Swiggy Instamart Bihar',
    phone: '+91 94318 90123',
    email: 'rajesh.sinha@swiggy.in',
    kycDocument: 'Corporate PAN & Work ID #SWG-9982',
    companyGstin: '10AAGCS1920L1Z1',
    isVerified: false,
    registeredDate: 'Today, 10:15 AM',
    associatedJobsCount: 1,
  },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  jobs,
  onVerifyJob,
  onRemoveJob,
  onCleanDummyJobs,
  onClearAllJobs,
  onRestoreSampleJobs,
  onOpenSwitchMode,
  onOpenAdminSecurity,
  onLockAdminSession,
  plans: externalPlans,
  settings: externalSettings,
  onSavePlans: externalOnSavePlans,
  onSaveSettings: externalOnSaveSettings,
  applications = [],
  userProfile,
  employerProfile,
}) => {
  const [adminSubTab, setAdminSubTab] = useState<'job-postings' | 'recruiter-verification' | 'database-leads' | 'plans-settings'>('job-postings');
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'numbered-cards' | 'simple-list'>('numbered-cards');
  const [customVerifiedRecruiters, setCustomVerifiedRecruiters] = useState<Record<string, boolean>>({});

  // Database Leads State (Synchronized with live applications & user profiles)
  const [jobSeekerLeads, setJobSeekerLeads] = useState<JobSeekerLead[]>(() => {
    const stored = loadStoredJobSeekerLeads();
    return syncLiveJobSeekerLeads(stored, applications, userProfile);
  });

  const [employerLeads, setEmployerLeads] = useState<EmployerLead[]>(() => {
    const stored = loadStoredEmployerLeads();
    return syncLiveEmployerLeads(stored, jobs, employerProfile);
  });

  const handleUpdateJobSeekerLeadStatus = (leadId: string, newStatus: JobSeekerLead['leadStatus']) => {
    setJobSeekerLeads((prev) => {
      const updated = prev.map((l) => (l.id === leadId ? { ...l, leadStatus: newStatus } : l));
      saveStoredJobSeekerLeads(updated);
      return updated;
    });
    setNotification(`✅ Updated candidate lead status to "${newStatus}"`);
  };

  const handleUpdateEmployerLeadStatus = (leadId: string, newStatus: EmployerLead['leadStatus']) => {
    setEmployerLeads((prev) => {
      const updated = prev.map((l) => (l.id === leadId ? { ...l, leadStatus: newStatus } : l));
      saveStoredEmployerLeads(updated);
      return updated;
    });
    setNotification(`✅ Updated employer lead status to "${newStatus}"`);
  };

  const handleAddJobSeekerLead = (newLeadData: Omit<JobSeekerLead, 'id'>) => {
    const newLead: JobSeekerLead = {
      ...newLeadData,
      id: `lead-js-${Date.now()}`,
    };
    setJobSeekerLeads((prev) => {
      const updated = [newLead, ...prev];
      saveStoredJobSeekerLeads(updated);
      return updated;
    });
  };

  const handleAddEmployerLead = (newLeadData: Omit<EmployerLead, 'id'>) => {
    const newLead: EmployerLead = {
      ...newLeadData,
      id: `lead-emp-${Date.now()}`,
    };
    setEmployerLeads((prev) => {
      const updated = [newLead, ...prev];
      saveStoredEmployerLeads(updated);
      return updated;
    });
  };

  // Plans & Platform Settings state
  const [plans, setPlans] = useState<PremiumPlan[]>(() => externalPlans || loadStoredPremiumPlans());
  const [settings, setSettings] = useState<PlatformSettings>(() => externalSettings || loadStoredPlatformSettings());

  const handleSavePlans = (updated: PremiumPlan[]) => {
    setPlans(updated);
    saveStoredPremiumPlans(updated);
    if (externalOnSavePlans) externalOnSavePlans(updated);
    setNotification('🎉 Subscription plans and pricing saved successfully!');
  };

  const handleSaveSettings = (updated: PlatformSettings) => {
    setSettings(updated);
    saveStoredPlatformSettings(updated);
    if (externalOnSaveSettings) externalOnSaveSettings(updated);
    setNotification('🎉 Platform settings & contacts updated successfully!');
  };

  // Dedicated Recruiter Queue state with localStorage persistence
  const [recruiterQueue, setRecruiterQueue] = useState<RecruiterQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('jobs_india_admin_recruiters_queue');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_RECRUITER_QUEUE;
  });

  const saveRecruiterQueue = (updated: RecruiterQueueItem[]) => {
    setRecruiterQueue(updated);
    try {
      localStorage.setItem('jobs_india_admin_recruiters_queue', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const [isCleanDatabaseModalOpen, setIsCleanDatabaseModalOpen] = useState(false);

  // Identify Dummy vs Real items
  const sampleJobIds = useMemo(() => new Set(INITIAL_JOBS.map((j) => j.id)), []);
  const dummyJobs = useMemo(
    () => jobs.filter((j) => sampleJobIds.has(j.id) || j.id.startsWith('sample-')),
    [jobs, sampleJobIds]
  );
  const dummyRecruiterIds = useMemo(() => new Set(DEFAULT_RECRUITER_QUEUE.map((r) => r.id)), []);
  const dummyRecruiters = useMemo(
    () => recruiterQueue.filter((r) => dummyRecruiterIds.has(r.id) || r.id.startsWith('dummy-')),
    [recruiterQueue, dummyRecruiterIds]
  );

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    notify(`Copied ${label}: ${text}`);
  };

  const handleCleanDummyJobs = () => {
    if (onCleanDummyJobs) {
      onCleanDummyJobs();
    }
    notify(`🧹 Cleaned all ${dummyJobs.length} dummy job postings! Database is now fresh.`);
  };

  const handleClearAllJobs = () => {
    if (onClearAllJobs) {
      onClearAllJobs();
    }
    notify('🧹 All job listings have been cleared.');
  };

  const handleRestoreSampleJobs = () => {
    if (onRestoreSampleJobs) {
      onRestoreSampleJobs();
    }
    notify('🔄 Restored default demo job listings.');
  };

  const handleCleanDummyRecruiters = () => {
    const cleaned = recruiterQueue.filter((r) => !dummyRecruiterIds.has(r.id) && !r.id.startsWith('dummy-'));
    saveRecruiterQueue(cleaned);
    notify(`🧹 Cleaned all ${dummyRecruiters.length} dummy recruiters from moderation queue!`);
  };

  const handleClearAllRecruiters = () => {
    saveRecruiterQueue([]);
    notify('🧹 Cleared all recruiters from moderation queue.');
  };

  const handleRestoreSampleRecruiters = () => {
    saveRecruiterQueue(DEFAULT_RECRUITER_QUEUE);
    notify('🔄 Restored default demo recruiters queue.');
  };

  const handleCleanAllDummyData = () => {
    handleCleanDummyJobs();
    handleCleanDummyRecruiters();
    setIsCleanDatabaseModalOpen(false);
    notify('🧹 Successfully cleaned both Dummy Job Postings and Dummy Recruiters!');
  };

  const handleVerifyRecruiter = (recruiterId: string, name: string) => {
    const updated = recruiterQueue.map((r) =>
      r.id === recruiterId ? { ...r, isVerified: true } : r
    );
    saveRecruiterQueue(updated);
    notify(`Verified Recruiter "${name}"! Badge updated across candidate search.`);
  };

  const handleRejectRecruiter = (recruiterId: string, name: string) => {
    const updated = recruiterQueue.filter((r) => r.id !== recruiterId);
    saveRecruiterQueue(updated);
    notify(`Flagged and removed recruiter profile "${name}".`);
  };

  const handleVerifyRecruiterByName = (recruiterName: string, company: string) => {
    setCustomVerifiedRecruiters((prev) => ({ ...prev, [recruiterName]: true }));
    const updated = recruiterQueue.map((r) =>
      r.name.toLowerCase() === recruiterName.toLowerCase() ||
      r.company.toLowerCase() === company.toLowerCase()
        ? { ...r, isVerified: true }
        : r
    );
    saveRecruiterQueue(updated);
    notify(`Verified HR Recruiter "${recruiterName}" for ${company}! Status updated.`);
  };

  // Filtered jobs with recruiter search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const recruiter = getJobRecruiter(job);
      const isVerified = job.aboutCompany.verified;

      // Status filter
      if (activeFilter === 'verified' && !isVerified) return false;
      if (activeFilter === 'pending' && isVerified) return false;

      // Search filter across title, company, recruiter name, mobile, email
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesJob =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.locality.toLowerCase().includes(q);
        const matchesRecruiter =
          recruiter.name.toLowerCase().includes(q) ||
          recruiter.phone.toLowerCase().includes(q) ||
          recruiter.email.toLowerCase().includes(q) ||
          recruiter.designation.toLowerCase().includes(q);

        return matchesJob || matchesRecruiter;
      }

      return true;
    });
  }, [jobs, activeFilter, searchQuery]);

  // Filtered recruiter queue
  const filteredRecruiters = useMemo(() => {
    return recruiterQueue.filter((rec) => {
      if (activeFilter === 'verified' && !rec.isVerified) return false;
      if (activeFilter === 'pending' && rec.isVerified) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rec.name.toLowerCase().includes(q) ||
          rec.phone.toLowerCase().includes(q) ||
          rec.email.toLowerCase().includes(q) ||
          rec.company.toLowerCase().includes(q) ||
          rec.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [recruiterQueue, activeFilter, searchQuery]);

  const verifiedJobsCount = jobs.filter((j) => j.aboutCompany.verified).length;
  const verifiedRecruitersCount = recruiterQueue.filter((r) => r.isVerified).length;

  return (
    <div id="admin-portal-view" className="min-h-screen bg-[#0F172A] text-slate-100 pb-24">
      {/* Top Admin Bar matching reference */}
      <div className="bg-[#1E1B4B] border-b border-purple-900/60 text-white px-4 py-3 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A855F7]/25 border border-[#A855F7]/40 flex items-center justify-center text-[#C084FC]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-tight text-white">
                  Admin Moderation Panel
                </h1>
                <span className="bg-[#A855F7]/30 text-[#C084FC] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A855F7]/40">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-purple-200/70">
                Jobs India • Trust, Verification & Safety
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Password & Security Reset Button */}
            <button
              id="admin-security-btn"
              onClick={() => onOpenAdminSecurity?.('reset')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-600/50 text-xs font-semibold transition-colors"
              title="Reset or Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Reset Password</span>
            </button>

            {/* Total Leads Database Top Button */}
            <button
              id="admin-topbar-leads-db-btn"
              onClick={() => setAdminSubTab('database-leads')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                adminSubTab === 'database-leads'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400/50'
                  : 'bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-600/40'
              }`}
              title="Total Leads in Database (Job Seekers & Employers)"
            >
              <Database className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden md:inline">Leads Database</span>
            </button>

            {/* Plans & Other Settings Top Button */}
            <button
              id="admin-topbar-plans-settings-btn"
              onClick={() => setAdminSubTab('plans-settings')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                adminSubTab === 'plans-settings'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md border border-pink-400/50'
                  : 'bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-600/40'
              }`}
              title="Edit Choose Your Plan & Other Settings"
            >
              <CreditCard className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden md:inline">Plans & Settings</span>
            </button>

            {/* Clean Dummy List Top Button */}
            <button
              id="admin-topbar-clean-dummy-btn"
              onClick={() => setIsCleanDatabaseModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border border-rose-700/60 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Clean and remove dummy mock list of Job Postings and Recruiters"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Clean Dummy List</span>
              {(dummyJobs.length > 0 || dummyRecruiters.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Lock / Exit Admin Session */}
            <button
              id="admin-lock-btn"
              onClick={onLockAdminSession}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-800/40 text-xs font-semibold transition-colors"
              title="Lock Admin Session and Exit"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>

            {/* Switch Mode */}
            <button
              id="admin-switch-mode-btn"
              onClick={onOpenSwitchMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/50 text-xs font-bold transition-colors"
            >
              <span>Switch Mode</span>
              <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="mx-4 mt-3 bg-[#A855F7]/20 border border-[#A855F7]/40 rounded-2xl p-3 flex items-center gap-2.5 text-[#E9D5FF] text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#A855F7] flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Admin Dashboard Content */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Statistics Tiles - Real Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          <div className="bg-[#1E293B] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Listings</span>
            <span className="text-base sm:text-lg font-extrabold text-white">{jobs.length}</span>
          </div>
          <div className="bg-[#1E293B] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Verified Jobs</span>
            <span className="text-base sm:text-lg font-extrabold text-[#10B981]">
              {verifiedJobsCount}
            </span>
          </div>
          <div
            onClick={() => setAdminSubTab('database-leads')}
            className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-2.5 rounded-2xl border border-blue-700/50 cursor-pointer hover:border-blue-500 transition-all col-span-2 sm:col-span-1 shadow-xs"
            title="Click to view Total Leads in Database"
          >
            <span className="text-[10px] text-sky-300 block font-extrabold flex items-center justify-center gap-1">
              <Database className="w-3 h-3 text-sky-400" />
              Total Leads DB
            </span>
            <span className="text-base sm:text-lg font-black text-white">
              {jobSeekerLeads.length + employerLeads.length}
            </span>
            <span className="text-[9px] text-blue-300/80 block">
              {jobSeekerLeads.length} JS • {employerLeads.length} Emp
            </span>
          </div>
          <div className="bg-[#1E293B] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Recruiters</span>
            <span className="text-base sm:text-lg font-extrabold text-[#38BDF8]">
              {verifiedRecruitersCount}/{recruiterQueue.length}
            </span>
          </div>
          <div className="bg-[#1E293B] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Active Plans</span>
            <span className="text-base sm:text-lg font-extrabold text-pink-400">{plans.length}</span>
          </div>
        </div>

        {/* Clean Dummy Database Action Card */}
        <div
          id="admin-clean-dummy-database-banner"
          className="bg-gradient-to-r from-rose-950/70 via-purple-950/40 to-slate-900 border border-rose-800/50 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/25 border border-rose-500/40 text-rose-300 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-xs">
                  Clean Dummy List (Job Postings & Recruiters)
                </span>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                  Moderation Maintenance
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {dummyJobs.length === 0 && dummyRecruiters.length === 0 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-400" />
                    All dummy lists are clean! Database has 0 sample mock listings.
                  </span>
                ) : (
                  <>
                    Detected:{' '}
                    <span className="font-bold text-rose-300">
                      {dummyJobs.length} Dummy Job{dummyJobs.length === 1 ? '' : 's'}
                    </span>{' '}
                    and{' '}
                    <span className="font-bold text-rose-300">
                      {dummyRecruiters.length} Dummy Recruiter{dummyRecruiters.length === 1 ? '' : 's'}
                    </span>{' '}
                    in moderation queue.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="admin-clean-dummy-database-btn"
              onClick={() => setIsCleanDatabaseModalOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clean Dummy List</span>
            </button>
            {dummyJobs.length === 0 && dummyRecruiters.length === 0 && (
              <button
                id="admin-restore-demo-all-btn"
                onClick={() => {
                  handleRestoreSampleJobs();
                  handleRestoreSampleRecruiters();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Restore demo mock jobs and recruiters"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restore Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Highlight 1: Total Leads in Database (Job Seekers & Employers) */}
        <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-blue-800/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs">
                  Total Leads in Database: {jobSeekerLeads.length + employerLeads.length} Records
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.2 rounded-full border border-blue-500/30">
                  Job Seekers & Employers
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {jobSeekerLeads.length} Job Seeker leads & {employerLeads.length} verified Employer leads with mobile, email, resume, and direct WhatsApp actions.
              </p>
            </div>
          </div>
          <button
            id="admin-open-leads-db-card-btn"
            onClick={() => setAdminSubTab('database-leads')}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Open Leads Database</span>
          </button>
        </div>

        {/* Feature Highlight 2: Choose Your Plan & Other Settings Banner */}
        <div className="bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-pink-900/30 border border-purple-700/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs">
                  "Choose Your Plan" & Platform Settings
                </span>
                <span className="bg-pink-500/20 text-pink-300 text-[10px] font-bold px-2 py-0.2 rounded-full border border-pink-500/30">
                  Live Editor
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Update 1M, 3M, 6M pricing, original prices, savings labels, best value badge, and support contacts.
              </p>
            </div>
          </div>
          <button
            id="admin-open-plans-settings-card-btn"
            onClick={() => setAdminSubTab('plans-settings')}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Plans & Settings</span>
          </button>
        </div>

        {/* Admin Password & Security Access Card */}
        <div className="bg-[#1E293B]/80 border border-purple-900/40 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">Admin Access Security</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Password Enforced
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorized super admin panel. You can reset or update your security password anytime.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAdminSecurity?.('reset')}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
          >
            <span>Reset Password</span>
          </button>
        </div>

        {/* Section Header & View Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Admin Management & Configuration</span>
            </h2>

            {/* Status Filter Pills (Active on job/recruiter moderation) */}
            {adminSubTab === 'job-postings' || adminSubTab === 'recruiter-verification' ? (
              <div className="flex gap-1 bg-[#1E293B] p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeFilter === 'all' ? 'bg-[#A855F7] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('verified')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeFilter === 'verified' ? 'bg-[#A855F7] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeFilter === 'pending' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending
                </button>
              </div>
            ) : null}
          </div>

          {/* Sub-Tabs: 4-column switcher including Job Postings, Recruiters, Leads Database, Choose Your Plan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#1E293B]/70 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="admin-tab-job-postings-btn"
              onClick={() => setAdminSubTab('job-postings')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                adminSubTab === 'job-postings'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Postings ({filteredJobs.length})</span>
            </button>

            <button
              id="admin-tab-recruiter-queue-btn"
              onClick={() => setAdminSubTab('recruiter-verification')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                adminSubTab === 'recruiter-verification'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Recruiters ({filteredRecruiters.length})</span>
            </button>

            <button
              id="admin-tab-database-leads-btn"
              onClick={() => setAdminSubTab('database-leads')}
              className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                adminSubTab === 'database-leads'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-blue-400/50'
                  : 'text-sky-300 hover:text-white bg-blue-950/40 hover:bg-blue-900/60 border border-blue-900/40'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Total Leads ({jobSeekerLeads.length + employerLeads.length})</span>
            </button>

            <button
              id="admin-tab-plans-settings-btn"
              onClick={() => setAdminSubTab('plans-settings')}
              className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                adminSubTab === 'plans-settings'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-1 ring-pink-400/50'
                  : 'text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-pink-300" />
              <span>Plans & Settings</span>
            </button>
          </div>

          {/* Search Bar for Recruiter Name, Mobile No, Email ID, Company (Hidden in leads-db and settings tab) */}
          {(adminSubTab === 'job-postings' || adminSubTab === 'recruiter-verification') && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Recruiter Name, Mobile No, Email ID, or Company..."
                className="w-full pl-9 pr-8 py-2 bg-[#1E293B] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: JOB POSTINGS MODERATION (with Recruiter Name, Mobile No, Email ID & Numbering) */}
        {adminSubTab === 'job-postings' && (
          <div className="space-y-3">
            {/* Numbering Header Bar, Clean Dummy Button & View Layout Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-purple-400" />
                  <span>Numbered Job Postings ({filteredJobs.length})</span>
                </span>
                {filteredJobs.length > 0 && (
                  <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/60 font-semibold font-mono">
                    #1 – #{filteredJobs.length}
                  </span>
                )}
                {dummyJobs.length > 0 && (
                  <span className="text-[10px] text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60 font-medium">
                    {dummyJobs.length} dummy sample listings
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Clean Dummy Jobs Action Button */}
                {dummyJobs.length > 0 ? (
                  <button
                    type="button"
                    id="admin-clean-dummy-jobs-btn"
                    onClick={handleCleanDummyJobs}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-950/70 hover:bg-red-900/90 text-rose-200 border border-rose-700/60 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title={`Clean and remove ${dummyJobs.length} dummy mock job listings`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clean Dummy Jobs ({dummyJobs.length})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="admin-restore-dummy-jobs-btn"
                    onClick={handleRestoreSampleJobs}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    title="Restore demo mock job listings for testing"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Restore Demo Jobs</span>
                  </button>
                )}

                {/* View Layout Switcher: Numbered Cards vs Simple Numbered List */}
                <div className="flex items-center gap-1 bg-[#1E293B] p-0.5 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    id="admin-view-cards-btn"
                    onClick={() => setViewLayout('numbered-cards')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                      viewLayout === 'numbered-cards'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Detailed Numbered Cards"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Numbered Cards</span>
                  </button>
                  <button
                    type="button"
                    id="admin-view-simple-btn"
                    onClick={() => setViewLayout('simple-list')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                      viewLayout === 'simple-list'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Simple Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>Simple List</span>
                  </button>
                </div>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-[#1E293B] p-8 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Clean Slate • 0 Job Postings</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Dummy job postings have been cleaned. Live employer postings will appear here for verification.
                  </p>
                </div>
                <button
                  type="button"
                  id="admin-empty-restore-jobs-btn"
                  onClick={handleRestoreSampleJobs}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-600/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Demo Sample Jobs</span>
                </button>
              </div>
            ) : viewLayout === 'simple-list' ? (
              /* ================== SIMPLE NUMBERED LIST VIEW ================== */
              <div className="space-y-2.5">
                {filteredJobs.map((job, index) => {
                  const recruiter = getJobRecruiter(job);
                  const isVerified = job.aboutCompany.verified;
                  const isRecruiterVerified = Boolean(
                    recruiter.isVerified ||
                    customVerifiedRecruiters[recruiter.name] ||
                    recruiterQueue.some((r) => r.name.toLowerCase() === recruiter.name.toLowerCase() && r.isVerified)
                  );

                  return (
                    <div
                      key={job.id}
                      id={`admin-simple-job-${job.id}`}
                      className="bg-[#1E293B] p-3.5 rounded-2xl border border-slate-800/90 space-y-2.5 hover:border-purple-500/50 transition-colors shadow-sm"
                    >
                      {/* Top Row: Sequential Number, Job Title, Company, Salary & Verification Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {/* Sequential Number Badge */}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200 font-extrabold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                            #{index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-bold text-white leading-tight">
                                {job.title}
                              </h3>
                              {isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {job.company} • {job.locality}, {job.location}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-[#38BDF8] font-bold text-xs block">
                            {job.salary}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                              isVerified
                                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {isVerified ? 'Verified Job' : 'Pending Job'}
                          </span>
                        </div>
                      </div>

                      {/* Recruiter Details Row: Name, Mobile, Email, HR Verification */}
                      <div className="bg-[#0F172A]/85 rounded-xl p-2.5 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {/* 1. Recruiter / HR Name */}
                        <div className="flex items-start gap-2">
                          <User className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 block font-medium">HR / Recruiter Name</span>
                            <span className="font-bold text-white block truncate text-xs">
                              {recruiter.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {recruiter.designation}
                            </span>
                          </div>
                        </div>

                        {/* 2. Official Mobile No */}
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-start gap-2 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block font-medium">Official Mobile No</span>
                              <span className="font-bold text-emerald-400 font-mono tracking-wide block truncate text-xs">
                                {recruiter.phone}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a
                              href={`tel:${recruiter.phone.replace(/[^0-9+]/g, '')}`}
                              className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                              title="Direct Phone Call"
                            >
                              <PhoneCall className="w-3 h-3" />
                            </a>
                            <a
                              href={`https://wa.me/${recruiter.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                              title="WhatsApp Message"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => copyToClipboard(recruiter.phone, 'Mobile Number')}
                              className="p-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Copy Mobile"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* 3. Official Email ID */}
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-start gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block font-medium">Official Work Email</span>
                              <span className="font-medium text-sky-300 block truncate text-xs">
                                {recruiter.email}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a
                              href={`mailto:${recruiter.email}?subject=Job%20Moderation%20(Listing%20%23${index + 1})%20-%20Jobs%20India&body=Hello%20${encodeURIComponent(recruiter.name)},`}
                              className="p-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => copyToClipboard(recruiter.email, 'Email ID')}
                              className="p-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Copy Email"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Recruiter HR Verification Status & Admin Controls */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-slate-400">Recruiter HR:</span>
                          {isRecruiterVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Verified HR ID</span>
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                                ⏳ Pending KYC
                              </span>
                              <button
                                onClick={() => handleVerifyRecruiterByName(recruiter.name, job.company)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                              >
                                <Check className="w-2.5 h-2.5" />
                                <span>Verify HR</span>
                              </button>
                            </div>
                          )}
                          {recruiter.kycDocument && (
                            <span className="text-[10px] text-slate-400 hidden md:inline">
                              KYC: {recruiter.kycDocument}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!isVerified && (
                            <button
                              onClick={() => {
                                onVerifyJob(job.id);
                                notify(`Approved Job Listing #${index + 1} (${job.title})!`);
                              }}
                              className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          <button
                            id={`admin-remove-job-${job.id}`}
                            onClick={() => {
                              onRemoveJob(job.id);
                              notify(`Removed Listing #${index + 1} "${job.title}".`);
                            }}
                            className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Remove / Take Down Job Listing"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Take Down</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ================== DETAILED NUMBERED CARDS VIEW ================== */
              filteredJobs.map((job, index) => {
                const recruiter = getJobRecruiter(job);
                const isVerified = job.aboutCompany.verified;
                const isRecruiterVerified = Boolean(
                  recruiter.isVerified ||
                  customVerifiedRecruiters[recruiter.name] ||
                  recruiterQueue.some((r) => r.name.toLowerCase() === recruiter.name.toLowerCase() && r.isVerified)
                );

                return (
                  <div
                    key={job.id}
                    id={`admin-job-${job.id}`}
                    className="bg-[#1E293B] p-4 rounded-2xl border border-slate-800/80 space-y-3 hover:border-purple-500/40 transition-colors shadow-sm"
                  >
                    {/* Header: Sequential Number, Title, Company, Location, and Status Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Prominent Sequential Number Badge */}
                        <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200 font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                          #{index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                              {job.title}
                            </h3>
                            {isVerified && (
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {job.company} • {job.locality}, {job.location}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 flex-shrink-0 ${
                          isVerified
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Verified Employer</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* PROMINENT RECRUITER & HR CONTACT VERIFICATION BOX */}
                    <div className="bg-[#0F172A]/80 border border-slate-700/60 rounded-xl p-3 space-y-2.5">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-700/50">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#C084FC]" />
                          <span>Recruiter & HR Contact Details (Listing #{index + 1})</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isRecruiterVerified
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {isRecruiterVerified ? '✓ Verified Recruiter ID' : '⏳ KYC Pending'}
                          </span>
                          {!isRecruiterVerified && (
                            <button
                              onClick={() => handleVerifyRecruiterByName(recruiter.name, job.company)}
                              className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors"
                            >
                              Verify HR ID
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Recruiter Details Grid: Name, Mobile No, Email ID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {/* 1. Recruiter Name */}
                        <div className="flex items-start gap-2 bg-[#1E293B]/60 p-2 rounded-lg border border-slate-800">
                          <User className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 block font-medium">HR / Recruiter Name</span>
                            <span className="font-bold text-white truncate block">
                              {recruiter.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {recruiter.designation}
                            </span>
                          </div>
                        </div>

                        {/* 2. Recruiter Mobile No with Call & WhatsApp Buttons */}
                        <div className="bg-[#1E293B]/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-1">
                          <div className="flex items-start gap-2 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block font-medium">Official Mobile No</span>
                              <span className="font-bold text-emerald-400 tracking-wide text-xs block truncate font-mono">
                                {recruiter.phone}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a
                              href={`tel:${recruiter.phone.replace(/[^0-9+]/g, '')}`}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                              title="Direct Phone Call"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${recruiter.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => copyToClipboard(recruiter.phone, 'Mobile Number')}
                              className="p-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Copy Mobile"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* 3. Recruiter Official Email ID */}
                        <div className="bg-[#1E293B]/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-1 sm:col-span-2">
                          <div className="flex items-start gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block font-medium">Official Work Email ID</span>
                              <span className="font-semibold text-sky-300 text-xs block truncate">
                                {recruiter.email}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a
                              href={`mailto:${recruiter.email}?subject=Job%20Posting%20Moderation%20(Listing%20%23${index + 1})%20-%20Jobs%20India&body=Hello%20${encodeURIComponent(recruiter.name)},`}
                              className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              title="Compose Email"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Email HR</span>
                            </a>
                            <button
                              onClick={() => copyToClipboard(recruiter.email, 'Email ID')}
                              className="p-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Copy Email"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Recruiter KYC Document Info & Verification Date */}
                      <div className="pt-1.5 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <FileCheck className="w-3 h-3 text-purple-400 flex-shrink-0" />
                          <span>KYC: {recruiter.kycDocument || 'CIN-Verified'}</span>
                          {recruiter.companyGstin && (
                            <span className="hidden sm:inline text-slate-400">
                              • GSTIN: {recruiter.companyGstin}
                            </span>
                          )}
                        </span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3 text-emerald-400" />
                          <span>{recruiter.verifiedAt || 'Verified on Jobs India Platform'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Salary & Action Controls */}
                    <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-700/50 pt-2.5">
                      <span className="text-[#38BDF8] font-bold text-sm">{job.salary}</span>
                      <div className="flex items-center gap-2">
                        {!isVerified && (
                          <button
                            onClick={() => {
                              onVerifyJob(job.id);
                              notify(`Approved and marked "${job.company}" & Recruiter ${recruiter.name} as Verified!`);
                            }}
                            className="px-3 py-1.5 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify & Approve</span>
                          </button>
                        )}
                        <button
                          id={`admin-remove-job-${job.id}`}
                          onClick={() => {
                            onRemoveJob(job.id);
                            notify(`Removed listing #${index + 1} "${job.title}" by ${recruiter.name}.`);
                          }}
                          className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Remove / Take Down Job Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Take Down</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: RECRUITER VERIFICATION QUEUE (Detailed Recruiter KYC & Contact Identity) */}
        {adminSubTab === 'recruiter-verification' && (
          <div className="space-y-3">
            <div className="bg-[#1E1B4B]/70 border border-purple-800/40 rounded-2xl p-3.5 flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <h3 className="font-bold text-white">Recruiter Verification & KYC Portal</h3>
                <p className="text-slate-300">
                  Verify HR official identity, phone, corporate email domain, and CIN/GSTIN business registration documents to keep job seekers safe.
                </p>
              </div>
            </div>

            {/* Recruiter Queue Header Bar & Clean Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Recruiter Queue ({filteredRecruiters.length})</span>
                </span>
                {dummyRecruiters.length > 0 && (
                  <span className="text-[10px] text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60 font-medium">
                    {dummyRecruiters.length} dummy sample profiles
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {dummyRecruiters.length > 0 ? (
                  <button
                    type="button"
                    id="admin-clean-dummy-recruiters-btn"
                    onClick={handleCleanDummyRecruiters}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-950/70 hover:bg-red-900/90 text-rose-200 border border-rose-700/60 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title={`Clean and remove ${dummyRecruiters.length} dummy mock recruiter profiles`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clean Dummy Recruiters ({dummyRecruiters.length})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="admin-restore-dummy-recruiters-btn"
                    onClick={handleRestoreSampleRecruiters}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    title="Restore demo mock recruiters for testing"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Restore Demo Recruiters</span>
                  </button>
                )}
              </div>
            </div>

            {filteredRecruiters.length === 0 ? (
              <div className="bg-[#1E293B] p-8 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Clean Queue • 0 Recruiters</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    All dummy recruiter profiles have been cleaned. Newly registered HRs will appear here for KYC review.
                  </p>
                </div>
                <button
                  type="button"
                  id="admin-empty-restore-recruiters-btn"
                  onClick={handleRestoreSampleRecruiters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-600/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Demo Recruiters</span>
                </button>
              </div>
            ) : (
              filteredRecruiters.map((rec, index) => (
                <div
                  key={rec.id}
                  id={`admin-recruiter-${rec.id}`}
                  className="bg-[#1E293B] p-4 rounded-2xl border border-slate-800/80 space-y-3 hover:border-purple-500/40 transition-colors shadow-sm"
                >
                  {/* Recruiter Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {/* Recruiter Sequential Number & Avatar */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-200 font-extrabold text-[11px] flex items-center justify-center font-mono">
                          #{index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {rec.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{rec.name}</h3>
                          {rec.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{rec.designation}</p>
                        <p className="text-xs text-purple-300 font-semibold flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-purple-400" />
                          <span>{rec.company}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        rec.isVerified
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {rec.isVerified ? 'Verified HR Partner' : 'KYC Review Pending'}
                    </span>
                  </div>

                  {/* Recruiter Contact Credentials: Mobile No & Email ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#0F172A]/70 p-3 rounded-xl border border-slate-700/60">
                    {/* Mobile Number */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block">Mobile No</span>
                          <span className="font-bold text-emerald-400 tracking-wide text-xs block truncate">
                            {rec.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={`tel:${rec.phone.replace(/[^0-9+]/g, '')}`}
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="Call"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${rec.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(rec.phone, 'Mobile')}
                          className="p-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Work Email ID */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block">Email ID</span>
                          <span className="font-semibold text-sky-300 text-xs block truncate">
                            {rec.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={`mailto:${rec.email}?subject=Recruiter%20Verification%20-%20Jobs%20India`}
                          className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-colors"
                          title="Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(rec.email, 'Email')}
                          className="p-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* KYC Document & GSTIN */}
                    <div className="sm:col-span-2 pt-2 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-300 gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="text-slate-400">KYC Doc:</span>
                        <span className="font-medium text-slate-200">{rec.kycDocument}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                        <span>GSTIN: {rec.companyGstin}</span>
                        <span>• Active Posts: {rec.associatedJobsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500">
                      Registered: {rec.registeredDate}
                    </span>

                    <div className="flex items-center gap-2">
                      {!rec.isVerified ? (
                        <button
                          onClick={() => handleVerifyRecruiter(rec.id, rec.name)}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify Recruiter & Docs</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Credentials Approved</span>
                        </span>
                      )}

                      <button
                        id={`admin-remove-recruiter-${rec.id}`}
                        onClick={() => handleRejectRecruiter(rec.id, rec.name)}
                        className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Remove recruiter from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Recruiter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: TOTAL LEADS IN DATABASE (JOB SEEKERS & EMPLOYERS) */}
        {adminSubTab === 'database-leads' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <AdminLeadsDatabase
              jobSeekerLeads={jobSeekerLeads}
              employerLeads={employerLeads}
              onUpdateJobSeekerLeadStatus={handleUpdateJobSeekerLeadStatus}
              onUpdateEmployerLeadStatus={handleUpdateEmployerLeadStatus}
              onAddJobSeekerLead={handleAddJobSeekerLead}
              onAddEmployerLead={handleAddEmployerLead}
              onToast={(msg) => setNotification(msg)}
            />
          </div>
        )}

        {/* TAB 4: CHOOSE YOUR PLAN & OTHER PLATFORM SETTINGS */}
        {adminSubTab === 'plans-settings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <AdminPlansAndSettings
              plans={plans}
              settings={settings}
              onSavePlans={handleSavePlans}
              onSaveSettings={handleSaveSettings}
              onToast={(msg) => setNotification(msg)}
            />
          </div>
        )}
      </div>

      {/* Clean Dummy Database & Postings Modal */}
      {isCleanDatabaseModalOpen && (
        <div
          id="admin-clean-dummy-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#1E293B] border border-rose-800/60 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-slate-100">
            <button
              id="close-clean-dummy-modal-btn"
              onClick={() => setIsCleanDatabaseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Clean Dummy Postings & Recruiters</h3>
                <p className="text-xs text-rose-200/80">Admin Moderation & Database Reset</p>
              </div>
            </div>

            <div className="bg-[#0F172A] p-3.5 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Remove hardcoded sample demo job postings and dummy recruiter profiles from the Admin Panel to keep your production workspace clean.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-2.5">
                  <span className="text-[10px] text-rose-300 block font-bold">Dummy Job Postings</span>
                  <span className="text-lg font-black text-white">{dummyJobs.length}</span>
                  <span className="text-[10px] text-slate-400 block">Sample mock listings</span>
                </div>
                <div className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-2.5">
                  <span className="text-[10px] text-rose-300 block font-bold">Dummy Recruiters</span>
                  <span className="text-lg font-black text-white">{dummyRecruiters.length}</span>
                  <span className="text-[10px] text-slate-400 block">Sample mock profiles</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Clean Job Postings */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-2">
                <div>
                  <span className="font-bold text-xs text-white block">1. Clean Dummy Job Postings</span>
                  <span className="text-[11px] text-slate-400">
                    Removes {dummyJobs.length} sample mock jobs from database.
                  </span>
                </div>
                <button
                  id="modal-clean-dummy-jobs-btn"
                  disabled={dummyJobs.length === 0}
                  onClick={() => {
                    handleCleanDummyJobs();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    dummyJobs.length > 0
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clean Jobs ({dummyJobs.length})</span>
                </button>
              </div>

              {/* Clean Recruiters */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-2">
                <div>
                  <span className="font-bold text-xs text-white block">2. Clean Dummy Recruiters Queue</span>
                  <span className="text-[11px] text-slate-400">
                    Removes {dummyRecruiters.length} sample mock HR recruiter profiles.
                  </span>
                </div>
                <button
                  id="modal-clean-dummy-recruiters-btn"
                  disabled={dummyRecruiters.length === 0}
                  onClick={() => {
                    handleCleanDummyRecruiters();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    dummyRecruiters.length > 0
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clean Recruiters ({dummyRecruiters.length})</span>
                </button>
              </div>

              {/* 1-Click Clean Both */}
              <button
                id="modal-clean-all-dummy-btn"
                onClick={handleCleanAllDummyData}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-98 text-white text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eraser className="w-4 h-4" />
                <span>Clean All Dummy Lists (Job Postings + Recruiters)</span>
              </button>

              {/* Restore Sample Data */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  id="modal-restore-all-demo-btn"
                  onClick={() => {
                    handleRestoreSampleJobs();
                    handleRestoreSampleRecruiters();
                    setIsCleanDatabaseModalOpen(false);
                  }}
                  className="text-xs text-slate-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Demo Sample Data</span>
                </button>

                <button
                  id="modal-done-btn"
                  onClick={() => setIsCleanDatabaseModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
